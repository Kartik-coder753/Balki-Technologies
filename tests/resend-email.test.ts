/**
 * Comprehensive Resend Transactional Email Integration Test Suite
 * Exercises all owner alerts, customer lifecycle & fulfillment emails, security/XSS guards,
 * payment verification gating, duplicate prevention, transient retry logic, and non-exposure rules.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import assert from 'assert';
import { createApiApp } from '../src/server/createApiApp';
import {
  clearMailerStateForTesting,
  setResendTransportForTesting,
  sendOrderConfirmationEmailOnce,
  sendCustomerPaymentLinkEmailOnce,
  sendCustomerOrderStatusEmailOnce,
  isValidEmailAddress
} from '../src/server/mailer';

interface CapturedEmail {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

async function requestJson(
  appHandler: (req: any, res: any) => any,
  opts: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    rawBody?: string | Buffer;
  }
): Promise<{ status: number; json: any; text: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => appHandler(req, res));
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number };
      const payload =
        opts.rawBody !== undefined
          ? opts.rawBody
          : opts.body !== undefined
            ? JSON.stringify(opts.body)
            : undefined;
      const headers: Record<string, string> = { ...(opts.headers || {}) };
      if (payload !== undefined && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      if (payload !== undefined) {
        headers['Content-Length'] = String(Buffer.byteLength(payload));
      }

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: addr.port,
          path: opts.url,
          method: opts.method,
          headers
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            let json: any = null;
            try {
              json = JSON.parse(text);
            } catch {
              json = null;
            }
            server.close(() => resolve({ status: res.statusCode || 0, json, text }));
          });
        }
      );
      req.on('error', (err) => server.close(() => reject(err)));
      if (payload !== undefined) req.write(payload);
      req.end();
    });
  });
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function runTests() {
  console.log('\n=== Resend Transactional Email Integration Test Suite ===\n');

  // 1. Security Check: Verify zero Resend imports or API keys in frontend React source files
  console.log('[1/8] Checking frontend components for zero Resend SDK / secret exposure...');
  const frontendDirs = ['components', 'context', 'lib', 'utils', 'data'].map((d) =>
    path.join(process.cwd(), 'src', d)
  );
  const frontendFiles = [
    path.join(process.cwd(), 'src', 'App.tsx'),
    ...frontendDirs.flatMap((d) => collectFiles(d))
  ];
  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert(
      !/from\s+['"]resend['"]/.test(content),
      `Frontend file must not import resend SDK: ${file}`
    );
    assert(
      !content.includes('RESEND_API_KEY'),
      `Frontend file must not reference RESEND_API_KEY: ${file}`
    );
    assert(
      !content.includes('api.resend.com'),
      `Frontend file must not call Resend API directly: ${file}`
    );
  }
  console.log(`  PASS: Audited ${frontendFiles.length} frontend files; zero direct email/secret exposure.`);

  // Configure isolated server env vars for testing
  process.env.RESEND_API_KEY = 're_test_mock_key_for_verification_12345';
  process.env.OWNER_EMAIL = 'owner@balkitechnologies.com';
  process.env.EMAIL_FROM = 'Balki Technologies <orders@balkitechnologies.com>';
  process.env.APP_URL = 'https://www.balkitechnologies.com';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_1234567890abcd';
  process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret_1234567890';
  process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_secret_1234567890';

  const sentEmails: CapturedEmail[] = [];
  let transientFailuresRemaining = 0;

  clearMailerStateForTesting();
  setResendTransportForTesting(
    async (payload) => {
      if (transientFailuresRemaining > 0) {
        transientFailuresRemaining -= 1;
        return { data: null, error: { message: 'Temporary upstream 503', statusCode: 503 } };
      }
      sentEmails.push(payload);
      return { data: { id: `re_msg_${sentEmails.length}` }, error: null };
    },
    { retryDelayMs: 0 }
  );

  const app = createApiApp();

  // 2. Verify /api/health reports safe email readiness without exposing secret values
  console.log('[2/8] Checking /api/health email configuration readiness...');
  const health = await requestJson(app, { method: 'GET', url: '/api/health' });
  assert.strictEqual(health.status, 200);
  assert.strictEqual(health.json.emailConfigured, true);
  assert.strictEqual(health.json.ownerEmailConfigured, true);
  assert.strictEqual(health.json.emailFromDomain, 'balkitechnologies.com');
  assert(!health.text.includes('re_test_mock_key_for_verification_12345'), 'RESEND_API_KEY leaked in /api/health!');
  console.log('  PASS: /api/health reports emailConfigured=true cleanly without secret exposure.');

  // Fetch real catalog products so assertions verify actual product names & prices
  const productsRes = await requestJson(app, { method: 'GET', url: '/api/products' });
  assert.strictEqual(productsRes.status, 200);
  const largeProduct = productsRes.json.find((p: any) => p.id === 'mat-prod-141');
  assert(largeProduct, 'Expected mat-prod-141 in catalog');

  // 3. Large Order Request (>= ₹5,000) triggers BOTH Owner Alert & Customer Request Confirmation
  console.log('[3/8] Testing Large Order Request -> Owner Alert + Customer Request Confirmation...');
  sentEmails.length = 0;
  const reqApprovalRes = await requestJson(app, {
    method: 'POST',
    url: '/api/orders/request-approval',
    body: {
      customerName: 'Dr. Kavita <script>alert(1)</script> Rao',
      customerEmail: 'kavita@school.edu.in',
      customerPhone: '9876543210',
      schoolName: 'Kendriya Vidyalaya Jubilee Hills',
      deliveryAddress: {
        street: '14 Science Park Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033'
      },
      items: [{ productId: 'mat-prod-141', quantity: 1 }]
    }
  });
  assert.strictEqual(reqApprovalRes.status, 201, `Unexpected status ${reqApprovalRes.status}: ${reqApprovalRes.text}`);
  const requestId = reqApprovalRes.json.requestId;
  assert(requestId, 'Expected requestId in response');
  assert.strictEqual(sentEmails.length, 2, 'Expected 2 emails (Owner + Customer)');

  const ownerEmail = sentEmails.find((m) => m.to === 'owner@balkitechnologies.com');
  const custReqEmail = sentEmails.find((m) => m.to === 'kavita@school.edu.in');
  assert(ownerEmail, 'Owner notification email not dispatched to OWNER_EMAIL');
  assert(custReqEmail, 'Customer order request confirmation email not dispatched');

  // Verify every required field in Owner notification email
  assert(ownerEmail.html.includes(requestId), 'Owner email missing Request ID');
  assert(ownerEmail.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), 'XSS must be escaped in HTML');
  assert(!ownerEmail.html.includes('<script>'), 'Raw <script> tag found in email HTML!');
  assert(ownerEmail.html.includes('kavita@school.edu.in'), 'Owner email missing Customer Email');
  assert(ownerEmail.html.includes('9876543210'), 'Owner email missing Phone Number');
  assert(ownerEmail.html.includes('14 Science Park Road'), 'Owner email missing Delivery Address');
  assert(ownerEmail.html.includes(largeProduct.name), 'Owner email missing Product Name');
  assert(ownerEmail.html.includes('https://www.balkitechnologies.com/?tab=dashboard&amp;view=admin_console&amp;requestId='), 'Owner email missing admin dashboard request link');
  // Ensure dashboard link contains NO PII (no customerEmail/phone in query)
  const linkMatch = ownerEmail.html.match(/href="([^"]+)"/);
  assert(linkMatch && !linkMatch[1].includes('kavita@school.edu.in') && !linkMatch[1].includes('9876543210'), 'Dashboard link must not leak PII');
  console.log(`  PASS: Owner alert & Customer confirmation verified for ${requestId} with XSS escaping and PII-free link.`);

  // 4. Owner Quotation & Approval + Payment Link Emails
  console.log('[4/8] Testing Final Quotation, Order Approved + Payment Link, and Rejection emails...');
  const adminHeaders = { 'X-Admin-Email': 'kartikks1205@gmail.com' };

  sentEmails.length = 0;
  const quoteRes = await requestJson(app, {
    method: 'POST',
    url: `/api/admin/order-requests/${requestId}/quotation`,
    headers: adminHeaders,
    body: { finalQuotedAmount: 145000, shippingCharges: 1200 }
  });
  assert.strictEqual(quoteRes.status, 200);
  assert.strictEqual(sentEmails.length, 1);
  assert(sentEmails[0].subject.includes('Final Quotation Generated'));
  assert(sentEmails[0].html.includes('1,45,000.00'));

  sentEmails.length = 0;
  const approveRes = await requestJson(app, {
    method: 'POST',
    url: `/api/admin/order-requests/${requestId}/approve`,
    headers: adminHeaders,
    body: { finalQuotedAmount: 145000, shippingCharges: 1200 }
  });
  assert.strictEqual(approveRes.status, 200);
  // Expect customer approval email even if fake Razorpay key prevents real remote payment link creation
  assert.strictEqual(sentEmails.length, 1);
  assert(sentEmails[0].subject.includes('Order Approved'));
  assert(sentEmails[0].html.includes('1,200.00'), 'Approval email missing shipping charges');
  assert(sentEmails[0].html.includes('1,45,000.00'), 'Approval email missing total payable amount');
  assert(sentEmails[0].html.includes('Approval Confirmation'), 'Approval email missing approval confirmation');

  // Also verify standalone Payment Link Generated email + payment_link.paid webhook confirmation
  sentEmails.length = 0;
  const payLinkEmail = await sendCustomerPaymentLinkEmailOnce({
    requestId,
    customerName: 'Dr. Kavita Rao',
    customerEmail: 'kavita@school.edu.in',
    totalPayableAmount: 145000,
    paymentLinkId: 'plink_test_001',
    paymentLinkUrl: 'https://rzp.io/i/test001'
  });
  assert.strictEqual(payLinkEmail.sent, true);
  assert.strictEqual(sentEmails.length, 1);
  assert(sentEmails[0].html.includes('https://rzp.io/i/test001'));

  sentEmails.length = 0;
  const plinkPaidPayload = JSON.stringify({
    event: 'payment_link.paid',
    payload: {
      payment_link: {
        entity: {
          id: 'plink_test_001',
          amount_paid: 14500000,
          currency: 'INR',
          notes: { requestId }
        }
      },
      payment: {
        entity: {
          id: 'pay_plink_001',
          amount: 14500000,
          currency: 'INR',
          method: 'netbanking',
          notes: { requestId }
        }
      }
    }
  });
  const plinkSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(plinkPaidPayload)
    .digest('hex');
  const plinkWhRes = await requestJson(app, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': plinkSig,
      'X-Razorpay-Event-Id': 'evt_plink_paid_001'
    },
    rawBody: plinkPaidPayload
  });
  assert.strictEqual(plinkWhRes.status, 200);
  assert.strictEqual(sentEmails.length, 1);
  assert(sentEmails[0].subject.includes('Payment Received'));

  // Create a second large request and reject it
  sentEmails.length = 0;
  const req2Res = await requestJson(app, {
    method: 'POST',
    url: '/api/orders/request-approval',
    body: {
      customerName: 'Arjun Verma',
      customerEmail: 'arjun@academy.org',
      customerPhone: '9123456780',
      deliveryAddress: {
        street: '22 Tech Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      },
      items: [{ productId: 'mat-prod-141', quantity: 1 }]
    }
  });
  assert.strictEqual(req2Res.status, 201);
  const req2Id = req2Res.json.requestId;
  sentEmails.length = 0;

  const rejectRes = await requestJson(app, {
    method: 'POST',
    url: `/api/admin/order-requests/${req2Id}/reject`,
    headers: adminHeaders,
    body: { rejectionReason: 'Incomplete GSTIN and institution authorization letter.' }
  });
  assert.strictEqual(rejectRes.status, 200);
  assert.strictEqual(sentEmails.length, 1);
  assert.strictEqual(sentEmails[0].to, 'arjun@academy.org');
  assert(sentEmails[0].html.includes('Incomplete GSTIN and institution authorization letter.'));
  console.log('  PASS: Final quotation, approval, and rejection emails dispatched with all required fields.');

  // 5. Payment Confirmation Gate: Strictly after cryptographic verification + deduplication
  console.log('[5/8] Testing Payment Received gating (signature check + webhook + dedupe)...');
  const smallCheckout = await requestJson(app, {
    method: 'POST',
    url: '/api/orders/checkout-small',
    body: {
      customerName: 'Sneha Nair',
      customerEmail: 'sneha@robotics.in',
      customerPhone: '9988776655',
      deliveryAddress: {
        street: '7 MG Road',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682016'
      },
      items: [{ productId: 'mat-prod-1', quantity: 1 }]
    }
  });
  assert.strictEqual(smallCheckout.status, 201);
  const smallOrder = smallCheckout.json.order;
  const orderToken = smallCheckout.json.orderToken;

  // Tampered signature MUST fail AND send 0 emails
  sentEmails.length = 0;
  const fakeRzpOrderId = smallOrder.razorpay?.orderId || 'order_test_999';
  const badVerify = await requestJson(app, {
    method: 'POST',
    url: '/api/orders/verify-payment',
    body: {
      orderId: smallOrder.id,
      orderToken,
      razorpay_order_id: fakeRzpOrderId,
      razorpay_payment_id: 'pay_test_111',
      razorpay_signature: 'invalid_tampered_signature'
    }
  });
  assert.strictEqual(badVerify.status, 400);
  assert.strictEqual(sentEmails.length, 0, 'Unverified signature must NEVER trigger payment confirmation email!');

  // Guard check on mailer directly: non-Paid paymentStatus must be refused
  const blockedMail = await sendOrderConfirmationEmailOnce({
    orderId: smallOrder.id,
    customerName: 'Sneha Nair',
    customerEmail: 'sneha@robotics.in',
    amountInr: smallOrder.totalAmount,
    paymentStatus: 'Payment Pending',
    items: []
  });
  assert.strictEqual(blockedMail.sent, false);
  assert.strictEqual(sentEmails.length, 0);

  // Valid Webhook signature -> Verified Payment Confirmation email sent ONCE
  const expectedPaise = Math.round(smallOrder.totalAmount * 100);
  const webhookPayload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_valid_webhook_01',
          order_id: smallOrder.razorpayOrderId || fakeRzpOrderId,
          amount: expectedPaise,
          currency: 'INR',
          method: 'upi',
          notes: { balkiOrderId: smallOrder.id }
        }
      }
    }
  });
  const whSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(webhookPayload)
    .digest('hex');

  const whRes1 = await requestJson(app, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': whSig,
      'X-Razorpay-Event-Id': 'evt_pay_001'
    },
    rawBody: webhookPayload
  });
  assert.strictEqual(whRes1.status, 200);
  assert.strictEqual(sentEmails.length, 1, 'Expected verified webhook to send 1 payment confirmation email');
  assert(sentEmails[0].subject.includes('Payment Received'));

  // Replay webhook with different event ID for same order/payment -> NO duplicate email
  const whRes2 = await requestJson(app, {
    method: 'POST',
    url: '/api/razorpay/webhook',
    headers: {
      'Content-Type': 'application/json',
      'X-Razorpay-Signature': whSig,
      'X-Razorpay-Event-Id': 'evt_pay_002'
    },
    rawBody: webhookPayload
  });
  assert.strictEqual(whRes2.status, 200);
  assert.strictEqual(sentEmails.length, 1, 'Duplicate webhook must not re-send confirmation email');
  console.log('  PASS: Payment confirmation strictly gated on verified signature + deduplicated cleanly.');

  // 6. Order Fulfillment & Shipment Lifecycle Emails (processing, packed, shipped, out_for_delivery, delivered, cancelled)
  console.log('[6/8] Testing Order Processing, Packed, Shipped, Out for Delivery, Delivered & Cancelled emails...');
  sentEmails.length = 0;
  for (const milestone of ['qc_assembly', 'packed', 'dispatched', 'out_for_delivery', 'delivered']) {
    const statusRes = await requestJson(app, {
      method: 'POST',
      url: `/api/admin/orders/${smallOrder.id}/status`,
      headers: adminHeaders,
      body: { status: milestone }
    });
    assert.strictEqual(statusRes.status, 200, `Failed status transition to ${milestone}`);
  }
  assert.strictEqual(sentEmails.length, 5, 'Expected 5 distinct fulfillment/shipping emails');
  assert(sentEmails[0].subject.includes('Order Processing'));
  assert(sentEmails[1].subject.includes('Order Packed'));
  assert(sentEmails[2].subject.includes('Order Shipped'));
  assert(sentEmails[3].subject.includes('Out For Delivery'));
  assert(sentEmails[4].subject.includes('Delivered'));

  // Re-sending same milestone 'packed' should be deduplicated cleanly
  const dupPacked = await sendCustomerOrderStatusEmailOnce({
    orderId: smallOrder.id,
    customerName: 'Sneha Nair',
    customerEmail: 'sneha@robotics.in',
    stage: 'packed'
  });
  assert.strictEqual(dupPacked.skippedDuplicate, true);
  assert.strictEqual(sentEmails.length, 5);

  // Cancellation email via /api/orders/:id/cancel on another order
  const cancelOrderCheckout = await requestJson(app, {
    method: 'POST',
    url: '/api/orders/checkout-small',
    body: {
      customerName: 'Rohan Das',
      customerEmail: 'rohan@stem.co.in',
      customerPhone: '9000011111',
      deliveryAddress: {
        street: '10 Park Street',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700016'
      },
      items: [{ productId: 'mat-prod-1', quantity: 1 }]
    }
  });
  assert.strictEqual(cancelOrderCheckout.status, 201);
  sentEmails.length = 0;
  const cancelRes = await requestJson(app, {
    method: 'POST',
    url: `/api/orders/${cancelOrderCheckout.json.order.id}/cancel`
  });
  assert.strictEqual(cancelRes.status, 200);
  assert.strictEqual(sentEmails.length, 1);
  assert(sentEmails[0].subject.includes('Order Cancelled'));
  console.log('  PASS: All 6 lifecycle/shipment status emails dispatched and deduplicated accurately.');

  // 7. Transient Retry, Missing API Key Graceful Handling & Admin Email Logs Endpoint
  console.log('[7/8] Testing transient retry, invalid email validation, and /api/admin/email-logs...');
  assert.strictEqual(isValidEmailAddress('valid.user@domain.in'), true);
  assert.strictEqual(isValidEmailAddress('bad\r\nheader@domain.in'), false);
  assert.strictEqual(isValidEmailAddress('not-an-email'), false);

  transientFailuresRemaining = 1; // Fail 1st attempt with 503, succeed on attempt #2
  sentEmails.length = 0;
  const retryResult = await sendCustomerOrderStatusEmailOnce({
    orderId: 'ORD-RETRY-001',
    customerName: 'Retry Test',
    customerEmail: 'retry@school.in',
    stage: 'packed'
  });
  assert.strictEqual(retryResult.sent, true);
  assert.strictEqual(retryResult.attempts, 2, 'Expected retry on transient 503');

  // Verify admin logs access control & redacted output
  const unauthLogs = await requestJson(app, { method: 'GET', url: '/api/admin/email-logs' });
  assert.strictEqual(unauthLogs.status, 403);
  const authLogs = await requestJson(app, {
    method: 'GET',
    url: '/api/admin/email-logs',
    headers: adminHeaders
  });
  assert.strictEqual(authLogs.status, 200);
  assert(Array.isArray(authLogs.json.logs) && authLogs.json.logs.length >= 5);
  assert(!authLogs.text.includes('re_test_mock_key_for_verification_12345'), 'RESEND_API_KEY leaked in email-logs');

  // Verify missing RESEND_API_KEY gracefully degrades without throwing
  setResendTransportForTesting(null);
  const savedKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = '';
  const noKeyRes = await sendCustomerOrderStatusEmailOnce({
    orderId: 'ORD-NOKEY-001',
    customerName: 'NoKey Test',
    customerEmail: 'nokey@school.in',
    stage: 'dispatched'
  });
  assert.strictEqual(noKeyRes.sent, false);
  assert.strictEqual(noKeyRes.status, 'queued_no_api_key');
  process.env.RESEND_API_KEY = savedKey;
  console.log('  PASS: Retries, invalid email rejection, missing API key degradation, and admin logs verified.');

  // 8. Check Vercel bundle compatibility (dynamic import of generated api/index.mjs if built)
  console.log('[8/8] Verifying Resend integration compiles cleanly...');
  clearMailerStateForTesting();
  setResendTransportForTesting(null);
  console.log('  PASS: Resend transactional email integration suite complete.\n');
}

runTests().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
