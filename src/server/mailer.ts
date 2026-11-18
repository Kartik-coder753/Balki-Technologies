import { Resend } from 'resend';
import { hasEmailAuditBeenSentInFirestore, recordEmailAuditInFirestore } from './firestoreAdmin';

export type TransactionalEmailEvent =
  | 'owner_order_request_alert'
  | 'order_request_received'
  | 'order_approved'
  | 'order_rejected'
  | 'final_quotation_generated'
  | 'payment_link_generated'
  | 'payment_received'
  | 'order_processing'
  | 'order_packed'
  | 'order_shipped'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled';

export type EmailDeliveryStatus =
  | 'sent'
  | 'failed'
  | 'queued_no_api_key'
  | 'skipped_invalid_email'
  | 'skipped_missing_owner_email'
  | 'skipped_duplicate';

export interface EmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface EmailDeliveryResult {
  sent: boolean;
  skippedDuplicate?: boolean;
  status: EmailDeliveryStatus;
  eventType: TransactionalEmailEvent;
  recipientType: 'owner' | 'customer';
  to: string;
  subject: string;
  dedupeKey: string;
  attempts: number;
  resendEmailId?: string;
  provider: 'resend' | 'audit-only';
  error?: string;
  timestamp: string;
}

export interface EmailLogEntry {
  id: string;
  eventType: TransactionalEmailEvent;
  recipientType: 'owner' | 'customer';
  entityId: string;
  to: string;
  subject: string;
  status: EmailDeliveryStatus;
  attempts: number;
  resendEmailId?: string;
  error?: string;
  createdAt: string;
}

export interface EmailConfigStatus {
  configured: boolean;
  fromEmail: string;
  fromDomain: string | null;
  ownerEmailConfigured: boolean;
  ownerEmail: string | null;
}

export type ResendSendTransport = (payload: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) => Promise<{ data?: { id?: string } | null; error?: { message?: string; statusCode?: number; name?: string } | null }>;

const sentEmailDedupeKeys = new Set<string>();
const inFlightEmailDedupeKeys = new Set<string>();
const recentEmailLogs: EmailLogEntry[] = [];
const MAX_EMAIL_LOGS = 200;

let testTransportOverride: ResendSendTransport | null = null;
let testRetryDelayMs: number | null = null;

export function setResendTransportForTesting(
  transport: ResendSendTransport | null,
  options?: { retryDelayMs?: number }
): void {
  testTransportOverride = transport;
  testRetryDelayMs = typeof options?.retryDelayMs === 'number' ? options.retryDelayMs : null;
}

export function clearMailerStateForTesting(): void {
  sentEmailDedupeKeys.clear();
  inFlightEmailDedupeKeys.clear();
  recentEmailLogs.length = 0;
}

export function getRecentEmailLogs(limit = 50): EmailLogEntry[] {
  return recentEmailLogs.slice(0, Math.max(1, Math.min(limit, MAX_EMAIL_LOGS)));
}

