/**
 * Comprehensive Vercel Serverless Bundle & Razorpay Payment Integration Test Suite
 * Verifies Vercel Hobby serverless function limit (<= 12 functions, consolidated to 2)
 * and exercises all API, Razorpay, Webhook, Order threshold, and Rewrite routes.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import assert from 'assert';
import { execSync } from 'child_process';
import { pathToFileURL } from 'url';

function collectVercelServerlessFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue; // Vercel ignores _-prefixed files/folders
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectVercelServerlessFiles(full));
    } else if (/\.(ts|js|mjs|cjs)$/i.test(entry.name)) {
      results.push(path.relative(process.cwd(), full));
    }
  }
  return results.sort();
}

async function invokeHandler(
  handlerFn: (req: any, res: any) => any,
  opts: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string | Buffer;
  }
): Promise<{ status: number; headers: http.IncomingHttpHeaders; text: string; json: any }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        handlerFn(req, res);
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: (err as Error).message }));
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: addr.port,
          path: opts.url,
          method: opts.method,
          headers: opts.headers || {}
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', c => chunks.push(c));
          res.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            let json: any = null;
            try {
              json = JSON.parse(text);
            } catch {
              json = null;
            }
            server.close(() => resolve({ status: res.statusCode || 0, headers: res.headers, text, json }));
          });
        }
      );
      req.on('error', err => {
        server.close(() => reject(err));
      });
      if (opts.body !== undefined) {
        req.write(opts.body);
      }
      req.end();
    });
  });
}

async function run() {
  // Rebuild production Vercel native ESM .mjs serverless bundles
  execSync(
    'npx esbuild api/_lib/indexEntry.ts --bundle --platform=node --format=esm --packages=external --outfile=api/index.mjs && npx esbuild api/_lib/webhookEntry.ts --bundle --platform=node --format=esm --packages=external --outfile=api/razorpay/webhook.mjs',
    { stdio: 'pipe' }
  );

  // 0. Assert Vercel Hobby Plan Serverless Function Count <= 12
  const apiEntrypoints = collectVercelServerlessFiles(path.join(process.cwd(), 'api'));
  assert.ok(apiEntrypoints.length <= 12, `Expected <= 12 Vercel serverless functions, found ${apiEntrypoints.length}: ${apiEntrypoints.join(', ')}`);
  assert.deepStrictEqual(apiEntrypoints, ['api/index.mjs', 'api/razorpay/webhook.mjs']);
  console.log(`PASS: Vercel Serverless Function count is ${apiEntrypoints.length} (Hobby limit: 12): ${apiEntrypoints.join(', ')}`);

  // Set isolated test environment (never touch live Firestore in unit tests), including accidental wrapping quotes test
  process.env.VERCEL = '1';
  process.env.NODE_ENV = 'production';
  process.env.RAZORPAY_KEY_ID = '"rzp_test_99887766554433"';
  process.env.RAZORPAY_KEY_SECRET = '"test_secret_key_for_hmac_tests"';
  process.env.RAZORPAY_WEBHOOK_SECRET = '"whsec_test_secret_for_webhook_tests"';
  process.env.ORDER_APPROVAL_THRESHOLD_INR = '5000';
  process.env.ORDER_SIGNATURE_SECRET = 'test_order_signature_secret_2026_verify';
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  delete process.env.FIREBASE_CLIENT_EMAIL;
  delete process.env.FIREBASE_PRIVATE_KEY;

  const indexMod = await import(pathToFileURL(path.join(process.cwd(), 'api/index.mjs')).href);
  const webhookMod = await import(pathToFileURL(path.join(process.cwd(), 'api/razorpay/webhook.mjs')).href);
  assert.strictEqual(typeof indexMod.default, 'function');
  assert.strictEqual(typeof webhookMod.default, 'function');
  const apiHandler: (req: any, res: any) => any = indexMod.default;
  const webhookHandler: (req: any, res: any) => any = webhookMod.default;

  assert.strictEqual(indexMod.config?.api?.bodyParser, false);
  assert.strictEqual(webhookMod.config?.api?.bodyParser, false);
  console.log('PASS: Native ESM Vercel functions (api/index.mjs & api/razorpay/webhook.mjs) export default + config cleanly');

  // 1. Health & /api root & Razorpay Config Status via Vercel rewrite (?__apiPath=...)
  const rootRes = await invokeHandler(apiHandler, { method: 'GET', url: '/api' });
  assert.strictEqual(rootRes.status, 200);
  assert.strictEqual(rootRes.json?.success, true);
  assert.ok(typeof rootRes.headers['x-request-id'] === 'string' && rootRes.headers['x-request-id'].length > 0);
  assert.ok(typeof rootRes.json?.requestId === 'string' && rootRes.json.requestId.length > 0);

  const healthRes = await invokeHandler(apiHandler, { method: 'GET', url: '/api/index?__apiPath=health' });
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthRes.json?.success, true);
  assert.strictEqual(healthRes.json?.environment, 'vercel-serverless');
  assert.strictEqual(healthRes.json?.razorpayConfigured, true);
  assert.strictEqual(healthRes.json?.webhookConfigured, true);

  const cfgRes = await invokeHandler(apiHandler, {
    method: 'GET',
    url: '/api/index?__apiPath=razorpay/config-status'
  });
  assert.strictEqual(cfgRes.status, 200);
  assert.strictEqual(cfgRes.json?.mode, 'test');
  console.log('PASS: /api, /api/health, and /api/razorpay/config-status work via consolidated CJS gateway with X-Request-Id');

  // 2. Catalog, Courses, Rentals, Inventory, Case Studies, Support Tickets + Query param preservation & 404 JSON
  for (const route of ['products', 'courses', 'rentals', 'inventory', 'case-studies', 'support/tickets']) {
    const r = await invokeHandler(apiHandler, { method: 'GET', url: `/api/index?__apiPath=${route}` });
    assert.strictEqual(r.status, 200, `${route} expected 200`);
    assert.ok(Array.isArray(r.json) && r.json.length > 0, `${route} expected non-empty array`);
  }

  const prodRes = await invokeHandler(apiHandler, {
    method: 'GET',
    url: '/api/index?__apiPath=products&category=microcontrollers'
  });
  assert.strictEqual(prodRes.status, 200);
  assert.ok(Array.isArray(prodRes.json) && prodRes.json.length > 0);

  const notFoundRes = await invokeHandler(apiHandler, {
    method: 'GET',
    url: '/api/index?__apiPath=does/not/exist'
  });
  assert.strictEqual(notFoundRes.status, 404);
  assert.strictEqual(notFoundRes.json?.code, 'API_ROUTE_NOT_FOUND');
  assert.ok(typeof notFoundRes.json?.requestId === 'string' && notFoundRes.json.requestId.length > 0);
  console.log('PASS: All GET catalog/support routes & ?__apiPath rewrites work via native ESM gateway with requestId');

  // 3. Server-side Calculation: < ₹5,000, = ₹5,000, > ₹5,000
  const smallCalcRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(smallCalcRes.status, 200);
  assert.strictEqual(smallCalcRes.json?.orderCategory, 'SMALL_ORDER');
  assert.strictEqual(smallCalcRes.json?.requiresApproval, false);
  assert.strictEqual(smallCalcRes.json?.amountInPaise, Math.round(smallCalcRes.json.finalAmount * 100));

  process.env.ORDER_APPROVAL_THRESHOLD_INR = String(smallCalcRes.json.finalAmount);
  const exactBoundaryRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(exactBoundaryRes.status, 200);
  assert.strictEqual(exactBoundaryRes.json?.requiresApproval, true);
  assert.strictEqual(exactBoundaryRes.json?.orderCategory, 'LARGE_ORDER');
  process.env.ORDER_APPROVAL_THRESHOLD_INR = '5000';

  const largeCalcRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-141', quantity: 1 }] })
  });
  assert.strictEqual(largeCalcRes.status, 200);
  assert.strictEqual(largeCalcRes.json?.requiresApproval, true);
  assert.strictEqual(largeCalcRes.json?.orderCategory, 'LARGE_ORDER');
  console.log('PASS: Server-side pricing enforces < ₹5,000, = ₹5,000, and > ₹5,000 rules');

  // 4. Small-order checkout & Large-order threshold enforcement
  const blockedLarge = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/checkout-small',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@school.edu.in',
      customerPhone: '9876543210',
      deliveryAddress: { street: 'Plot 12', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
      items: [{ productId: 'mat-prod-141', quantity: 1 }]
    })
  });
  assert.strictEqual(blockedLarge.status, 400);
  assert.strictEqual(blockedLarge.json?.code, 'APPROVAL_REQUIRED');

  const smallCheckoutRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/checkout-small',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@school.edu.in',
      customerPhone: '9876543210',
      deliveryAddress: { street: 'Plot 12', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
      items: [{ productId: 'mat-prod-1', quantity: 1 }]
    })
  });
  assert.strictEqual(smallCheckoutRes.status, 201);
  assert.ok(smallCheckoutRes.json?.order?.id);
  assert.ok(smallCheckoutRes.json?.orderToken);
  assert.strictEqual(smallCheckoutRes.json?.order?.paymentStatus, 'Payment Pending');

  const approvalReqRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/request-approval',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Priya Nair',
      customerEmail: 'priya@school.edu.in',
      customerPhone: '9876543210',
      deliveryAddress: { street: 'Lab 4', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
      items: [{ productId: 'mat-prod-141', quantity: 1 }]
    })
  });
  assert.strictEqual(approvalReqRes.status, 201);
  assert.strictEqual(approvalReqRes.json?.request?.approvalStatus, 'PENDING');
  assert.strictEqual(approvalReqRes.json?.request?.paymentStatus, 'NOT_STARTED');
  console.log('PASS: Order threshold routing (< ₹5,000 small checkout & >= ₹5,000 owner approval) works via gateway');

  // 5. Verify-payment via consolidated gateway
  const orderId = smallCheckoutRes.json.order.id;
  const orderToken = smallCheckoutRes.json.orderToken;
  const mockRzpOrderId = 'order_test_001';
  const mockRzpPaymentId = 'pay_test_001';

  const invalidSigRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=razorpay/verify-payment',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      orderToken,
      razorpay_order_id: mockRzpOrderId,
      razorpay_payment_id: mockRzpPaymentId,
      razorpay_signature: 'tampered_signature_123456'
    })
  });
  assert.strictEqual(invalidSigRes.status, 400);
  assert.strictEqual(invalidSigRes.json?.code, 'INVALID_PAYMENT_SIGNATURE');

  const validSig = crypto
    .createHmac('sha256', 'test_secret_key_for_hmac_tests')
    .update(`${mockRzpOrderId}|${mockRzpPaymentId}`)
    .digest('hex');

  const verifySuccessRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=razorpay/verify-payment',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      orderToken,
      razorpay_order_id: mockRzpOrderId,
      razorpay_payment_id: mockRzpPaymentId,
      razorpay_signature: validSig
    })
  });
  assert.strictEqual(verifySuccessRes.status, 200);
  assert.strictEqual(verifySuccessRes.json?.order?.paymentStatus, 'Paid');
  assert.strictEqual(verifySuccessRes.json?.order?.normalizedPaymentStatus, 'paid');

  const verifyIdempotentRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=orders/verify-payment',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      orderToken,
      razorpay_order_id: mockRzpOrderId,
      razorpay_payment_id: mockRzpPaymentId,
      razorpay_signature: validSig
    })
  });
  assert.strictEqual(verifyIdempotentRes.status, 200);
  assert.strictEqual(verifyIdempotentRes.json?.alreadyVerified, true);

  const secondPayId = 'pay_test_conflict_002';
  const secondSig = crypto
    .createHmac('sha256', 'test_secret_key_for_hmac_tests')
    .update(`${mockRzpOrderId}|${secondPayId}`)
    .digest('hex');
  const duplicateConflictRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=razorpay/verify-payment',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      orderToken,
      razorpay_order_id: mockRzpOrderId,
      razorpay_payment_id: secondPayId,
      razorpay_signature: secondSig
    })
  });
  assert.strictEqual(duplicateConflictRes.status, 409);
  assert.strictEqual(duplicateConflictRes.json?.code, 'DUPLICATE_PAYMENT_DETECTED');
  console.log('PASS: /api/razorpay/verify-payment rejects tampered signatures, verifies HMAC, and prevents duplicate payments');

  // 6. Dedicated Webhook handler: raw HTTP body HMAC verification & idempotency
  const whOrderId = 'ORD-2026-WH01';
  const whRawBody = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_wh_001',
          order_id: 'order_wh_001',
          amount: 125684,
          currency: 'INR',
          method: 'upi',
          notes: { balkiOrderId: whOrderId }
        }
      }
    }
  });

  const whInvalidRes = await invokeHandler(webhookHandler, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: { 'Content-Type': 'application/json', 'X-Razorpay-Signature': 'bad_sig' },
    body: whRawBody
  });
  assert.strictEqual(whInvalidRes.status, 401);
  assert.strictEqual(whInvalidRes.json?.code, 'INVALID_WEBHOOK_SIGNATURE');

  const whSig = crypto
    .createHmac('sha256', 'whsec_test_secret_for_webhook_tests')
    .update(whRawBody)
    .digest('hex');

  const whValidRes = await invokeHandler(webhookHandler, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': whSig,
      'X-Razorpay-Event-Id': 'evt_wh_test_001'
    },
    body: whRawBody
  });
  assert.strictEqual(whValidRes.status, 200);
  assert.strictEqual(whValidRes.json?.success, true);

  const whDupRes = await invokeHandler(webhookHandler, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': whSig,
      'X-Razorpay-Event-Id': 'evt_wh_test_001'
    },
    body: whRawBody
  });
  assert.strictEqual(whDupRes.status, 200);
  assert.strictEqual(whDupRes.json?.duplicate, true);
  console.log('PASS: /api/razorpay/webhook preserves raw body bytes, verifies HMAC SHA256, and deduplicates events');

  // 7. Missing Razorpay credentials resilience
  delete process.env.RAZORPAY_KEY_ID;
  const unconfiguredRes = await invokeHandler(apiHandler, {
    method: 'POST',
    url: '/api/index?__apiPath=razorpay/create-order',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(unconfiguredRes.status, 503);
  assert.strictEqual(unconfiguredRes.json?.code, 'RAZORPAY_NOT_CONFIGURED');
  console.log('PASS: Missing Razorpay credentials fail cleanly with 503 JSON');

  console.log('ALL CONSOLIDATED VERCEL SERVERLESS (2 NATIVE ESM FUNCTIONS) & RAZORPAY TESTS PASSED.');
}

run().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
