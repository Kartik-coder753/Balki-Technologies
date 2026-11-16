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
import { createRequire } from 'module';

const cjsRequire = createRequire(import.meta.url);
const TMP_OUT = path.join(process.cwd(), '.tmp-vercel-test-out');

function cleanup() {
  if (fs.existsSync(TMP_OUT)) {
    fs.rmSync(TMP_OUT, { recursive: true, force: true });
  }
}

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

function bundleHandler(srcRel: string, outRel: string): string {
  const outFile = path.join(TMP_OUT, 'api', outRel);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  execSync(
    `npx esbuild ${srcRel} --bundle --platform=node --format=cjs --packages=external --outfile=${outFile}`,
    { stdio: 'pipe' }
  );
  return outFile;
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
  cleanup();

  // 0. Assert Vercel Hobby Plan Serverless Function Count <= 12
  const apiEntrypoints = collectVercelServerlessFiles(path.join(process.cwd(), 'api'));
  assert.ok(apiEntrypoints.length <= 12, `Expected <= 12 Vercel serverless functions, found ${apiEntrypoints.length}: ${apiEntrypoints.join(', ')}`);
  assert.deepStrictEqual(apiEntrypoints, ['api/index.ts', 'api/razorpay/webhook.ts']);
  console.log(`PASS: Vercel Serverless Function count is ${apiEntrypoints.length} (Hobby limit: 12): ${apiEntrypoints.join(', ')}`);

  fs.mkdirSync(path.join(TMP_OUT, 'api'), { recursive: true });
  fs.writeFileSync(path.join(TMP_OUT, 'api', 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2));

  // Set isolated test environment (never touch live Firestore in unit tests)
  process.env.VERCEL = '1';
  process.env.NODE_ENV = 'production';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_99887766554433';
  process.env.RAZORPAY_KEY_SECRET = 'test_secret_key_for_hmac_tests';
  process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_secret_for_webhook_tests';
  process.env.ORDER_APPROVAL_THRESHOLD_INR = '5000';
  process.env.ORDER_SIGNATURE_SECRET = 'test_order_signature_secret_2026_verify';
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  delete process.env.FIREBASE_CLIENT_EMAIL;
  delete process.env.FIREBASE_PRIVATE_KEY;

  const indexMod = cjsRequire(bundleHandler('api/index.ts', 'index.cjs'));
  const webhookMod = cjsRequire(bundleHandler('api/razorpay/webhook.ts', 'razorpay/webhook.cjs'));
  const apiHandler: (req: any, res: any) => any = indexMod.default || indexMod;
  const webhookHandler: (req: any, res: any) => any = webhookMod.default || webhookMod;

  assert.strictEqual(typeof apiHandler, 'function');
  assert.strictEqual(typeof webhookHandler, 'function');
  assert.strictEqual(indexMod.config?.api?.bodyParser, false);
  assert.strictEqual(webhookMod.config?.api?.bodyParser, false);
  console.log('PASS: Consolidated Vercel CommonJS bundles (api/index & api/razorpay/webhook) built and loaded cleanly');

  // 1. Health & /api root & Razorpay Config Status via Vercel rewrite (?__apiPath=...)
  const rootRes = await invokeHandler(apiHandler, { method: 'GET', url: '/api' });
  assert.strictEqual(rootRes.status, 200);
  assert.strictEqual(rootRes.json?.success, true);

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
  console.log('PASS: /api, /api/health, and /api/razorpay/config-status work via consolidated gateway');

  // 2. Query param preservation & 404 JSON
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
  console.log('PASS: ?__apiPath rewrites preserve query params and return structured 404 JSON');

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
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
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
  assert.strictEqual(verifyIdempotentRes.status, 200);
  assert.strictEqual(verifyIdempotentRes.json?.alreadyVerified, true);

  const secondPayId = 'pay_test_conflict_002';
  const secondSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
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
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
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

  cleanup();
  console.log('ALL CONSOLIDATED VERCEL SERVERLESS (2 FUNCTIONS) & RAZORPAY TESTS PASSED.');
}

run().catch((err) => {
  cleanup();
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