function stripWrappingQuotes(value: string | undefined | null): string {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function isPlaceholderValue(value: string): boolean {
  if (!value) return true;
  const upper = value.toUpperCase();
  return (
    upper.includes('YOUR_RESEND') ||
    upper.includes('CHANGE_THIS') ||
    upper.startsWith('MY_') ||
    upper === 'UNDEFINED' ||
    upper === 'NULL'
  );
}

const SECRET_REDACT_PATTERN = /(re_[A-Za-z0-9_]+|rzp_(live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+)/g;

function sanitizeErrorForLog(err: unknown, fallback = 'Email delivery failed'): string {
  if (!err) return fallback;
  if (typeof err === 'string') {
    const cleaned = err.replace(SECRET_REDACT_PATTERN, '[REDACTED]').trim();
    return cleaned || fallback;
  }
  if (err instanceof Error) {
    return err.message.replace(SECRET_REDACT_PATTERN, '[REDACTED]').trim() || fallback;
  }
  if (typeof err === 'object') {
    const anyErr = err as Record<string, any>;
    const raw = anyErr.message || anyErr.error?.message || anyErr.name;
    if (typeof raw === 'string' && raw.trim()) {
      return raw.replace(SECRET_REDACT_PATTERN, '[REDACTED]').trim();
    }
  }
  return fallback;
}

/**
 * Extracts raw email address from either `user@domain.com` or `Display Name <user@domain.com>`.
 */
export function extractRawEmail(input: unknown): string {
  if (typeof input !== 'string') return '';
  const cleaned = stripWrappingQuotes(input).trim();
  const angleMatch = cleaned.match(/<([^<>]+)>/);
  return (angleMatch ? angleMatch[1] : cleaned).trim();
}

export function isValidEmailAddress(input: unknown): boolean {
  if (typeof input !== 'string') return false;
  if (/[\r\n]/.test(input)) return false;
  const raw = extractRawEmail(input);
  if (!raw || raw.length > 254) return false;
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(raw);
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHttpUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function getAppBaseUrl(): string {
  const configured = stripWrappingQuotes(process.env.APP_URL);
  const safe = sanitizeHttpUrl(configured);
  if (safe) {
    return safe.replace(/\/+$/, '');
  }
  return 'https://www.balkitechnologies.com';
}

export function getResendApiKey(): string | null {
  const key = stripWrappingQuotes(process.env.RESEND_API_KEY);
  if (!key || isPlaceholderValue(key) || key.length < 10) return null;
  return key;
}

export function getFromEmail(): string {
  const configured = stripWrappingQuotes(process.env.EMAIL_FROM);
  if (configured && !isPlaceholderValue(configured) && isValidEmailAddress(configured)) {
    return configured.includes('<') ? configured : `Balki Technologies <${configured}>`;
  }
  return 'Balki Technologies <orders@balkitechnologies.com>';
}

export function getOwnerEmail(): string | null {
  const configured = stripWrappingQuotes(process.env.OWNER_EMAIL);
  if (!configured || isPlaceholderValue(configured) || !isValidEmailAddress(configured)) {
    return null;
  }
  return extractRawEmail(configured);
}

export function getEmailConfigStatus(): EmailConfigStatus {
  const apiKey = getResendApiKey();
  const fromEmail = getFromEmail();
  const rawFrom = extractRawEmail(fromEmail);
  const fromDomain = rawFrom.includes('@') ? rawFrom.split('@')[1] : null;
  const ownerEmail = getOwnerEmail();

  return {
    configured: Boolean(apiKey),
    fromEmail,
    fromDomain,
    ownerEmailConfigured: Boolean(ownerEmail),
    ownerEmail
  };
}

function formatInr(amount: number): string {
  const num = Number(amount);
  const safe = Number.isFinite(num) ? num : 0;
  return `₹${safe.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateIst(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  }) + ' IST';
}

function sanitizeDocId(input: string): string {
  return input.replace(/[^A-Za-z0-9._:-]/g, '_').slice(0, 120);
}

function renderItemsTableHtml(items: EmailLineItem[]): string {
  if (!items || items.length === 0) {
    return `
      <tr>
        <td colspan="4" style="padding:12px 10px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;">
          STEM Hardware Package (See attached order reference for details)
        </td>
      </tr>
    `;
  }

  return items
    .map((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(item.unitPrice) || 0;
      const lineTotal = unitPrice * qty;
      return `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;font-weight:600;">
            ${escapeHtml(item.name)}
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:center;">
            ${qty}
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;">
            ${formatInr(unitPrice)}
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;font-weight:700;text-align:right;">
            ${formatInr(lineTotal)}
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderBalkiEmailLayout(params: {
  badgeLabel: string;
  badgeColor?: string;
  heading: string;
  greeting: string;
  introHtml: string;
  detailsRowsHtml?: string;
  items?: EmailLineItem[];
  pricingRowsHtml?: string;
  calloutHtml?: string;
  cta?: { label: string; url: string };
  footerNote?: string;
}): string {
  const safeCtaUrl = params.cta ? sanitizeHttpUrl(params.cta.url) : null;
  const badgeColor = params.badgeColor || '#d97706';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;padding:24px 28px;border-bottom:4px solid #d97706;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size:20px;font-weight:800;letter-spacing:0.6px;color:#ffffff;">BALKI TECHNOLOGIES</div>
                    <div style="font-size:12px;color:#fbbf24;margin-top:4px;font-weight:600;">
                      STEM · Robotics · Atal Tinkering Lab Hardware Solutions
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:6px 12px;border-radius:6px;background-color:${badgeColor};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;">
                      ${escapeHtml(params.badgeLabel)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 12px 0;font-size:20px;line-height:1.3;color:#0f172a;">
                ${escapeHtml(params.heading)}
              </h1>
              <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#1e293b;">
                ${escapeHtml(params.greeting)}
              </p>
              <div style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#334155;">
                ${params.introHtml}
              </div>

              ${
                params.calloutHtml
                  ? `<div style="margin:0 0 20px 0;padding:14px 16px;border-radius:8px;background-color:#fffbeb;border:1px solid #fcd34d;font-size:13px;line-height:1.5;color:#78350f;">
                      ${params.calloutHtml}
                    </div>`
                  : ''
              }

              ${
                params.detailsRowsHtml
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
                      ${params.detailsRowsHtml}
                    </table>`
                  : ''
              }

              ${
                params.items && params.items.length > 0
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px 0;border-collapse:collapse;border:1px solid #e2e8f0;">
                      <thead>
                        <tr style="background-color:#f8fafc;">
                          <th align="left" style="padding:10px 8px;border-bottom:2px solid #cbd5e1;font-size:12px;color:#475569;text-transform:uppercase;">Product</th>
                          <th align="center" style="padding:10px 8px;border-bottom:2px solid #cbd5e1;font-size:12px;color:#475569;text-transform:uppercase;">Qty</th>
                          <th align="right" style="padding:10px 8px;border-bottom:2px solid #cbd5e1;font-size:12px;color:#475569;text-transform:uppercase;">Unit Price</th>
                          <th align="right" style="padding:10px 8px;border-bottom:2px solid #cbd5e1;font-size:12px;color:#475569;text-transform:uppercase;">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${renderItemsTableHtml(params.items)}
                      </tbody>
                    </table>`
                  : ''
              }

              ${
                params.pricingRowsHtml
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 22px 0;background-color:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
                      ${params.pricingRowsHtml}
                    </table>`
                  : ''
              }

              ${
                safeCtaUrl && params.cta
                  ? `<div style="text-align:center;margin:24px 0 8px 0;">
                      <a href="${escapeHtml(safeCtaUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 26px;background-color:#d97706;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
                        ${escapeHtml(params.cta.label)}
                      </a>
                    </div>`
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:18px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;line-height:1.5;">
              <div><strong>BALKI TECHNOLOGIES</strong> · Corporate &amp; Logistics Hub, Hyderabad, Telangana</div>
              <div>Support Helpline: +91 9071199139 · Website: <a href="https://www.balkitechnologies.com" style="color:#d97706;text-decoration:none;">www.balkitechnologies.com</a></div>
              ${params.footerNote ? `<div style="margin-top:6px;">${escapeHtml(params.footerNote)}</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function renderDetailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#475569;width:38%;font-weight:600;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;vertical-align:top;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function renderPricingRow(label: string, value: string, highlight = false): string {
  return `
    <tr>
      <td style="padding:8px 14px;border-bottom:1px solid #e2e8f0;font-size:${highlight ? '15px' : '13px'};color:${highlight ? '#0f172a' : '#475569'};font-weight:${highlight ? '800' : '600'};">
        ${escapeHtml(label)}
      </td>
      <td align="right" style="padding:8px 14px;border-bottom:1px solid #e2e8f0;font-size:${highlight ? '16px' : '13px'};color:${highlight ? '#b45309' : '#0f172a'};font-weight:${highlight ? '800' : '600'};">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableResendFailure(statusCode?: number, errorMessage?: string): boolean {
  if (typeof statusCode === 'number') {
    if (statusCode === 429 || statusCode >= 500) return true;
    if (statusCode >= 400 && statusCode < 500) return false;
  }
  const lower = (errorMessage || '').toLowerCase();
  return (
    lower.includes('timeout') ||
    lower.includes('econnreset') ||
    lower.includes('network') ||
    lower.includes('rate limit') ||
    lower.includes('temporarily unavailable')
  );
}

function pushEmailLog(entry: EmailLogEntry): void {
  recentEmailLogs.unshift(entry);
  if (recentEmailLogs.length > MAX_EMAIL_LOGS) {
    recentEmailLogs.length = MAX_EMAIL_LOGS;
  }
}

async function dispatchTransactionalEmailOnce(params: {
  dedupeKey: string;
  eventType: TransactionalEmailEvent;
  recipientType: 'owner' | 'customer';
  entityId: string;
  to: string | null | undefined;
  subject: string;
  html: string;
  text: string;
  amountInr: number;
  paymentStatus: string;
  paymentId?: string;
}): Promise<EmailDeliveryResult> {
  const nowIso = new Date().toISOString();
  const docId = sanitizeDocId(params.dedupeKey);

  // 1. In-memory duplicate and concurrency guard
  if (sentEmailDedupeKeys.has(params.dedupeKey) || inFlightEmailDedupeKeys.has(params.dedupeKey)) {
    return {
      sent: false,
      skippedDuplicate: true,
      status: 'skipped_duplicate',
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: String(params.to || ''),
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts: 0,
      provider: 'resend',
      timestamp: nowIso
    };
  }

  // 2. Durable Firestore duplicate guard (prevents duplicates across serverless cold starts)
  if (await hasEmailAuditBeenSentInFirestore(docId)) {
    sentEmailDedupeKeys.add(params.dedupeKey);
    return {
      sent: false,
      skippedDuplicate: true,
      status: 'skipped_duplicate',
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: String(params.to || ''),
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts: 0,
      provider: 'resend',
      timestamp: nowIso
    };
  }

  // 3. Recipient email validation
  if (params.recipientType === 'owner' && (!params.to || !String(params.to).trim())) {
    const errMsg = 'OWNER_EMAIL environment variable is missing or invalid.';
    console.warn(`[Mailer] ${params.eventType} skipped for ${params.entityId}: ${errMsg}`);
    pushEmailLog({
      id: docId,
      eventType: params.eventType,
      recipientType: params.recipientType,
      entityId: params.entityId,
      to: '',
      subject: params.subject,
      status: 'skipped_missing_owner_email',
      attempts: 0,
      error: errMsg,
      createdAt: nowIso
    });
    return {
      sent: false,
      status: 'skipped_missing_owner_email',
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: '',
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts: 0,
      provider: 'audit-only',
      error: errMsg,
      timestamp: nowIso
    };
  }

  if (!isValidEmailAddress(params.to)) {
    const errMsg = 'Recipient email address is invalid or empty.';
    console.warn(`[Mailer] ${params.eventType} skipped for ${params.entityId}: ${errMsg}`);
    pushEmailLog({
      id: docId,
      eventType: params.eventType,
      recipientType: params.recipientType,
      entityId: params.entityId,
      to: String(params.to || ''),
      subject: params.subject,
      status: 'skipped_invalid_email',
      attempts: 0,
      error: errMsg,
      createdAt: nowIso
    });
    return {
      sent: false,
      status: 'skipped_invalid_email',
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: String(params.to || ''),
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts: 0,
      provider: 'audit-only',
      error: errMsg,
      timestamp: nowIso
    };
  }

  const recipientEmail = extractRawEmail(params.to);
  const fromEmail = getFromEmail();
  const apiKey = getResendApiKey();

  // 4. API key readiness check (unless test transport override is explicitly attached)
  if (!apiKey && !testTransportOverride) {
    const errMsg = 'RESEND_API_KEY is not configured on the server.';
    console.info(`[Mailer] ${params.eventType} recorded in audit-only mode (${params.entityId}): ${errMsg}`);
    await recordEmailAuditInFirestore({
      id: docId,
      to: recipientEmail,
      subject: params.subject,
      orderId: params.entityId,
      paymentId: params.paymentId,
      amountInr: params.amountInr,
      paymentStatus: params.paymentStatus,
      eventType: params.eventType,
      recipientType: params.recipientType,
      status: 'queued_no_api_key',
      attempts: 0,
      error: errMsg,
      deliveryProvider: 'audit-only',
      delivered: false,
      html: params.html,
      createdAt: nowIso
    });
    pushEmailLog({
      id: docId,
      eventType: params.eventType,
      recipientType: params.recipientType,
      entityId: params.entityId,
      to: recipientEmail,
      subject: params.subject,
      status: 'queued_no_api_key',
      attempts: 0,
      error: errMsg,
      createdAt: nowIso
    });
    return {
      sent: false,
      status: 'queued_no_api_key',
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: recipientEmail,
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts: 0,
      provider: 'audit-only',
      error: errMsg,
      timestamp: nowIso
    };
  }

  inFlightEmailDedupeKeys.add(params.dedupeKey);
  const maxAttempts = 3;
  let attempts = 0;
  let lastErrorMsg = '';
  let sentId: string | undefined;
  let delivered = false;

  try {
    const transport: ResendSendTransport =
      testTransportOverride ||
      (async (payload) => {
        const resend = new Resend(apiKey!);
        return await resend.emails.send(payload as any);
      });

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      attempts = attempt;
      try {
        const response = await transport({
          from: fromEmail,
          to: recipientEmail,
          subject: params.subject,
          html: params.html,
          text: params.text
        });

        if (response?.error) {
          const statusCode = typeof response.error.statusCode === 'number' ? response.error.statusCode : undefined;
          lastErrorMsg = sanitizeErrorForLog(response.error, 'Resend API returned an error.');
          if (attempt < maxAttempts && isRetryableResendFailure(statusCode, lastErrorMsg)) {
            const delay = testRetryDelayMs ?? attempt * 180;
            if (delay > 0) await sleep(delay);
            continue;
          }
          break;
        }

        sentId = response?.data?.id || undefined;
        delivered = true;
        break;
      } catch (err: any) {
        const statusCode = typeof err?.statusCode === 'number' ? err.statusCode : undefined;
        lastErrorMsg = sanitizeErrorForLog(err, 'Resend transport failure');
        if (attempt < maxAttempts && isRetryableResendFailure(statusCode, lastErrorMsg)) {
          const delay = testRetryDelayMs ?? attempt * 180;
          if (delay > 0) await sleep(delay);
          continue;
        }
        break;
      }
    }

    const finalStatus: EmailDeliveryStatus = delivered ? 'sent' : 'failed';
    if (delivered) {
      sentEmailDedupeKeys.add(params.dedupeKey);
      console.info(
        JSON.stringify({
          stage: 'mailer_sent',
          eventType: params.eventType,
          recipientType: params.recipientType,
          entityId: params.entityId,
          attempts,
          resendEmailId: sentId || null
        })
      );
    } else {
      console.warn(
        JSON.stringify({
          stage: 'mailer_failed',
          eventType: params.eventType,
          recipientType: params.recipientType,
          entityId: params.entityId,
          attempts,
          reason: lastErrorMsg
        })
      );
    }

    await recordEmailAuditInFirestore({
      id: docId,
      to: recipientEmail,
      subject: params.subject,
      orderId: params.entityId,
      paymentId: params.paymentId,
      amountInr: params.amountInr,
      paymentStatus: params.paymentStatus,
      eventType: params.eventType,
      recipientType: params.recipientType,
      status: finalStatus,
      attempts,
      resendEmailId: sentId,
      error: delivered ? undefined : lastErrorMsg,
      deliveryProvider: 'resend',
      delivered,
      html: params.html,
      createdAt: nowIso
    });

    pushEmailLog({
      id: docId,
      eventType: params.eventType,
      recipientType: params.recipientType,
      entityId: params.entityId,
      to: recipientEmail,
      subject: params.subject,
      status: finalStatus,
      attempts,
      resendEmailId: sentId,
      error: delivered ? undefined : lastErrorMsg,
      createdAt: nowIso
    });

    return {
      sent: delivered,
      status: finalStatus,
      eventType: params.eventType,
      recipientType: params.recipientType,
      to: recipientEmail,
      subject: params.subject,
      dedupeKey: params.dedupeKey,
      attempts,
      resendEmailId: sentId,
      provider: 'resend',
      ...(delivered ? {} : { error: lastErrorMsg }),
      timestamp: nowIso
    };
  } finally {
    inFlightEmailDedupeKeys.delete(params.dedupeKey);
  }
}

// ==========================================
// 1. OWNER ALERT: LARGE ORDER REQUEST
// ==========================================
export async function sendOwnerLargeOrderAlertOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  schoolName?: string;
  deliveryAddress: string;
  requestDate?: string;
  totalRequestedAmount: number;
  subtotal?: number;
  taxAmount?: number;
  shippingCharges?: number;
  items: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  const ownerEmail = getOwnerEmail();
  const dashboardUrl = `${getAppBaseUrl()}/?tab=dashboard&view=admin_console&requestId=${encodeURIComponent(params.requestId)}`;
  const subject = `[Action Required] Large Order Approval Request ${params.requestId} — ${formatInr(params.totalRequestedAmount)}`;

  const detailsRowsHtml = [
    renderDetailRow('Request ID', params.requestId),
    renderDetailRow('Customer Name', params.customerName),
    renderDetailRow('Customer Email', params.customerEmail),
    renderDetailRow('Phone Number', params.customerPhone),
    ...(params.schoolName ? [renderDetailRow('Institution / School', params.schoolName)] : []),
    renderDetailRow('Delivery Address', params.deliveryAddress),
    renderDetailRow('Request Date', formatDateIst(params.requestDate)),
    renderDetailRow('Total Requested Amount', formatInr(params.totalRequestedAmount))
  ].join('');

  const pricingRowsHtml = [
    ...(typeof params.subtotal === 'number' ? [renderPricingRow('Hardware Subtotal', formatInr(params.subtotal))] : []),
    ...(typeof params.taxAmount === 'number' ? [renderPricingRow('GST (18%)', formatInr(params.taxAmount))] : []),
    ...(typeof params.shippingCharges === 'number'
      ? [renderPricingRow('Estimated Shipping', params.shippingCharges === 0 ? 'Free' : formatInr(params.shippingCharges))]
      : []),
    renderPricingRow('Total Requested Amount', formatInr(params.totalRequestedAmount), true)
  ].join('');

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Owner Approval Required',
    badgeColor: '#b45309',
    heading: `New Large Order Request: ${params.requestId}`,
    greeting: 'Hello Owner / Procurement Desk,',
    introHtml:
      'A high-value STEM hardware order request requires your inventory review, final quotation confirmation, and approval before a Razorpay payment link can be generated.',
    detailsRowsHtml,
    items: params.items,
    pricingRowsHtml,
    cta: {
      label: 'Review & Approve Request in Admin Dashboard',
      url: dashboardUrl
    },
    footerNote: `Admin Request Reference: ${params.requestId}`
  });

  const text = [
    `BALKI TECHNOLOGIES - Owner Approval Required`,
    `Request ID: ${params.requestId}`,
    `Customer: ${params.customerName} (${params.customerEmail}, ${params.customerPhone})`,
    `Delivery Address: ${params.deliveryAddress}`,
    `Request Date: ${formatDateIst(params.requestDate)}`,
    `Total Requested Amount: ${formatInr(params.totalRequestedAmount)}`,
    `Admin Dashboard: ${dashboardUrl}`
  ].join('\n');

  return dispatchTransactionalEmailOnce({
    dedupeKey: `owner_alert:${params.requestId}`,
    eventType: 'owner_order_request_alert',
    recipientType: 'owner',
    entityId: params.requestId,
    to: ownerEmail,
    subject,
    html,
    text,
    amountInr: params.totalRequestedAmount,
    paymentStatus: 'APPROVAL_PENDING'
  });
}

// ==========================================
// 2. CUSTOMER: ORDER REQUEST RECEIVED
// ==========================================
export async function sendCustomerOrderRequestReceivedOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  requestDate?: string;
  totalRequestedAmount: number;
  items: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  const subject = `Order Request Received (${params.requestId}) — BALKI TECHNOLOGIES`;

  const detailsRowsHtml = [
    renderDetailRow('Request ID', params.requestId),
    renderDetailRow('Request Date', formatDateIst(params.requestDate)),
    renderDetailRow('Delivery Address', params.deliveryAddress),
    renderDetailRow('Review Status', 'Pending Procurement & Inventory Verification')
  ].join('');

  const pricingRowsHtml = renderPricingRow('Estimated Request Total', formatInr(params.totalRequestedAmount), true);

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Request Received',
    badgeColor: '#0284c7',
    heading: `We Have Received Your Order Request (${params.requestId})`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml:
      'Thank you for submitting your institutional/bulk STEM hardware request with BALKI TECHNOLOGIES. Because orders of ₹5,000 or more include dedicated technical stock allocation and custom logistics, our team is reviewing your request and will send your final quotation and Razorpay payment link shortly.',
    detailsRowsHtml,
    items: params.items,
    pricingRowsHtml,
    footerNote: `No payment has been charged yet for ${params.requestId}.`
  });

  const text = `Dear ${params.customerName}, your order request ${params.requestId} for ${formatInr(params.totalRequestedAmount)} has been received and is pending owner review.`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `customer_req_received:${params.requestId}`,
    eventType: 'order_request_received',
    recipientType: 'customer',
    entityId: params.requestId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.totalRequestedAmount,
    paymentStatus: 'NOT_STARTED'
  });
}

// ==========================================
// 3. CUSTOMER: ORDER APPROVED + FINAL QUOTE + PAYMENT LINK
// ==========================================
export async function sendCustomerOrderApprovedEmailOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  items: EmailLineItem[];
  shippingCharges: number;
  totalPayableAmount: number;
  paymentLinkUrl?: string | null;
  paymentLinkId?: string | null;
  quoteReference?: string;
}): Promise<EmailDeliveryResult> {
  const quoteRef = params.quoteReference || `QT-${params.requestId}`;
  const subject = params.paymentLinkUrl
    ? `Order Approved & Payment Link Ready (${params.requestId}) — BALKI TECHNOLOGIES`
    : `Order Approved & Final Quotation Confirmed (${params.requestId}) — BALKI TECHNOLOGIES`;

  const detailsRowsHtml = [
    renderDetailRow('Order / Request ID', params.requestId),
    renderDetailRow('Final Quotation Ref', quoteRef),
    renderDetailRow('Approval Status', 'Approved by BALKI TECHNOLOGIES Owner / Procurement Desk'),
    ...(params.paymentLinkId ? [renderDetailRow('Razorpay Payment Link ID', params.paymentLinkId)] : [])
  ].join('');

  const itemsSubtotal = params.items.reduce(
    (sum, it) => sum + (Number(it.unitPrice) || 0) * Math.max(1, Number(it.quantity) || 1),
    0
  );

  const pricingRowsHtml = [
    renderPricingRow('Product Items Estimate', formatInr(itemsSubtotal)),
    renderPricingRow(
      'Shipping Charges',
      params.shippingCharges === 0 ? '₹0.00 (Free Shipping)' : formatInr(params.shippingCharges)
    ),
    renderPricingRow('Total Payable Amount (Final Quotation)', formatInr(params.totalPayableAmount), true)
  ].join('');

  const calloutHtml = params.paymentLinkUrl
    ? `<strong>Approval Confirmation:</strong> Your final quotation (${escapeHtml(quoteRef)}) for <strong>${escapeHtml(formatInr(params.totalPayableAmount))}</strong> is approved. Please complete payment securely using the Razorpay payment button below.`
    : `<strong>Approval Confirmation:</strong> Your final quotation (${escapeHtml(quoteRef)}) for <strong>${escapeHtml(formatInr(params.totalPayableAmount))}</strong> is approved. Your Razorpay payment link is being finalized and will be shared separately.`;

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Approved & Quoted',
    badgeColor: '#059669',
    heading: `Order Approved: ${params.requestId}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml:
      'Great news! Our procurement desk has approved your order request and issued your final quotation below.',
    calloutHtml,
    detailsRowsHtml,
    items: params.items,
    pricingRowsHtml,
    ...(params.paymentLinkUrl
      ? {
          cta: {
            label: `Pay ${formatInr(params.totalPayableAmount)} Securely via Razorpay`,
            url: params.paymentLinkUrl
          }
        }
      : {}),
    footerNote: `Quotation Reference: ${quoteRef}`
  });

  const text = [
    `Dear ${params.customerName}, your order ${params.requestId} is APPROVED.`,
    `Final Quotation: ${quoteRef}`,
    `Shipping Charges: ${formatInr(params.shippingCharges)}`,
    `Total Payable Amount: ${formatInr(params.totalPayableAmount)}`,
    ...(params.paymentLinkUrl ? [`Secure Payment Link: ${params.paymentLinkUrl}`] : [])
  ].join('\n');

  return dispatchTransactionalEmailOnce({
    dedupeKey: `customer_approved:${params.requestId}:${params.paymentLinkId || params.totalPayableAmount}`,
    eventType: 'order_approved',
    recipientType: 'customer',
    entityId: params.requestId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.totalPayableAmount,
    paymentStatus: params.paymentLinkUrl ? 'LINK_GENERATED' : 'APPROVED'
  });
}

// ==========================================
// 4. CUSTOMER: STANDALONE FINAL QUOTATION / PAYMENT LINK GENERATED
// ==========================================
export async function sendCustomerFinalQuotationEmailOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  items: EmailLineItem[];
  shippingCharges: number;
  totalPayableAmount: number;
  quoteReference?: string;
}): Promise<EmailDeliveryResult> {
  const quoteRef = params.quoteReference || `QT-${params.requestId}`;
  const subject = `Final Quotation Generated (${quoteRef}) — BALKI TECHNOLOGIES`;

  const pricingRowsHtml = [
    renderPricingRow('Shipping Charges', params.shippingCharges === 0 ? 'Free' : formatInr(params.shippingCharges)),
    renderPricingRow('Final Quoted Total Payable', formatInr(params.totalPayableAmount), true)
  ].join('');

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Final Quotation',
    badgeColor: '#d97706',
    heading: `Final Quotation Ready: ${quoteRef}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml: `Your official final quotation (${escapeHtml(quoteRef)}) for Request <strong>${escapeHtml(params.requestId)}</strong> has been generated.`,
    detailsRowsHtml: [
      renderDetailRow('Request ID', params.requestId),
      renderDetailRow('Quotation Reference', quoteRef)
    ].join(''),
    items: params.items,
    pricingRowsHtml
  });

  const text = `Final quotation ${quoteRef} for request ${params.requestId}: Total Payable ${formatInr(params.totalPayableAmount)}.`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `final_quote:${params.requestId}:${params.totalPayableAmount}`,
    eventType: 'final_quotation_generated',
    recipientType: 'customer',
    entityId: params.requestId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.totalPayableAmount,
    paymentStatus: 'QUOTED'
  });
}

export async function sendCustomerPaymentLinkEmailOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  totalPayableAmount: number;
  paymentLinkId: string;
  paymentLinkUrl: string;
  items?: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  const subject = `Payment Link Generated for Order ${params.requestId} — BALKI TECHNOLOGIES`;

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Payment Link Ready',
    badgeColor: '#d97706',
    heading: `Secure Razorpay Payment Link: ${params.requestId}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml: `Your official Razorpay payment link for approved order <strong>${escapeHtml(params.requestId)}</strong> is now active.`,
    detailsRowsHtml: [
      renderDetailRow('Order / Request ID', params.requestId),
      renderDetailRow('Razorpay Payment Link ID', params.paymentLinkId),
      renderDetailRow('Total Payable Amount', formatInr(params.totalPayableAmount))
    ].join(''),
    items: params.items,
    pricingRowsHtml: renderPricingRow('Total Payable Amount', formatInr(params.totalPayableAmount), true),
    cta: {
      label: `Complete Payment (${formatInr(params.totalPayableAmount)})`,
      url: params.paymentLinkUrl
    }
  });

  const text = `Secure Razorpay payment link for ${params.requestId} (${formatInr(params.totalPayableAmount)}): ${params.paymentLinkUrl}`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `payment_link:${params.requestId}:${params.paymentLinkId}`,
    eventType: 'payment_link_generated',
    recipientType: 'customer',
    entityId: params.requestId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.totalPayableAmount,
    paymentStatus: 'LINK_GENERATED'
  });
}

