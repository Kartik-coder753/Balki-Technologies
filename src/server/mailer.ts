import { recordEmailAuditInFirestore } from './firestoreAdmin';

export interface OrderConfirmationEmailInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amountInr: number;
  paymentStatus: string;
  razorpayPaymentId: string;
  items: Array<{ name: string; quantity: number; lineTotal?: number; unitPrice?: number }>;
}

const dispatchedConfirmationEmails = new Set<string>();

export async function sendOrderConfirmationEmailOnce(input: OrderConfirmationEmailInput): Promise<{
  sent: boolean;
  skippedDuplicate: boolean;
  provider: string;
}> {
  const dedupeKey = `${input.orderId}:${input.razorpayPaymentId}`;
  if (dispatchedConfirmationEmails.has(dedupeKey)) {
    return { sent: false, skippedDuplicate: true, provider: 'deduplicated' };
  }
  dispatchedConfirmationEmails.add(dedupeKey);

  const itemsRows = (input.items || [])
    .map(item => {
      const price = item.lineTotal ?? ((item.unitPrice || 0) * item.quantity);
      return `<li><strong>${item.name}</strong> &times; ${item.quantity} — ₹${Number(price).toLocaleString('en-IN')}</li>`;
    })
    .join('');

  const subject = `BALKI TECHNOLOGIES — Order Confirmed (${input.orderId})`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 600px;">
      <h2 style="color: #d97706;">Order Payment Verified & Confirmed</h2>
      <p>Dear ${input.customerName},</p>
      <p>Thank you for ordering from <strong>BALKI TECHNOLOGIES</strong>. Your payment has been cryptographically verified.</p>
      <ul>
        <li><strong>Order Reference:</strong> ${input.orderId}</li>
        <li><strong>Verified Amount:</strong> ₹${Number(input.amountInr).toLocaleString('en-IN')} INR</li>
        <li><strong>Payment Status:</strong> ${input.paymentStatus}</li>
        <li><strong>Razorpay Payment ID:</strong> ${input.razorpayPaymentId}</li>
      </ul>
      <h3>Products</h3>
      <ul>${itemsRows}</ul>
      <p>We will notify you with Delhivery priority tracking updates as soon as QC assembly completes.</p>
    </div>
  `.trim();

  const cleanEnv = (v?: string) => {
    const t = (v || '').trim();
    return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))
      ? t.slice(1, -1).trim()
      : t;
  };
  const resendApiKey = cleanEnv(process.env.RESEND_API_KEY);
  const fromEmail = cleanEnv(process.env.EMAIL_FROM) || 'orders@balkitechnologies.com';
  let provider = 'firestore_audit_queue';
  let delivered = false;

  if (resendApiKey) {
    provider = 'resend';
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [input.customerEmail],
          subject,
          html
        })
      });
      delivered = response.ok;
    } catch (err) {
      console.warn('Resend email dispatch error:', err instanceof Error ? err.message : err);
    }
  }

  await recordEmailAuditInFirestore({
    id: `mail_${input.orderId}_${input.razorpayPaymentId}`,
    to: input.customerEmail,
    subject,
    orderId: input.orderId,
    paymentId: input.razorpayPaymentId,
    amountInr: input.amountInr,
    paymentStatus: input.paymentStatus,
    deliveryProvider: provider,
    delivered,
    html,
    createdAt: new Date().toISOString()
  });

  return { sent: true, skippedDuplicate: false, provider };
}
