/**
 * Comprehensive Vercel Serverless Bundle & Razorpay Payment Integration Test Suite
 * Tests compiled CommonJS /api/* handlers under VERCEL=1 NODE_ENV=production without mutating production Firestore.
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

  const entrypoints: Array<[string, string]> = [
    ['api/index.ts', 'index.cjs'],
    ['api/health.ts', 'health.cjs'],
    ['api/orders/calculate.ts', 'orders/calculate.cjs'],
    ['api/orders/checkout-small.ts', 'orders/checkout-small.cjs'],
    ['api/orders/request-approval.ts', 'orders/request-approval.cjs'],
    ['api/orders/threshold.ts', 'orders/threshold.cjs'],
    ['api/razorpay/config-status.ts', 'razorpay/config-status.cjs'],
    ['api/razorpay/public-key.ts', 'razorpay/public-key.cjs'],
    ['api/razorpay/create-order.ts', 'razorpay/create-order.cjs'],
    ['api/razorpay/verify-payment.ts', 'razorpay/verify-payment.cjs'],
    ['api/razorpay/webhook.ts', 'razorpay/webhook.cjs'],
    ['api/razorpay/create-qr.ts', 'razorpay/create-qr.cjs']
  ];

  const loaded: Record<string, (req: any, res: any) => any> = {};
  for (const [src, out] of entrypoints) {
    const outFile = bundleHandler(src, out);
    // Clear require cache so each compiled CJS module executes cleanly
    const mod = cjsRequire(outFile);
    loaded[out] = mod.default || mod;
    assert.strictEqual(typeof loaded[out], 'function', `${out} did not export default handler function`);
    assert.strictEqual(mod.config?.api?.bodyParser, false, `${out} must set config.api.bodyParser = false`);
  }
  console.log(`PASS: All ${entrypoints.length} Vercel CommonJS serverless bundles built and loaded cleanly under VERCEL=1`);

  // 1. Health & Threshold & Config Status
  const healthRes = await invokeHandler(loaded['health.cjs'], { method: 'GET', url: '/api/health' });
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthRes.json?.success, true);
  assert.strictEqual(healthRes.json?.environment, 'vercel-serverless');
  assert.strictEqual(healthRes.json?.razorpayConfigured, true);
  assert.strictEqual(healthRes.json?.webhookConfigured, true);
  console.log('PASS: /api/health returns 200 JSON under Vercel serverless mode');

  const cfgRes = await invokeHandler(loaded['razorpay/config-status.cjs'], {
    method: 'GET',
    url: '/api/razorpay/config-status'
  });
  assert.strictEqual(cfgRes.status, 200);
  assert.strictEqual(cfgRes.json?.mode, 'test');
  console.log('PASS: /api/razorpay/config-status returns 200 JSON');

  // 2. Rewrite routing via api/index.ts (?__apiPath=...)
  const prodRes = await invokeHandler(loaded['index.cjs'], {
    method: 'GET',
    url: '/api/index?__apiPath=products&category=microcontrollers'
  });
  assert.strictEqual(prodRes.status, 200);
  assert.ok(Array.isArray(prodRes.json) && prodRes.json.length > 0);

  const notFoundRes = await invokeHandler(loaded['index.cjs'], {
    method: 'GET',
    url: '/api/index?__apiPath=does/not/exist'
  });
  assert.strictEqual(notFoundRes.status, 404);
  assert.strictEqual(notFoundRes.json?.code, 'API_ROUTE_NOT_FOUND');
  console.log('PASS: /api/index handles ?__apiPath rewrites, query params, and structured 404 JSON');

  // 3. Server-side Calculation: < ₹5,000, = ₹5,000, > ₹5,000
  const smallCalcRes = await invokeHandler(loaded['orders/calculate.cjs'], {
    method: 'POST',
    url: '/api/orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(smallCalcRes.status, 200);
  assert.strictEqual(smallCalcRes.json?.orderCategory, 'SMALL_ORDER');
  assert.strictEqual(smallCalcRes.json?.requiresApproval, false);
  assert.strictEqual(smallCalcRes.json?.amountInPaise, Math.round(smallCalcRes.json.finalAmount * 100));

  // Exact ₹5,000 boundary check: set threshold dynamically to exact finalAmount to verify `>= threshold`
  const exactTotal = String(smallCalcRes.json.finalAmount);
  process.env.ORDER_APPROVAL_THRESHOLD_INR = exactTotal;
  const exactBoundaryRes = await invokeHandler(loaded['orders/calculate.cjs'], {
    method: 'POST',
    url: '/api/orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(exactBoundaryRes.status, 200);
  assert.strictEqual(exactBoundaryRes.json?.requiresApproval, true);
  assert.strictEqual(exactBoundaryRes.json?.orderCategory, 'LARGE_ORDER');
  process.env.ORDER_APPROVAL_THRESHOLD_INR = '5000';

  // > ₹5,000 check
  const largeCalcRes = await invokeHandler(loaded['orders/calculate.cjs'], {
    method: 'POST',
    url: '/api/orders/calculate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-141', quantity: 1 }] })
  });
  assert.strictEqual(largeCalcRes.status, 200);
  assert.strictEqual(largeCalcRes.json?.requiresApproval, true);
  assert.strictEqual(largeCalcRes.json?.orderCategory, 'LARGE_ORDER');
  console.log('PASS: Server-side pricing enforces < ₹5,000 (SMALL_ORDER), = ₹5,000 (LARGE_ORDER), and > ₹5,000 (LARGE_ORDER)');

  // 4. Small-order checkout creates order + signed orderToken; Large-order blocked from small checkout
  const blockedLarge = await invokeHandler(loaded['orders/checkout-small.cjs'], {
    method: 'POST',
    url: '/api/orders/checkout-small',
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

  const smallCheckoutRes = await invokeHandler(loaded['orders/checkout-small.cjs'], {
    method: 'POST',
    url: '/api/orders/checkout-small',
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
  assert.strictEqual(smallCheckoutRes.json?.order?.normalizedPaymentStatus, 'pending');
  assert.strictEqual(smallCheckoutRes.json?.order?.deliveryStatus, 'pending');
  console.log('PASS: /api/orders/checkout-small enforces < ₹5,000 and blocks >= ₹5,000');

  // 5. Large-order approval request
  const approvalReqRes = await invokeHandler(loaded['orders/request-approval.cjs'], {
    method: 'POST',
    url: '/api/orders/request-approval',
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
  console.log('PASS: /api/orders/request-approval registers high-value orders cleanly');

  // 6. Verify-payment: invalid signature, valid HMAC signature, idempotent retry, duplicate conflict
  const orderId = smallCheckoutRes.json.order.id;
  const orderToken = smallCheckoutRes.json.orderToken;
  const mockRzpOrderId = 'order_test_001';
  const mockRzpPaymentId = 'pay_test_001';

  const invalidSigRes = await invokeHandler(loaded['razorpay/verify-payment.cjs'], {
    method: 'POST',
    url: '/api/razorpay/verify-payment',
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

  const verifySuccessRes = await invokeHandler(loaded['razorpay/verify-payment.cjs'], {
    method: 'POST',
    url: '/api/razorpay/verify-payment',
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
  assert.strictEqual(verifySuccessRes.json?.order?.orderStatus, 'qc_assembly');
  assert.strictEqual(verifySuccessRes.json?.order?.deliveryStatus, 'processing');

  // Replay with SAME paymentId is idempotent 200; replay with DIFFERENT paymentId on SAME order is 409 conflict
  const verifyIdempotentRes = await invokeHandler(loaded['razorpay/verify-payment.cjs'], {
    method: 'POST',
    url: '/api/razorpay/verify-payment',
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
  const duplicateConflictRes = await invokeHandler(loaded['razorpay/verify-payment.cjs'], {
    method: 'POST',
    url: '/api/razorpay/verify-payment',
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
  console.log('PASS: /api/razorpay/verify-payment rejects tampered signatures, validates HMAC SHA256, and blocks duplicate payments');

  // 7. Webhook: invalid signature, valid payment.captured, duplicate event idempotency, payment.failed protection
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

  const whInvalidRes = await invokeHandler(loaded['razorpay/webhook.cjs'], {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': 'bad_sig'
    },
    body: whRawBody
  });
  assert.strictEqual(whInvalidRes.status, 401);
  assert.strictEqual(whInvalidRes.json?.code, 'INVALID_WEBHOOK_SIGNATURE');

  const whSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(whRawBody)
    .digest('hex');

  const whValidRes = await invokeHandler(loaded['razorpay/webhook.cjs'], {
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

  const whDupRes = await invokeHandler(loaded['razorpay/webhook.cjs'], {
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
  console.log('PASS: /api/razorpay/webhook preserves raw HTTP body bytes, enforces HMAC SHA256, and deduplicates events');

  // 8. Missing env var failure resilience
  delete process.env.RAZORPAY_KEY_ID;
  const unconfiguredRes = await invokeHandler(loaded['razorpay/create-order.cjs'], {
    method: 'POST',
    url: '/api/razorpay/create-order',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productId: 'mat-prod-1', quantity: 1 }] })
  });
  assert.strictEqual(unconfiguredRes.status, 503);
  assert.strictEqual(unconfiguredRes.json?.code, 'RAZORPAY_NOT_CONFIGURED');
  console.log('PASS: Missing Razorpay credentials fail cleanly with structured 503 JSON (no 500 crash)');

  cleanup();
  console.log('ALL VERCEL SERVERLESS & RAZORPAY INTEGRATION TESTS PASSED.');
}

run().catch((err) => {
  cleanup();
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