// ==========================================
// 5. CUSTOMER: ORDER REJECTED
// ==========================================
export async function sendCustomerOrderRejectedEmailOnce(params: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  rejectionReason: string;
  requestedAmount?: number;
  items?: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  const subject = `Order Request Update (${params.requestId}) — BALKI TECHNOLOGIES`;

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Request Declined',
    badgeColor: '#dc2626',
    heading: `Order Request Not Approved: ${params.requestId}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml:
      'Thank you for your interest in BALKI TECHNOLOGIES hardware solutions. Unfortunately, your order request could not be approved at this time.',
    calloutHtml: `<strong>Reason Provided:</strong> ${escapeHtml(params.rejectionReason)}`,
    detailsRowsHtml: [
      renderDetailRow('Order / Request ID', params.requestId),
      renderDetailRow('Status', 'Rejected / Closed'),
      ...(typeof params.requestedAmount === 'number'
        ? [renderDetailRow('Requested Amount', formatInr(params.requestedAmount))]
        : [])
    ].join(''),
    items: params.items,
    footerNote: 'Please contact our procurement team at +91 9071199139 for revised options.'
  });

  const text = `Dear ${params.customerName}, your order request ${params.requestId} was not approved. Reason: ${params.rejectionReason}`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `customer_rejected:${params.requestId}`,
    eventType: 'order_rejected',
    recipientType: 'customer',
    entityId: params.requestId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.requestedAmount || 0,
    paymentStatus: 'REJECTED'
  });
}

// ==========================================
// 6. CUSTOMER: PAYMENT RECEIVED (CRYPTOGRAPHICALLY VERIFIED ONLY)
// ==========================================
export async function sendOrderConfirmationEmailOnce(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amountInr: number;
  paymentStatus: string;
  razorpayPaymentId?: string;
  items: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  // Strictly allow only verified Paid state
  if (params.paymentStatus.toLowerCase() !== 'paid') {
    const errMsg = 'Refused to send payment confirmation email before paymentStatus is Paid.';
    return {
      sent: false,
      status: 'failed',
      eventType: 'payment_received',
      recipientType: 'customer',
      to: params.customerEmail || '',
      subject: `Payment Confirmation Blocked — ${params.orderId}`,
      dedupeKey: `payment_confirmed:${params.orderId}:${params.razorpayPaymentId || 'none'}`,
      attempts: 0,
      provider: 'audit-only',
      error: errMsg,
      timestamp: new Date().toISOString()
    };
  }

  const subject = `Payment Received & Order Confirmed (${params.orderId}) — BALKI TECHNOLOGIES`;

  const detailsRowsHtml = [
    renderDetailRow('Order Reference', params.orderId),
    renderDetailRow('Payment Status', 'Paid (Cryptographically Verified)'),
    ...(params.razorpayPaymentId ? [renderDetailRow('Razorpay Payment ID', params.razorpayPaymentId)] : []),
    renderDetailRow('Verified At', formatDateIst())
  ].join('');

  const pricingRowsHtml = renderPricingRow('Total Paid', formatInr(params.amountInr), true);

  const html = renderBalkiEmailLayout({
    badgeLabel: 'Payment Verified',
    badgeColor: '#059669',
    heading: `Payment Confirmed: Order ${params.orderId}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml:
      'Thank you for ordering from BALKI TECHNOLOGIES. Your payment has been cryptographically verified with Razorpay and your hardware consignment is now entering Quality Control & Assembly.',
    detailsRowsHtml,
    items: params.items,
    pricingRowsHtml,
    footerNote: 'Official tax invoice and live shipment tracking updates will follow automatically.'
  });

  const text = `Payment confirmed for Order ${params.orderId}. Amount Paid: ${formatInr(params.amountInr)}. Payment ID: ${params.razorpayPaymentId || 'Verified'}.`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `payment_confirmed:${params.orderId}:${params.razorpayPaymentId || 'verified'}`,
    eventType: 'payment_received',
    recipientType: 'customer',
    entityId: params.orderId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.amountInr,
    paymentStatus: 'Paid',
    paymentId: params.razorpayPaymentId
  });
}

// ==========================================
// 7. CUSTOMER: FULFILLMENT, PACKING, SHIPPING & CANCELLATION UPDATES
// ==========================================
export type FulfillmentStage =
  | 'qc_assembly'
  | 'processing'
  | 'packed'
  | 'dispatched'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

function mapStageToEventAndCopy(stage: FulfillmentStage): {
  eventType: TransactionalEmailEvent;
  badgeLabel: string;
  badgeColor: string;
  titlePrefix: string;
  description: string;
} {
  switch (stage) {
    case 'qc_assembly':
    case 'processing':
      return {
        eventType: 'order_processing',
        badgeLabel: 'Order Processing',
        badgeColor: '#0284c7',
        titlePrefix: 'Your Order Is Being Processed',
        description: 'Our robotics engineers are performing hardware quality checks, kit calibration, and component verification.'
      };
    case 'packed':
      return {
        eventType: 'order_packed',
        badgeLabel: 'Order Packed',
        badgeColor: '#7c3aed',
        titlePrefix: 'Your Order Has Been Packed',
        description: 'All hardware modules and lab documentation have passed QC and are securely sealed for carrier pickup.'
      };
    case 'dispatched':
    case 'shipped':
    case 'in_transit':
      return {
        eventType: 'order_shipped',
        badgeLabel: stage === 'in_transit' ? 'In Transit' : 'Order Shipped',
        badgeColor: '#d97706',
        titlePrefix: stage === 'in_transit' ? 'Your Shipment Is In Transit' : 'Your Order Has Shipped',
        description: 'Your STEM hardware consignment has been handed over to our logistics partner and is on the way to your delivery address.'
      };
    case 'out_for_delivery':
      return {
        eventType: 'order_out_for_delivery',
        badgeLabel: 'Out For Delivery',
        badgeColor: '#ea580c',
        titlePrefix: 'Your Order Is Out For Delivery',
        description: 'Your shipment has reached your local delivery hub and is scheduled for delivery today.'
      };
    case 'delivered':
      return {
        eventType: 'order_delivered',
        badgeLabel: 'Delivered',
        badgeColor: '#059669',
        titlePrefix: 'Your Order Has Been Delivered',
        description: 'Your BALKI TECHNOLOGIES shipment has been delivered successfully. Thank you for building STEM excellence with us.'
      };
    case 'cancelled':
      return {
        eventType: 'order_cancelled',
        badgeLabel: 'Order Cancelled',
        badgeColor: '#dc2626',
        titlePrefix: 'Your Order Has Been Cancelled',
        description: 'This order has been cancelled and reserved inventory has been released. Any eligible prepaid refund is processed back to your original payment method.'
      };
  }
}

export async function sendCustomerOrderStatusEmailOnce(params: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  stage: FulfillmentStage;
  trackingNumber?: string;
  courierName?: string;
  note?: string;
  amountInr?: number;
  items?: EmailLineItem[];
}): Promise<EmailDeliveryResult> {
  const copy = mapStageToEventAndCopy(params.stage);
  const subject = `${copy.badgeLabel}: Order ${params.orderId} — BALKI TECHNOLOGIES`;

  const detailsRowsHtml = [
    renderDetailRow('Order ID', params.orderId),
    renderDetailRow('Current Status', copy.badgeLabel),
    ...(params.courierName ? [renderDetailRow('Courier Partner', params.courierName)] : []),
    ...(params.trackingNumber ? [renderDetailRow('Tracking Number / AWB', params.trackingNumber)] : []),
    renderDetailRow('Updated At', formatDateIst())
  ].join('');

  const html = renderBalkiEmailLayout({
    badgeLabel: copy.badgeLabel,
    badgeColor: copy.badgeColor,
    heading: `${copy.titlePrefix}: ${params.orderId}`,
    greeting: `Dear ${params.customerName || 'Valued Client'},`,
    introHtml: params.note ? `${escapeHtml(copy.description)}<br/><br/><strong>Update Note:</strong> ${escapeHtml(params.note)}` : escapeHtml(copy.description),
    detailsRowsHtml,
    items: params.items,
    footerNote: params.trackingNumber ? `Track anytime at balkitechnologies.com using ${params.trackingNumber}` : undefined
  });

  const text = `${copy.titlePrefix} (${params.orderId}). ${copy.description}${params.trackingNumber ? ` Tracking: ${params.trackingNumber}` : ''}`;

  return dispatchTransactionalEmailOnce({
    dedupeKey: `order_status:${params.orderId}:${copy.eventType}`,
    eventType: copy.eventType,
    recipientType: 'customer',
    entityId: params.orderId,
    to: params.customerEmail,
    subject,
    html,
    text,
    amountInr: params.amountInr || 0,
    paymentStatus: params.stage.toUpperCase()
  });
}
