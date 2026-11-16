import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  INITIAL_PRODUCTS,
  INITIAL_RENTALS,
  INITIAL_COURSES,
  INITIAL_INVENTORY,
  INITIAL_USER_PROGRESS
} from '../data/initialData';
import { initialClientReviews, initialCaseStudyBlogs } from '../data/blogAndReviewsData';
import { INITIAL_SUPPORT_TICKETS } from '../data/supportData';
import { ATL_QUOTATION_PACKAGES } from '../data/atlQuotationPackagesData';
import {
  getAdminFirestoreStatus,
  mapNormalizedPaymentStatus,
  mapNormalizedDeliveryStatus,
  syncOrderCreatedToFirestore,
  syncRazorpayOrderIdToFirestore,
  syncOrderRequestToFirestore,
  findFirestoreOrder,
  runAtomicCaptureTransaction,
  runAtomicFailureTransaction
} from './firestoreAdmin';
import { sendOrderConfirmationEmailOnce } from './mailer';
import {
  Order,
  OrderStatus,
  TrackingCheckpoint,
  TrackingDetails,
  RentalBooking,
  InventoryItem,
  ATLQuoteRequest,
  InternshipApplication,
  UserProgress,
  ClientReview,
  CaseStudyBlog,
  SupportTicket,
  CartItem,
  PaymentIntent,
  ServerCart,
  OrderRequest,
  PaymentTransaction,
  AppNotification,
  AdminUser
} from '../types';

export interface RazorpayConfigStatus {
  configured: boolean;
  mode: 'test' | 'live' | 'unconfigured';
  keyId: string | null;
  webhookConfigured: boolean;
}

interface SignedOrderPayload {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  schoolName?: string;
  gstin?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  discount: number;
  finalAmount: number;
  currency: 'INR';
  razorpayOrderId?: string;
  trackingNumber: string;
  deliveryOtp: string;
  items: Array<{ productId: string; quantity: number }>;
  iat: number;
}

// ==========================================
// ENVIRONMENT & RAZORPAY READINESS HELPERS
// ==========================================
function isPlaceholderValue(val: string | undefined | null): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  if (!trimmed) return true;
  const upper = trimmed.toUpperCase();
  return (
    upper.includes('YOUR_TEST_KEY') ||
    upper.includes('YOUR_RAZORPAY') ||
    upper.includes('CHANGE_THIS') ||
    upper.startsWith('MY_') ||
    trimmed === 'undefined' ||
    trimmed === 'null'
  );
}

export function getRazorpayConfigStatus(): RazorpayConfigStatus {
  const rawKeyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const rawKeySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const rawWebhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();

  const hasValidKeyId =
    !isPlaceholderValue(rawKeyId) &&
    (rawKeyId.startsWith('rzp_test_') || rawKeyId.startsWith('rzp_live_')) &&
    rawKeyId.length >= 14;
  const hasValidKeySecret = !isPlaceholderValue(rawKeySecret) && rawKeySecret.length >= 12;
  const webhookConfigured = !isPlaceholderValue(rawWebhookSecret) && rawWebhookSecret.length >= 12;

  if (!hasValidKeyId || !hasValidKeySecret) {
    return {
      configured: false,
      mode: 'unconfigured',
      keyId: null,
      webhookConfigured
    };
  }

  return {
    configured: true,
    mode: rawKeyId.startsWith('rzp_live_') ? 'live' : 'test',
    keyId: rawKeyId,
    webhookConfigured
  };
}

function getRazorpayKeySecret(): string | null {
  const status = getRazorpayConfigStatus();
  if (!status.configured) return null;
  return (process.env.RAZORPAY_KEY_SECRET || '').trim();
}

function getRazorpayWebhookSecret(): string | null {
  const raw = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  if (isPlaceholderValue(raw) || raw.length < 12) return null;
  return raw;
}

function getRazorpayClient(): Razorpay | null {
  const status = getRazorpayConfigStatus();
  const secret = getRazorpayKeySecret();
  if (!status.configured || !status.keyId || !secret) return null;
  try {
    return new Razorpay({
      key_id: status.keyId,
      key_secret: secret
    });
  } catch (err) {
    console.warn('Razorpay SDK initialization error:', err);
    return null;
  }
}

function getApprovalThresholdInr(): number {
  const parsed = Number(process.env.ORDER_APPROVAL_THRESHOLD_INR || 5000);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
}

const EPHEMERAL_FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');

function getOrderSigningSecret(): string {
  const envSecret = (process.env.ORDER_SIGNATURE_SECRET || '').trim();
  if (!isPlaceholderValue(envSecret) && envSecret.length >= 16) {
    return envSecret;
  }
  const rzpSecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  if (!isPlaceholderValue(rzpSecret) && rzpSecret.length >= 12) {
    return rzpSecret;
  }
  return EPHEMERAL_FALLBACK_SECRET;
}

function signOrderToken(payload: SignedOrderPayload): string {
  const dataB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getOrderSigningSecret())
    .update(dataB64)
    .digest('base64url');
  return `${dataB64}.${sig}`;
}

function verifyOrderToken(token: unknown): SignedOrderPayload | null {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [dataB64, sig] = parts;
  if (!dataB64 || !sig) return null;
  try {
    const expected = crypto
      .createHmac('sha256', getOrderSigningSecret())
      .update(dataB64)
      .digest('base64url');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(sig, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }
    const parsed = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed.orderId !== 'string' || typeof parsed.finalAmount !== 'number') {
      return null;
    }
    return parsed as SignedOrderPayload;
  } catch {
    return null;
  }
}

function timingSafeEqualString(aStr: string, bStr: string): boolean {
  const a = Buffer.from(aStr, 'utf8');
  const b = Buffer.from(bStr, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifyRazorpayPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  secretOverride?: string
): boolean {
  const secret = secretOverride || getRazorpayKeySecret();
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return timingSafeEqualString(expected, razorpaySignature.trim());
  } catch {
    return false;
  }
}

export function verifyRazorpayWebhookSignature(
  rawBody: Buffer | string,
  signature: string,
  webhookSecretOverride?: string
): boolean {
  const secret = webhookSecretOverride || getRazorpayWebhookSecret();
  if (!secret || !signature) return false;
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    return timingSafeEqualString(expected, signature.trim());
  } catch {
    return false;
  }
}

const SERVER_SENSITIVE_PATTERN =
  /(rzp_(live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+|-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----)/g;

export function extractServerErrorMessage(
  input: unknown,
  fallback = 'An unexpected server error occurred.',
  depth = 0
): string {
  if (depth > 5 || input === null || input === undefined) {
    return fallback;
  }
  if (typeof input === 'string') {
    const cleaned = input.replace(SERVER_SENSITIVE_PATTERN, '[REDACTED]').trim();
    return cleaned && cleaned !== '[object Object]' ? cleaned : fallback;
  }
  if (typeof input === 'number' || typeof input === 'boolean') {
    return String(input);
  }
  if (Array.isArray(input)) {
    const parts = input.map(v => extractServerErrorMessage(v, '', depth + 1)).filter(Boolean);
    return parts.length > 0 ? parts.join('; ') : fallback;
  }
  if (input instanceof Error) {
    const errAny = input as any;
    if (errAny?.error) {
      const nested = extractServerErrorMessage(errAny.error, '', depth + 1);
      if (nested) return nested;
    }
    if (errAny?.response?.data) {
      const nested = extractServerErrorMessage(errAny.response.data, '', depth + 1);
      if (nested) return nested;
    }
    return extractServerErrorMessage(input.message, '', depth + 1) || fallback;
  }
  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    const candidateKeys = ['error', 'description', 'message', 'reason', 'response', 'data', 'details'];
    for (const key of candidateKeys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        const extracted = extractServerErrorMessage(obj[key], '', depth + 1);
        if (extracted) return extracted;
      }
    }
  }
  return fallback;
}

function logPaymentDiagnostic(stage: string, details: Record<string, unknown> = {}) {
  const payload = {
    stage,
    env: process.env.VERCEL ? 'vercel' : (process.env.NODE_ENV || 'development'),
    ...details,
    ts: new Date().toISOString()
  };
  console.info('[PaymentDiagnostic]', JSON.stringify(payload));
}

function sendJsonError(
  res: express.Response,
  status: number,
  message: unknown,
  code: string,
  extra: Record<string, unknown> = {}
) {
  const safeMessage = extractServerErrorMessage(message, 'Request could not be processed.');
  return res.status(status).json({
    success: false,
    message: safeMessage,
    error: safeMessage,
    code,
    ...extra
  });
}

function sendJsonSuccess(
  res: express.Response,
  status: number,
  message: string,
  data: Record<string, unknown> = {}
) {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...data
  });
}

// ==========================================
// VALIDATION HELPERS
// ==========================================
function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: unknown): phone is string {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function normalizeAddress(raw: any): { street: string; city: string; state: string; pincode: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const street = typeof raw.street === 'string' ? raw.street.trim() : '';
  const city = typeof raw.city === 'string' ? raw.city.trim() : '';
  const state = typeof raw.state === 'string' ? raw.state.trim() : '';
  const pincode = typeof raw.pincode === 'string' ? raw.pincode.trim() : String(raw.pincode || '').trim();
  if (!street || !city || !state || !/^\d{6}$/.test(pincode)) {
    return null;
  }
  return { street, city, state, pincode };
}

// ==========================================
// STATEFUL IN-MEMORY STORE (LOCAL / WARM INSTANCE)
// ==========================================
let products = [...INITIAL_PRODUCTS];
let rentals = [...INITIAL_RENTALS];
let courses = [...INITIAL_COURSES];
let inventory: InventoryItem[] = [...INITIAL_INVENTORY];
let clientReviews: ClientReview[] = [...initialClientReviews];
let caseStudies: CaseStudyBlog[] = [...initialCaseStudyBlogs];
let supportTickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
let paymentIntents: PaymentIntent[] = [];
let serverCart: { items: CartItem[]; appliedCoupon?: string } = { items: [], appliedCoupon: undefined };
let orders: Order[] = [];
let orderRequests: OrderRequest[] = [];
let paymentTransactions: PaymentTransaction[] = [];
let notifications: AppNotification[] = [];
let adminUsers: AdminUser[] = [
  {
    adminId: 'balki-super-admin',
    email: 'kartikks1205@gmail.com',
    displayName: 'Balki Technologies Operations Admin',
    role: 'super_admin',
    permissions: ['manage_orders', 'approve_requests', 'update_status', 'view_analytics', 'manage_inventory'],
    createdAt: '2026-11-01T00:00:00.000Z',
    lastActiveAt: new Date().toISOString()
  }
];
let rentalBookings: RentalBooking[] = [];
let userProgress: UserProgress = { ...INITIAL_USER_PROGRESS };
let quoteRequests: ATLQuoteRequest[] = [];
let internshipApplications: InternshipApplication[] = [];

const TRUSTED_ADMIN_EMAILS = ['kartikks1205@gmail.com'];
const recentSubmissions = new Map<string, number>();
const processedPaymentIds = new Map<string, string>(); // razorpay_payment_id -> orderId
const processedWebhookEvents = new Set<string>();

function generateOrderTracking(
  _orderId: string,
  customerCity: string = 'Hyderabad',
  customerState: string = 'Telangana',
  paymentMethod: string = 'UPI',
  schoolName?: string
): { trackingNumber: string; deliveryOtp: string; trackingDetails: TrackingDetails } {
  const awb = `DELHIVERY-B2B-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const trackingNumber = `BALKI-EXP-${Math.floor(10000000 + Math.random() * 90000000)}IN`;
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const now = new Date();
  const isPO = paymentMethod === 'SchoolPO';

  const checkpoints: TrackingCheckpoint[] = [
    {
      id: `chk-1-${Date.now()}`,
      status: 'order_placed',
      title: isPO ? 'School Purchase Order Registered (Net 30)' : 'Order Placed & Staged for Payment',
      description: isPO
        ? `Official institutional purchase order registered for ${schoolName || 'Partner School'}. Allocation confirmed.`
        : 'Order verified on backend and staged for secure payment capture.',
      location: 'Balki Corporate Fulfillment, Financial District, Hyderabad',
      timestamp: now.toISOString(),
      completed: true,
      current: false
    },
    {
      id: `chk-2-${Date.now()}`,
      status: 'qc_assembly',
      title: 'ATL Kit BOM Assembly & Quality Check',
      description: 'Zero-defect inspection, sensor calibration, component flashing, and anti-static packaging.',
      location: 'Balki Hardware Fabrication & QA Lab, Hyderabad',
      timestamp: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      completed: false,
      current: true
    },
    {
      id: `chk-3-${Date.now()}`,
      status: 'dispatched',
      title: 'Dispatched with Delhivery B2B Priority Logistics',
      description: `Consignment sealed and handed over to carrier. Waybill #${awb} allocated with 100% transit insurance.`,
      location: 'Shamshabad Air Freight & Cargo Hub, Hyderabad',
      timestamp: new Date(now.getTime() + 18 * 3600 * 1000).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-4-${Date.now()}`,
      status: 'in_transit',
      title: `In Transit to ${customerCity} Transshipment Facility`,
      description: 'Regional line-haul container in transit. Real-time temperature & shock sensors nominal.',
      location: `${customerCity} Logistics Terminal, ${customerState}`,
      timestamp: new Date(now.getTime() + 42 * 3600 * 1000).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-5-${Date.now()}`,
      status: 'out_for_delivery',
      title: 'Out for School Lab Delivery & On-Site Handover',
      description: `Dispatched in local logistics vehicle. School gate handover requires 4-digit Security OTP (${deliveryOtp}).`,
      location: `Local Delivery Route - ${customerCity}`,
      timestamp: new Date(now.getTime() + 66 * 3600 * 1000).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-6-${Date.now()}`,
      status: 'delivered',
      title: 'Delivered & ATL Lab Installation Scheduled',
      description: 'Consignment successfully handed over to school ATL in-charge. Hands-on faculty demo scheduled.',
      location: schoolName || `${customerCity} Innovation Lab`,
      timestamp: new Date(now.getTime() + 72 * 3600 * 1000).toISOString(),
      completed: false,
      current: false
    }
  ];

  const trackingDetails: TrackingDetails = {
    courierPartner: 'Delhivery B2B Logistics (Priority STEM Express)',
    awbNumber: awb,
    dispatchDate: new Date(now.getTime() + 18 * 3600 * 1000).toISOString(),
    expectedDeliveryDate: new Date(now.getTime() + 72 * 3600 * 1000).toISOString(),
    originHub: 'Balki Central Fulfillment, Financial District, Hyderabad',
    destinationHub: `${customerCity} Regional Delivery Center, ${customerState}`,
    deliverySecurityOtp: deliveryOtp,
    assignedFieldEngineer: {
      name: 'Ramesh Verma',
      phone: '+91 90711 99139',
      badge: 'Senior ATL Robotics Specialist'
    },
    liveCoordinates: {
      lat: 17.4435,
      lng: 78.3842
    },
    checkpoints
  };

  return { trackingNumber, deliveryOtp, trackingDetails };
}

function verifyAdminAccess(req: express.Request): { authorized: boolean; email?: string; role?: string } {
  const adminKey = req.headers['x-admin-key'];
  const adminEmail = req.headers['x-admin-email'];
  const authHeader = req.headers.authorization;

  if (typeof adminEmail === 'string' && TRUSTED_ADMIN_EMAILS.includes(adminEmail.toLowerCase().trim())) {
    return { authorized: true, email: adminEmail.trim(), role: 'super_admin' };
  }

  if (adminKey === 'balki-super-admin-key-2026') {
    return { authorized: true, email: 'kartikks1205@gmail.com', role: 'super_admin' };
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'balki-super-admin-token' || TRUSTED_ADMIN_EMAILS.some(e => token.toLowerCase().includes(e))) {
      return { authorized: true, email: 'kartikks1205@gmail.com', role: 'super_admin' };
    }
  }

  return { authorized: false };
}

function calculateTrustedOrderAmount(
  rawItems: Array<{ productId?: string; id?: string; sku?: string; product?: { id?: string; sku?: string }; quantity?: unknown }>,
  couponCode?: unknown
): {
  success: boolean;
  error?: string;
  code?: string;
  availableStock?: number;
  data?: {
    subtotal: number;
    taxAmount: number;
    shippingCharges: number;
    discount: number;
    finalAmount: number;
    currency: 'INR';
    requiresApproval: boolean;
    orderCategory: 'SMALL_ORDER' | 'LARGE_ORDER';
    threshold: number;
    items: Array<{
      productId: string;
      sku: string;
      name: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      image: string;
    }>;
  };
} {
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return { success: false, code: 'EMPTY_ITEMS', error: 'Items array is required for price calculation.' };
  }

  if (rawItems.length > 100) {
    return { success: false, code: 'TOO_MANY_ITEMS', error: 'Maximum 100 line items per checkout.' };
  }

  const threshold = getApprovalThresholdInr();
  let subtotal = 0;
  const itemBreakdown = [];

  for (const it of rawItems) {
    if (!it || typeof it !== 'object') {
      return { success: false, code: 'INVALID_ITEM', error: 'Each item must be a valid object.' };
    }
    const searchId = it.productId || it.id || it.product?.id;
    const searchSku = it.sku || it.product?.sku;
    const prod = products.find(p => (searchId && p.id === searchId) || (searchSku && p.sku === searchSku));
    if (!prod) {
      return {
        success: false,
        code: 'PRODUCT_NOT_FOUND',
        error: `Product not found in catalog: ${searchId || searchSku || 'Unknown'}`
      };
    }

    const rawQty = Number(it.quantity);
    if (!Number.isInteger(rawQty) || rawQty <= 0 || rawQty > 1000) {
      return {
        success: false,
        code: 'INVALID_QUANTITY',
        error: `Invalid quantity for "${prod.name}". Quantity must be a positive integer.`
      };
    }

    if (rawQty > prod.stock) {
      return {
        success: false,
        code: 'INSUFFICIENT_STOCK',
        error: `Insufficient stock for "${prod.name}". Available in lab: ${prod.stock}, requested: ${rawQty}.`,
        availableStock: prod.stock
      };
    }

    const lineTotal = prod.price * rawQty;
    subtotal += lineTotal;
    itemBreakdown.push({
      productId: prod.id,
      sku: prod.sku,
      name: prod.name,
      unitPrice: prod.price,
      quantity: rawQty,
      lineTotal,
      image: prod.image
    });
  }

  let discount = 0;
  const cleanCoupon = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
  if (cleanCoupon === 'ATL2026') {
    discount = Math.min(subtotal, 500);
  } else if (cleanCoupon === 'NEP20') {
    discount = Math.min(subtotal, Math.round(subtotal * 0.20));
  } else if (cleanCoupon === 'BALKI10') {
    discount = Math.min(subtotal, Math.round(subtotal * 0.10));
  } else if (cleanCoupon === 'FREESHIP') {
    discount = 150;
  }

  const taxAmount = Number((subtotal * 0.18).toFixed(2));
  const baseShipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const shippingCharges = cleanCoupon === 'FREESHIP' ? 0 : baseShipping;
  const finalAmount = Number(
    Math.max(0, subtotal + taxAmount + shippingCharges - (cleanCoupon === 'FREESHIP' ? 0 : discount)).toFixed(2)
  );

  const requiresApproval = finalAmount >= threshold;
  const orderCategory: 'SMALL_ORDER' | 'LARGE_ORDER' = requiresApproval ? 'LARGE_ORDER' : 'SMALL_ORDER';

  return {
    success: true,
    data: {
      subtotal,
      taxAmount,
      shippingCharges,
      discount,
      finalAmount,
      currency: 'INR',
      requiresApproval,
      orderCategory,
      threshold,
      items: itemBreakdown
    }
  };
}

function hydrateOrderFromSignedToken(tokenData: SignedOrderPayload): Order {
  const fullItems: CartItem[] = tokenData.items
    .map(it => {
      const prod = products.find(p => p.id === it.productId);
      return prod ? { product: prod, quantity: it.quantity } : null;
    })
    .filter((x): x is CartItem => x !== null);

  const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
    tokenData.orderId,
    tokenData.deliveryAddress.city,
    tokenData.deliveryAddress.state,
    'Razorpay',
    tokenData.schoolName
  );

  return {
    id: tokenData.orderId,
    orderId: tokenData.orderId,
    userId: tokenData.customerId,
    customerId: tokenData.customerId,
    customerName: tokenData.customerName,
    customerEmail: tokenData.customerEmail,
    customerPhone: tokenData.customerPhone,
    schoolName: tokenData.schoolName,
    gstin: tokenData.gstin,
    deliveryAddress: tokenData.deliveryAddress,
    shippingAddress: tokenData.deliveryAddress,
    products: fullItems,
    items: fullItems,
    subtotal: tokenData.subtotal,
    taxAmount: tokenData.taxAmount,
    gstAmount: tokenData.taxAmount,
    shippingCharges: tokenData.shippingCharges,
    shippingFee: tokenData.shippingCharges,
    discount: tokenData.discount,
    finalAmount: tokenData.finalAmount,
    serverVerifiedTotal: tokenData.finalAmount,
    totalAmount: tokenData.finalAmount,
    currency: 'INR',
    paymentMethod: 'Razorpay',
    paymentStatus: 'Payment Pending',
    orderStatus: 'order_placed',
    approvalStatus: 'approved',
    razorpayOrderId: tokenData.razorpayOrderId,
    trackingNumber: tokenData.trackingNumber || trackingNumber,
    courierName: 'Delhivery B2B Priority',
    deliveryOtp: tokenData.deliveryOtp || deliveryOtp,
    trackingDetails,
    createdAt: new Date(tokenData.iat).toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// ==========================================
// EXPRESS API APPLICATION FACTORY
// (Mounted by server.ts locally AND /api/[...slug].ts on Vercel)
// ==========================================
let cachedApiApp: express.Express | null = null;

export function createApiApp(): express.Express {
  const app = express();

  // CORS & Content-Type guards for /api/* (registered before body parsers so raw webhook & OPTIONS work cleanly)
  app.use('/api', (req, res, next) => {
    const allowedOrigins = [
      'https://www.balkitechnologies.com',
      'https://balkitechnologies.com',
      process.env.APP_URL || ''
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.endsWith('.vercel.app'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Email, X-Admin-Key, X-Razorpay-Signature, X-Razorpay-Event-Id');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  // Authoritative Razorpay Webhook Endpoint registered BEFORE express.json()
  // Preserves exact original raw HTTP body bytes for strict HMAC-SHA256 verification.
  const rawWebhookBodyParser: express.RequestHandler = (req: any, res, next) => {
    if (
      Buffer.isBuffer(req.body) ||
      Buffer.isBuffer(req.rawBody) ||
      typeof req.rawBody === 'string' ||
      typeof req.body === 'string'
    ) {
      return next();
    }
    return express.raw({ type: '*/*', limit: '1mb' })(req, res, next);
  };

  app.post(
    '/api/razorpay/webhook',
    rawWebhookBodyParser,
    async (req: any, res) => {
      try {
        const webhookSecret = getRazorpayWebhookSecret();
        if (!webhookSecret) {
          logPaymentDiagnostic('webhook_secret_missing');
          return sendJsonError(
            res,
            503,
            'Razorpay webhook secret is not configured on the server.',
            'RAZORPAY_WEBHOOK_NOT_CONFIGURED'
          );
        }

        const signature = req.headers['x-razorpay-signature'];
        if (typeof signature !== 'string' || !signature.trim()) {
          logPaymentDiagnostic('webhook_signature_missing');
          return sendJsonError(res, 400, 'Missing X-Razorpay-Signature header.', 'MISSING_WEBHOOK_SIGNATURE');
        }

        let rawBuffer: Buffer | null = null;
        if (Buffer.isBuffer(req.body)) {
          rawBuffer = req.body;
        } else if (Buffer.isBuffer(req.rawBody)) {
          rawBuffer = req.rawBody;
        } else if (typeof req.rawBody === 'string') {
          rawBuffer = Buffer.from(req.rawBody, 'utf8');
        } else if (typeof req.body === 'string') {
          rawBuffer = Buffer.from(req.body, 'utf8');
        }

        if (!rawBuffer) {
          logPaymentDiagnostic('webhook_raw_body_missing', { bodyType: typeof req.body });
          return sendJsonError(
            res,
            400,
            'Raw HTTP request body buffer is required for Razorpay webhook signature verification.',
            'INVALID_RAW_WEBHOOK_BODY'
          );
        }

        if (!verifyRazorpayWebhookSignature(rawBuffer, signature, webhookSecret)) {
          logPaymentDiagnostic('webhook_signature_invalid');
          return sendJsonError(res, 401, 'Invalid Razorpay webhook signature.', 'INVALID_WEBHOOK_SIGNATURE');
        }

        // Parse JSON ONLY after cryptographic signature verification succeeds
        let event: any;
        try {
          event = JSON.parse(rawBuffer.toString('utf8'));
        } catch {
          return sendJsonError(res, 400, 'Malformed JSON payload inside verified webhook body.', 'INVALID_WEBHOOK_JSON');
        }

        if (!event || typeof event !== 'object') {
          return sendJsonError(res, 400, 'Unexpected webhook payload structure.', 'INVALID_WEBHOOK_PAYLOAD');
        }

        const eventName: string = String(event.event || 'unknown');
        const paymentEntity = event.payload?.payment?.entity;
        const orderEntity = event.payload?.order?.entity;
        const headerEventId = typeof req.headers['x-razorpay-event-id'] === 'string'
          ? req.headers['x-razorpay-event-id'].trim()
          : '';
        const eventId = headerEventId || `${eventName}:${paymentEntity?.id || orderEntity?.id || 'unknown'}`;

        if (processedWebhookEvents.has(eventId)) {
          return sendJsonSuccess(res, 200, 'Webhook event already processed (idempotent)', {
            eventId,
            event: eventName,
            duplicate: true
          });
        }

        const rzpOrderId = String(paymentEntity?.order_id || orderEntity?.id || '').trim();
        const rzpPaymentId = String(paymentEntity?.id || '').trim();
        const paymentMethod = paymentEntity?.method ? String(paymentEntity.method) : 'Razorpay';
        const capturedAmountPaise = typeof paymentEntity?.amount === 'number'
          ? paymentEntity.amount
          : (typeof orderEntity?.amount_paid === 'number' ? orderEntity.amount_paid : null);
        const eventCurrency = paymentEntity?.currency || orderEntity?.currency || 'INR';
        const balkiOrderId = String(
          paymentEntity?.notes?.balkiOrderId ||
            paymentEntity?.notes?.internalOrderId ||
            orderEntity?.notes?.balkiOrderId ||
            orderEntity?.notes?.internalOrderId ||
            orderEntity?.receipt ||
            ''
        ).trim();

        const supportedEvents = new Set(['order.paid', 'payment.captured', 'payment.failed']);
        if (!supportedEvents.has(eventName)) {
          processedWebhookEvents.add(eventId);
          return sendJsonSuccess(res, 200, `Webhook event "${eventName}" acknowledged`, {
            eventId,
            event: eventName,
            ignored: true
          });
        }

        if (eventName === 'payment.captured' || eventName === 'order.paid') {
          // 1. Atomic Firestore transaction when Admin SDK is configured
          const fsResult = await runAtomicCaptureTransaction({
            orderId: balkiOrderId || null,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId || `pay_evt_${eventId}`,
            paymentMethod,
            capturedAmountPaise,
            currency: String(eventCurrency),
            eventId,
            eventName,
            source: 'webhook'
          });

          if (fsResult.duplicateEvent) {
            processedWebhookEvents.add(eventId);
            return sendJsonSuccess(res, 200, 'Webhook event already processed in Firestore (idempotent)', {
              eventId,
              event: eventName,
              duplicate: true
            });
          }
          if (fsResult.currencyMismatch) {
            processedWebhookEvents.add(eventId);
            return sendJsonError(res, 400, 'Webhook currency mismatch; INR required.', 'INVALID_CURRENCY');
          }
          if (fsResult.amountMismatch) {
            processedWebhookEvents.add(eventId);
            return sendJsonError(
              res,
              400,
              `Webhook payment amount mismatch (paid ${fsResult.actualPaise} paise, expected ${fsResult.expectedPaise} paise).`,
              'PAYMENT_AMOUNT_MISMATCH'
            );
          }

          // 2. Synchronize in-memory store identically (ensures parity in dev/test and warm lambdas)
          let matchingOrder = orders.find(
            o =>
              (balkiOrderId && (o.id === balkiOrderId || o.orderId === balkiOrderId)) ||
              (rzpOrderId && o.razorpayOrderId === rzpOrderId)
          );

          if (matchingOrder) {
            const expectedPaise = Math.round(
              Number(matchingOrder.serverVerifiedTotal ?? matchingOrder.finalAmount ?? matchingOrder.totalAmount) * 100
            );
            if (String(eventCurrency).toUpperCase() !== 'INR') {
              processedWebhookEvents.add(eventId);
              return sendJsonError(res, 400, 'Webhook currency mismatch; INR required.', 'INVALID_CURRENCY');
            }
            if (typeof capturedAmountPaise === 'number' && capturedAmountPaise !== expectedPaise) {
              processedWebhookEvents.add(eventId);
              return sendJsonError(
                res,
                400,
                `Webhook payment amount mismatch (paid ₹${(capturedAmountPaise / 100).toFixed(2)}, expected ₹${(expectedPaise / 100).toFixed(2)}).`,
                'PAYMENT_AMOUNT_MISMATCH'
              );
            }

            if (matchingOrder.paymentStatus === 'Paid') {
              if (rzpPaymentId && matchingOrder.razorpayPaymentId && matchingOrder.razorpayPaymentId !== rzpPaymentId) {
                processedWebhookEvents.add(eventId);
                return sendJsonError(
                  res,
                  409,
                  `Order ${matchingOrder.id} is already paid with ${matchingOrder.razorpayPaymentId}. Conflicting payment ignored.`,
                  'DUPLICATE_PAYMENT_DETECTED'
                );
              }
            } else {
              matchingOrder.paymentStatus = 'Paid';
              matchingOrder.normalizedPaymentStatus = 'paid';
              matchingOrder.orderStatus = matchingOrder.orderStatus === 'delivered' ? 'delivered' : 'qc_assembly';
              matchingOrder.deliveryStatus = mapNormalizedDeliveryStatus(matchingOrder.orderStatus);
              matchingOrder.razorpayOrderId = rzpOrderId || matchingOrder.razorpayOrderId;
              matchingOrder.razorpayPaymentId = rzpPaymentId || matchingOrder.razorpayPaymentId;
              matchingOrder.paymentMethod = (paymentMethod as any) || matchingOrder.paymentMethod || 'Razorpay';
              matchingOrder.paidAt = new Date().toISOString();
              matchingOrder.updatedAt = new Date().toISOString();

              if (rzpPaymentId) {
                processedPaymentIds.set(rzpPaymentId, matchingOrder.id);
              }

              paymentTransactions.unshift({
                transactionId: `txn_wh_${Date.now()}`,
                orderId: matchingOrder.id,
                customerId: matchingOrder.customerId || matchingOrder.userId || 'client',
                amount: matchingOrder.totalAmount,
                currency: 'INR',
                paymentMethod: `Razorpay Webhook (${paymentMethod})`,
                transactionType: 'payment',
                gatewayReference: rzpPaymentId || rzpOrderId || eventId,
                status: 'SUCCESS',
                metadata: { eventName, eventId },
                createdAt: new Date().toISOString()
              });
            }
          }

          const effectiveOrder: any = fsResult.order || matchingOrder;
          const shouldEmail =
            Boolean(effectiveOrder) &&
            (fsResult.handledByFirestore ? Boolean(fsResult.shouldSendConfirmation) : !effectiveOrder.confirmationNotificationSent);

          if (effectiveOrder && shouldEmail) {
            if (matchingOrder) {
              matchingOrder.confirmationNotificationSent = true;
            }
            if (!fsResult.handledByFirestore) {
              notifications.unshift({
                notificationId: `notif_wh_${Date.now()}`,
                recipientId: effectiveOrder.customerId || effectiveOrder.userId || 'client',
                recipientEmail: effectiveOrder.customerEmail,
                title: `Payment Confirmed: Order ${effectiveOrder.id}`,
                message: `Your payment of INR ${Number(effectiveOrder.serverVerifiedTotal ?? effectiveOrder.totalAmount).toLocaleString('en-IN')} has been confirmed via Razorpay webhook.`,
                type: 'order_status',
                orderId: effectiveOrder.id,
                read: false,
                createdAt: new Date().toISOString()
              });
            }
            await sendOrderConfirmationEmailOnce({
              orderId: effectiveOrder.id || effectiveOrder.orderId,
              customerName: effectiveOrder.customerName || 'Valued Client',
              customerEmail: effectiveOrder.customerEmail,
              amountInr: Number(effectiveOrder.serverVerifiedTotal ?? effectiveOrder.finalAmount ?? effectiveOrder.totalAmount ?? 0),
              paymentStatus: 'Paid',
              razorpayPaymentId: rzpPaymentId || effectiveOrder.razorpayPaymentId || eventId,
              items: (effectiveOrder.items || []).map((it: any) => ({
                name: it.product?.name || it.name || 'STEM Hardware Item',
                quantity: it.quantity || 1,
                unitPrice: it.product?.price || it.unitPrice || 0
              }))
            });
          }

          processedWebhookEvents.add(eventId);
          logPaymentDiagnostic('webhook_capture_processed', {
            event: eventName,
            orderId: effectiveOrder?.id || balkiOrderId || null,
            razorpayOrderId: rzpOrderId || null,
            orderMatched: Boolean(effectiveOrder),
            firestoreSynced: fsResult.handledByFirestore
          });
          return sendJsonSuccess(res, 200, `Webhook event "${eventName}" processed`, {
            eventId,
            event: eventName,
            orderMatched: Boolean(effectiveOrder),
            firestoreSynced: fsResult.handledByFirestore
          });
        }

        // Handle payment.failed — never downgrade an already-Paid order
        const errorDesc = extractServerErrorMessage(
          paymentEntity?.error_description || paymentEntity?.error_reason,
          'Payment failed at Razorpay gateway.'
        );
        const errorCode = String(paymentEntity?.error_code || 'PAYMENT_FAILED');

        const fsFail = await runAtomicFailureTransaction({
          orderId: balkiOrderId || null,
          razorpayOrderId: rzpOrderId || null,
          razorpayPaymentId: rzpPaymentId || null,
          errorCode,
          errorDescription: errorDesc,
          eventId,
          eventName
        });

        if (fsFail.duplicateEvent) {
          processedWebhookEvents.add(eventId);
          return sendJsonSuccess(res, 200, 'Webhook failure event already processed (idempotent)', {
            eventId,
            event: eventName,
            duplicate: true
          });
        }

        const matchingOrder = orders.find(
          o =>
            (balkiOrderId && (o.id === balkiOrderId || o.orderId === balkiOrderId)) ||
            (rzpOrderId && o.razorpayOrderId === rzpOrderId)
        );

        let ignoredBecauseAlreadyPaid = Boolean(fsFail.ignoredAlreadyPaid);
        if (matchingOrder) {
          if (matchingOrder.paymentStatus === 'Paid') {
            ignoredBecauseAlreadyPaid = true;
          } else {
            matchingOrder.paymentStatus = 'Failed';
            matchingOrder.normalizedPaymentStatus = 'failed';
            matchingOrder.lastPaymentError = errorDesc;
            matchingOrder.failedPaymentAttempts = [
              ...(matchingOrder.failedPaymentAttempts || []),
              {
                paymentId: rzpPaymentId || null,
                errorCode,
                description: errorDesc,
                timestamp: new Date().toISOString()
              }
            ];
            matchingOrder.updatedAt = new Date().toISOString();
          }
        }

        processedWebhookEvents.add(eventId);
        logPaymentDiagnostic('webhook_failure_processed', {
          event: eventName,
          orderId: matchingOrder?.id || balkiOrderId || null,
          razorpayOrderId: rzpOrderId || null,
          ignoredBecauseAlreadyPaid,
          firestoreSynced: fsFail.handledByFirestore
        });
        return sendJsonSuccess(res, 200, `Webhook event "${eventName}" processed`, {
          eventId,
          event: eventName,
          orderMatched: Boolean(fsFail.order || matchingOrder),
          ignoredBecauseAlreadyPaid,
          firestoreSynced: fsFail.handledByFirestore
        });
      } catch (err: any) {
        logPaymentDiagnostic('webhook_error', {
          reason: extractServerErrorMessage(err, 'Internal server error processing Razorpay webhook.')
        });
        return sendJsonError(
          res,
          500,
          'Internal server error processing Razorpay webhook.',
          'WEBHOOK_PROCESSING_ERROR'
        );
      }
    }
  );

  // Standard JSON parser for all non-webhook /api/* routes
  app.use(express.json({ limit: '1mb' }));

  // Health & Deployment Readiness Check
  app.get(['/api', '/api/index', '/api/health'], (_req, res) => {
    const rzpStatus = getRazorpayConfigStatus();
    const fsStatus = getAdminFirestoreStatus();
    sendJsonSuccess(res, 200, 'Balki Technologies API operational', {
      status: 'ok',
      service: 'Balki Technologies STEM Platform API',
      environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
      razorpayConfigured: rzpStatus.configured,
      razorpayMode: rzpStatus.mode,
      webhookConfigured: rzpStatus.webhookConfigured,
      firestoreAdminConfigured: fsStatus.configured,
      firestoreAdminReason: fsStatus.reason,
      approvalThresholdInr: getApprovalThresholdInr(),
      timestamp: new Date().toISOString()
    });
  });

  // Official ATL Quotation Packages API
  app.get('/api/atl-packages', (_req, res) => {
    res.json(ATL_QUOTATION_PACKAGES);
  });

  // Products API
  app.get('/api/products', (req, res) => {
    const { category, grade, search } = req.query;
    let filtered = [...products];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (grade && grade !== 'All Grades') {
      filtered = filtered.filter(p => p.gradeLevel === grade || p.gradeLevel === 'All Grades');
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return sendJsonError(res, 404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }
    res.json(product);
  });

  // Rentals API
  app.get('/api/rentals', (_req, res) => {
    res.json(rentals);
  });

  app.post('/api/rentals/book', (req, res) => {
    const { equipmentId, userName, userEmail, userPhone, institutionName, startDate, endDate, totalDays, rentalFee, depositFee } = req.body || {};

    const equipment = rentals.find(r => r.id === equipmentId);
    if (!equipment) {
      return sendJsonError(res, 404, 'Equipment not found', 'EQUIPMENT_NOT_FOUND');
    }
    if (equipment.availableUnits <= 0) {
      return sendJsonError(res, 400, 'Selected equipment is currently fully booked', 'EQUIPMENT_UNAVAILABLE');
    }

    equipment.availableUnits -= 1;

    const newBooking: RentalBooking = {
      id: `RENT-${Date.now().toString().slice(-6)}`,
      equipmentId,
      equipmentName: equipment.name,
      userName,
      userEmail,
      userPhone,
      institutionName,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      rentalFee: Number(rentalFee),
      depositFee: Number(depositFee),
      totalAmount: Number(rentalFee) + Number(depositFee),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    rentalBookings.unshift(newBooking);
    res.status(201).json(newBooking);
  });

  app.get('/api/rentals/bookings', (_req, res) => {
    res.json(rentalBookings);
  });

  // Courses API
  app.get('/api/courses', (_req, res) => {
    res.json(courses);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return sendJsonError(res, 404, 'Course not found', 'COURSE_NOT_FOUND');
    }
    res.json(course);
  });

  app.post('/api/courses/:id/like', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return sendJsonError(res, 404, 'Course not found', 'COURSE_NOT_FOUND');
    }
    const { isLiked } = req.body || {};
    if (typeof isLiked === 'boolean') {
      course.isLiked = isLiked;
      course.likesCount = (course.likesCount || 0) + (isLiked ? 1 : -1);
      if (course.likesCount < 0) course.likesCount = 0;
    } else {
      course.isLiked = !course.isLiked;
      course.likesCount = (course.likesCount || 0) + (course.isLiked ? 1 : -1);
      if (course.likesCount < 0) course.likesCount = 0;
    }

    if (!userProgress.likedCourseIds) {
      userProgress.likedCourseIds = [];
    }
    if (course.isLiked && !userProgress.likedCourseIds.includes(course.id)) {
      userProgress.likedCourseIds.push(course.id);
    } else if (!course.isLiked) {
      userProgress.likedCourseIds = userProgress.likedCourseIds.filter(id => id !== course.id);
    }

    res.json({ success: true, course, likedCourseIds: userProgress.likedCourseIds });
  });

  // ==========================================
  // 1. PERSISTENT CART API
  // ==========================================
  app.get('/api/cart', (_req, res) => {
    let subtotal = 0;
    const stockWarnings: string[] = [];

    serverCart.items = serverCart.items.map(it => {
      const prod = products.find(p => p.id === it.product.id || p.sku === it.product.sku);
      if (prod) {
        if (prod.stock <= 0) {
          stockWarnings.push(`"${prod.name}" is currently out of stock.`);
        } else if (it.quantity > prod.stock) {
          stockWarnings.push(`Only ${prod.stock} units available for "${prod.name}" (requested ${it.quantity}).`);
          return { ...it, quantity: prod.stock };
        }
        return { ...it, product: prod };
      }
      return it;
    });

    for (const it of serverCart.items) {
      subtotal += it.product.price * it.quantity;
    }

    let discount = 0;
    if (serverCart.appliedCoupon === 'ATL2026') {
      discount = Math.min(subtotal, 500);
    } else if (serverCart.appliedCoupon === 'NEP20') {
      discount = Math.min(subtotal, Math.round(subtotal * 0.20));
    } else if (serverCart.appliedCoupon === 'BALKI10') {
      discount = Math.min(subtotal, Math.round(subtotal * 0.10));
    } else if (serverCart.appliedCoupon === 'FREESHIP') {
      discount = 150;
    }

    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const baseShipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
    const shippingFee = serverCart.appliedCoupon === 'FREESHIP' ? 0 : baseShipping;
    const total = Number(Math.max(0, subtotal + gstAmount + shippingFee - (serverCart.appliedCoupon === 'FREESHIP' ? 0 : discount)).toFixed(2));

    const payload: ServerCart = {
      items: serverCart.items,
      subtotal,
      gstAmount,
      shippingFee,
      discount,
      appliedCoupon: serverCart.appliedCoupon,
      total,
      stockWarnings
    };

    res.json(payload);
  });

  app.post('/api/cart/items', (req, res) => {
    const { productId, quantity = 1 } = req.body || {};
    const prod = products.find(p => p.id === productId || p.sku === productId);
    if (!prod) {
      return sendJsonError(res, 404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return sendJsonError(res, 400, 'Quantity must be a positive integer', 'INVALID_QUANTITY');
    }

    const existing = serverCart.items.find(i => i.product.id === prod.id || i.product.sku === prod.sku);
    const newQty = existing ? existing.quantity + qty : qty;

    if (newQty > prod.stock) {
      return sendJsonError(
        res,
        400,
        `Insufficient stock. Only ${prod.stock} units available for ${prod.name}.`,
        'INSUFFICIENT_STOCK',
        { availableStock: prod.stock }
      );
    }

    if (existing) {
      existing.quantity = newQty;
    } else {
      serverCart.items.push({ product: prod, quantity: newQty });
    }

    res.status(201).json({ success: true, cart: serverCart });
  });

  app.put('/api/cart/items/:productId', (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body || {};

    const prod = products.find(p => p.id === productId || p.sku === productId);
    if (!prod) {
      return sendJsonError(res, 404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0) {
      return sendJsonError(res, 400, 'Valid non-negative integer quantity required', 'INVALID_QUANTITY');
    }

    if (quantity === 0) {
      serverCart.items = serverCart.items.filter(i => i.product.id !== prod.id && i.product.sku !== prod.sku);
      return res.json({ success: true, message: 'Item removed from cart', cart: serverCart });
    }

    if (quantity > prod.stock) {
      return sendJsonError(
        res,
        400,
        `Insufficient stock constraint. Only ${prod.stock} units currently available.`,
        'INSUFFICIENT_STOCK',
        { availableStock: prod.stock }
      );
    }

    const item = serverCart.items.find(i => i.product.id === prod.id || i.product.sku === prod.sku);
    if (item) {
      item.quantity = quantity;
    } else {
      serverCart.items.push({ product: prod, quantity });
    }

    res.json({ success: true, cart: serverCart });
  });

  app.delete('/api/cart/items/:productId', (req, res) => {
    const { productId } = req.params;
    serverCart.items = serverCart.items.filter(i => i.product.id !== productId && i.product.sku !== productId);
    res.json({ success: true, message: 'Item removed', cart: serverCart });
  });

  app.post('/api/cart/clear', (_req, res) => {
    serverCart.items = [];
    serverCart.appliedCoupon = undefined;
    res.json({ success: true, message: 'Cart cleared' });
  });

  app.post('/api/cart/apply-coupon', (req, res) => {
    const { code } = req.body || {};
    if (!code || typeof code !== 'string') {
      return sendJsonError(res, 400, 'Coupon code required', 'COUPON_REQUIRED');
    }

    const clean = code.trim().toUpperCase();
    const validCoupons = ['ATL2026', 'NEP20', 'BALKI10', 'FREESHIP'];
    if (!validCoupons.includes(clean)) {
      return sendJsonError(
        res,
        400,
        'Invalid or expired coupon code. Available: ATL2026, NEP20, BALKI10, FREESHIP',
        'INVALID_COUPON'
      );
    }

    serverCart.appliedCoupon = clean;
    res.json({ success: true, appliedCoupon: clean, message: `Coupon ${clean} applied successfully` });
  });

  // ==========================================
  // 2. RAZORPAY GATEWAY CONFIGURATION, ORDERS, SIGNATURE & WEBHOOK APIS
  // Strictly reads credentials from environment variables.
  // NEVER exposes key secret; NEVER fabricates payment success.
  // ==========================================
  app.get('/api/razorpay/config-status', (_req, res) => {
    const status = getRazorpayConfigStatus();
    sendJsonSuccess(res, 200, status.configured ? 'Razorpay configured' : 'Razorpay credentials not yet configured', {
      configured: status.configured,
      mode: status.mode,
      keyId: status.keyId,
      currency: 'INR',
      testMode: status.mode === 'test',
      webhookConfigured: status.webhookConfigured
    });
  });

  app.get('/api/razorpay/public-key', (_req, res) => {
    const status = getRazorpayConfigStatus();
    if (!status.configured || !status.keyId) {
      return sendJsonError(
        res,
        503,
        'Razorpay payment gateway is not yet configured on this server. Please check back shortly or contact support.',
        'RAZORPAY_NOT_CONFIGURED',
        { configured: false, mode: 'unconfigured', currency: 'INR' }
      );
    }

    sendJsonSuccess(res, 200, 'Razorpay public key retrieved', {
      configured: true,
      keyId: status.keyId,
      mode: status.mode,
      currency: 'INR',
      testMode: status.mode === 'test'
    });
  });

  // Create Razorpay Order with authoritative server pricing
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();

      if (!rzpStatus.configured || !rzpStatus.keyId || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          'Razorpay merchant credentials are not yet configured. Your order details are preserved safely as Payment Pending.',
          'RAZORPAY_NOT_CONFIGURED',
          { configured: false, mode: 'unconfigured' }
        );
      }

      const { orderId, orderToken, items, customerEmail, customerPhone, couponCode } = req.body || {};
      const threshold = getApprovalThresholdInr();

      let order = orderId ? orders.find(o => o.id === orderId || o.orderId === orderId) : undefined;
      if (!order && orderToken) {
        const verified = verifyOrderToken(orderToken);
        if (!verified) {
          return sendJsonError(res, 400, 'Invalid or tampered order verification token.', 'INVALID_ORDER_TOKEN');
        }
        if (orderId && verified.orderId !== orderId) {
          return sendJsonError(res, 400, 'Order verification token does not match requested orderId.', 'ORDER_TOKEN_MISMATCH');
        }
        order = hydrateOrderFromSignedToken(verified);
        orders.unshift(order);
      }

      if (!order && orderId) {
        const fsOrder = await findFirestoreOrder({ orderId });
        if (fsOrder) {
          order = fsOrder as Order;
          orders.unshift(order);
        }
      }

      let finalAmount = 0;

      if (order) {
        if (order.paymentStatus === 'Paid') {
          return sendJsonError(res, 400, `Order ${order.id} has already been paid and processed.`, 'ORDER_ALREADY_PAID');
        }
        finalAmount = Number(order.serverVerifiedTotal ?? order.finalAmount ?? order.totalAmount);
        if (finalAmount >= threshold) {
          return sendJsonError(
            res,
            400,
            `Order amount of ₹${finalAmount.toLocaleString('en-IN')} meets or exceeds the approval threshold of ₹${threshold.toLocaleString('en-IN')}. Administrator approval is required.`,
            'APPROVAL_REQUIRED',
            { requiresApproval: true, threshold, finalAmount }
          );
        }

        if (order.razorpayOrderId && order.paymentStatus !== 'Failed') {
          return sendJsonSuccess(res, 200, 'Existing Razorpay order retrieved', {
            configured: true,
            mode: rzpStatus.mode,
            razorpayOrderId: order.razorpayOrderId,
            amount: Math.round(finalAmount * 100),
            currency: 'INR',
            keyId: rzpStatus.keyId,
            orderId: order.id,
            reused: true,
            notes: {
              balkiOrderId: order.id,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone
            }
          });
        }
      } else if (items && Array.isArray(items) && items.length > 0) {
        const calc = calculateTrustedOrderAmount(items, couponCode);
        if (!calc.success || !calc.data) {
          return sendJsonError(res, 400, calc.error || 'Invalid items', calc.code || 'CALCULATION_ERROR', {
            availableStock: calc.availableStock
          });
        }
        if (calc.data.finalAmount >= threshold) {
          return sendJsonError(
            res,
            400,
            `Order amount of ₹${calc.data.finalAmount.toLocaleString('en-IN')} requires owner approval.`,
            'APPROVAL_REQUIRED',
            { requiresApproval: true, threshold, finalAmount: calc.data.finalAmount }
          );
        }
        finalAmount = calc.data.finalAmount;
      } else {
        return sendJsonError(res, 400, 'Order ID or items array is required to create a Razorpay order.', 'MISSING_ORDER_REFERENCE');
      }

      const amountInPaise = Math.round(finalAmount * 100);
      if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
        logPaymentDiagnostic('create_order_invalid_amount', { orderId: order?.id || null, amountInPaise });
        return sendJsonError(
          res,
          400,
          'Order payable amount must be at least ₹1.00 (100 paise) for Razorpay processing.',
          'INVALID_ORDER_AMOUNT'
        );
      }

      const receiptId = order ? order.id : `rcpt_${Date.now().toString(36)}`;

      const rzpOrder = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          balkiOrderId: receiptId,
          customerEmail: customerEmail || order?.customerEmail || '',
          customerPhone: customerPhone || order?.customerPhone || ''
        }
      });

      if (order) {
        order.razorpayOrderId = rzpOrder.id;
        order.paymentStatus = 'Payment Pending';
        order.updatedAt = new Date().toISOString();
        await syncRazorpayOrderIdToFirestore(order.id, rzpOrder.id);
      }

      logPaymentDiagnostic('create_order_success', {
        mode: rzpStatus.mode,
        orderId: receiptId,
        razorpayOrderId: rzpOrder.id,
        amountInPaise
      });

      return sendJsonSuccess(res, 200, 'Razorpay order created successfully', {
        configured: true,
        mode: rzpStatus.mode,
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: rzpStatus.keyId,
        orderId: receiptId,
        notes: {
          balkiOrderId: receiptId,
          customerEmail: customerEmail || order?.customerEmail || '',
          customerPhone: customerPhone || order?.customerPhone || ''
        }
      });
    } catch (err: any) {
      const statusCode = Number(err?.statusCode || err?.error?.statusCode || 502);
      const extracted = extractServerErrorMessage(
        err,
        'Unable to create Razorpay payment order right now. Please try again.'
      );
      const isAuthError =
        statusCode === 401 ||
        extracted.toLowerCase().includes('authentication failed') ||
        extracted.toLowerCase().includes('key_id');
      const clientMessage = isAuthError
        ? 'Razorpay merchant authentication failed on the server. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server environment variables.'
        : extracted;

      logPaymentDiagnostic('create_order_failed', {
        statusCode,
        isAuthError,
        reason: clientMessage
      });
      return sendJsonError(
        res,
        502,
        clientMessage,
        isAuthError ? 'RAZORPAY_AUTH_FAILED' : 'RAZORPAY_ORDER_FAILED'
      );
    }
  });

  // Verify Razorpay payment with strict cryptographic HMAC SHA256 signature
  app.post('/api/razorpay/verify-payment', async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();

      if (!rzpStatus.configured || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          'Razorpay payment verification cannot proceed because merchant credentials are not configured on the server.',
          'RAZORPAY_NOT_CONFIGURED'
        );
      }

      const { orderId, orderToken, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return sendJsonError(
          res,
          400,
          'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are mandatory.',
          'MISSING_PAYMENT_SIGNATURE'
        );
      }

      // Strict cryptographic HMAC SHA256 signature verification
      const isSignatureValid = verifyRazorpayPaymentSignature(
        String(razorpay_order_id),
        String(razorpay_payment_id),
        String(razorpay_signature)
      );

      if (!isSignatureValid) {
        logPaymentDiagnostic('verify_payment_invalid_signature', {
          orderId: orderId || null,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          400,
          'Invalid Razorpay payment signature. Cryptographic verification failed. Payment cannot be verified.',
          'INVALID_PAYMENT_SIGNATURE'
        );
      }

      // Locate internal order (memory or verified signed orderToken)
      let order = orders.find(
        o =>
          (orderId && (o.id === orderId || o.orderId === orderId)) ||
          o.razorpayOrderId === razorpay_order_id
      );

      if (!order && orderToken) {
        const verifiedToken = verifyOrderToken(orderToken);
        if (!verifiedToken) {
          return sendJsonError(res, 400, 'Invalid order verification token.', 'INVALID_ORDER_TOKEN');
        }
        order = hydrateOrderFromSignedToken(verifiedToken);
        orders.unshift(order);
      }

      if (!order) {
        const fsOrder = await findFirestoreOrder({
          orderId: orderId ? String(orderId) : null,
          razorpayOrderId: String(razorpay_order_id)
        });
        if (fsOrder) {
          order = fsOrder as Order;
          orders.unshift(order);
        }
      }

      if (!order) {
        logPaymentDiagnostic('verify_payment_order_not_found', {
          orderId: orderId || null,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          404,
          `Order not found for ID "${orderId || razorpay_order_id}".`,
          'ORDER_NOT_FOUND'
        );
      }

      // Prevent cross-order payment replay: verified razorpay_order_id MUST match the order's staged razorpayOrderId
      if (order.razorpayOrderId && order.razorpayOrderId !== String(razorpay_order_id)) {
        logPaymentDiagnostic('verify_payment_order_mismatch', {
          orderId: order.id,
          expectedRazorpayOrderId: order.razorpayOrderId,
          receivedRazorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          400,
          'Razorpay order ID does not match this order record.',
          'RAZORPAY_ORDER_MISMATCH'
        );
      }

      // Duplicate verification & double-payment protection
      const existingOrderForPayment = processedPaymentIds.get(String(razorpay_payment_id));
      if (existingOrderForPayment && existingOrderForPayment !== order.id) {
        logPaymentDiagnostic('verify_payment_cross_order_duplicate', {
          orderId: order.id,
          existingOrderForPayment
        });
        return sendJsonError(
          res,
          409,
          `Payment ${razorpay_payment_id} has already been applied to another order (${existingOrderForPayment}).`,
          'DUPLICATE_PAYMENT_DETECTED'
        );
      }

      if (order.paymentStatus === 'Paid') {
        if (order.razorpayPaymentId === razorpay_payment_id || existingOrderForPayment === order.id) {
          return sendJsonSuccess(res, 200, 'Payment already verified for this order.', {
            alreadyVerified: true,
            order,
            payment: {
              paymentId: order.razorpayPaymentId,
              orderId: order.razorpayOrderId,
              amount: order.totalAmount,
              currency: 'INR',
              status: 'captured'
            }
          });
        }
        logPaymentDiagnostic('verify_payment_duplicate_rejected', {
          orderId: order.id,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          409,
          `Order ${order.id} has already been paid with transaction ${order.razorpayPaymentId}. Duplicate payment rejected.`,
          'DUPLICATE_PAYMENT_DETECTED'
        );
      }

      // Verify payment amount, currency & status directly with Razorpay API when reachable
      let fetchedMethod: string | null = null;
      let capturedAmountPaise: number | null = null;
      let capturedCurrency: string | null = null;

      try {
        const fetchedPayment: any = await razorpayClient.payments.fetch(String(razorpay_payment_id));
        if (fetchedPayment) {
          fetchedMethod = fetchedPayment.method ? String(fetchedPayment.method) : null;
          capturedAmountPaise = typeof fetchedPayment.amount === 'number' ? fetchedPayment.amount : null;
          capturedCurrency = fetchedPayment.currency ? String(fetchedPayment.currency) : null;

          if (fetchedPayment.order_id && String(fetchedPayment.order_id) !== String(razorpay_order_id)) {
            return sendJsonError(
              res,
              400,
              'Razorpay payment does not belong to the supplied Razorpay order ID.',
              'RAZORPAY_ORDER_MISMATCH'
            );
          }

          const expectedTotalInr = Number(order.serverVerifiedTotal ?? order.finalAmount ?? order.totalAmount);
          const expectedPaise = Math.round(expectedTotalInr * 100);
          if (typeof fetchedPayment.amount === 'number' && fetchedPayment.amount !== expectedPaise) {
            logPaymentDiagnostic('verify_payment_amount_mismatch', {
              orderId: order.id,
              paidPaise: fetchedPayment.amount,
              expectedPaise
            });
            return sendJsonError(
              res,
              400,
              `Payment amount mismatch detected (paid ₹${(fetchedPayment.amount / 100).toFixed(2)}, expected ₹${expectedTotalInr.toFixed(2)}).`,
              'PAYMENT_AMOUNT_MISMATCH'
            );
          }
          if (fetchedPayment.currency && fetchedPayment.currency !== 'INR') {
            return sendJsonError(res, 400, 'Invalid payment currency; INR required.', 'INVALID_CURRENCY');
          }
          if (fetchedPayment.status && !['captured', 'authorized'].includes(fetchedPayment.status)) {
            return sendJsonError(
              res,
              400,
              `Razorpay payment status is "${fetchedPayment.status}" and cannot be marked as paid.`,
              'PAYMENT_NOT_CAPTURED'
            );
          }
        }
      } catch (fetchErr: any) {
        logPaymentDiagnostic('verify_payment_fetch_note', {
          orderId: order.id,
          reason: extractServerErrorMessage(fetchErr, 'Unable to fetch remote payment details')
        });
      }

      // Atomic Firestore capture transaction (if Admin SDK configured)
      const fsCapture = await runAtomicCaptureTransaction({
        orderId: order.id,
        razorpayOrderId: String(razorpay_order_id),
        razorpayPaymentId: String(razorpay_payment_id),
        razorpaySignature: String(razorpay_signature),
        paymentMethod: fetchedMethod || 'Razorpay',
        capturedAmountPaise,
        currency: capturedCurrency || 'INR',
        source: 'checkout_verify',
        fallbackOrderData: order
      });

      if (fsCapture.razorpayOrderMismatch) {
        return sendJsonError(
          res,
          400,
          'Razorpay order ID does not match the persisted Firestore order.',
          'RAZORPAY_ORDER_MISMATCH'
        );
      }
      if (fsCapture.amountMismatch) {
        return sendJsonError(
          res,
          400,
          `Payment amount mismatch detected (paid ${fsCapture.actualPaise} paise, expected ${fsCapture.expectedPaise} paise).`,
          'PAYMENT_AMOUNT_MISMATCH'
        );
      }
      if (fsCapture.currencyMismatch) {
        return sendJsonError(res, 400, 'Invalid payment currency; INR required.', 'INVALID_CURRENCY');
      }
      if (fsCapture.conflictDuplicatePayment) {
        return sendJsonError(
          res,
          409,
          `Order ${order.id} has already been paid. Duplicate payment rejected.`,
          'DUPLICATE_PAYMENT_DETECTED'
        );
      }
      if (fsCapture.alreadyPaidSamePayment && fsCapture.order) {
        return sendJsonSuccess(res, 200, 'Payment already verified for this order.', {
          alreadyVerified: true,
          firestoreSynced: true,
          order: fsCapture.order,
          payment: {
            paymentId: fsCapture.order.razorpayPaymentId,
            orderId: fsCapture.order.razorpayOrderId,
            amount: fsCapture.order.totalAmount,
            currency: 'INR',
            status: 'captured'
          }
        });
      }

      // Transition in-memory order to Paid after full cryptographic verification
      const wasAlreadyNotified = Boolean(order.confirmationNotificationSent);
      processedPaymentIds.set(String(razorpay_payment_id), order.id);
      order.paymentStatus = 'Paid';
      order.normalizedPaymentStatus = 'paid';
      order.orderStatus = order.orderStatus === 'delivered' ? 'delivered' : 'qc_assembly';
      order.deliveryStatus = mapNormalizedDeliveryStatus(order.orderStatus);
      order.razorpayOrderId = String(razorpay_order_id);
      order.razorpayPaymentId = String(razorpay_payment_id);
      order.razorpaySignature = String(razorpay_signature);
      order.paymentMethod = (fetchedMethod as any) || 'Razorpay';
      order.paidAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();
      order.confirmationNotificationSent = true;

      if (order.trackingDetails) {
        order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map(cp => {
          if (cp.status === 'order_placed') {
            return { ...cp, completed: true, current: false };
          }
          if (cp.status === 'qc_assembly') {
            return { ...cp, completed: true, current: true, timestamp: new Date().toISOString() };
          }
          return cp;
        });
      }

      const transactionId = fsCapture.transaction?.transactionId || `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      paymentTransactions.unshift({
        transactionId,
        orderId: order.id,
        customerId: order.customerId || order.userId || 'client',
        amount: order.totalAmount,
        currency: 'INR',
        paymentMethod: fetchedMethod || 'Razorpay',
        transactionType: 'payment',
        gatewayReference: String(razorpay_payment_id),
        status: 'SUCCESS',
        metadata: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          verifiedAt: new Date().toISOString(),
          mode: rzpStatus.mode
        },
        createdAt: new Date().toISOString()
      });

      const shouldSendEmail = fsCapture.handledByFirestore ? Boolean(fsCapture.shouldSendConfirmation) : !wasAlreadyNotified;
      if (shouldSendEmail) {
        notifications.unshift({
          notificationId: `notif_${Date.now()}`,
          recipientId: order.customerId || order.userId || 'client',
          recipientEmail: order.customerEmail,
          title: `Payment Received: Order ${order.id}`,
          message: `Your payment of INR ${order.totalAmount.toLocaleString('en-IN')} has been cryptographically verified via Razorpay (Txn: ${razorpay_payment_id}). Consignment moved to QC Assembly.`,
          type: 'order_status',
          orderId: order.id,
          read: false,
          createdAt: new Date().toISOString()
        });

        await sendOrderConfirmationEmailOnce({
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          amountInr: Number(order.serverVerifiedTotal ?? order.totalAmount),
          paymentStatus: 'Paid',
          razorpayPaymentId: String(razorpay_payment_id),
          items: order.items.map(it => ({
            name: it.product.name,
            quantity: it.quantity,
            unitPrice: it.product.price
          }))
        });
      }

      logPaymentDiagnostic('verify_payment_success', {
        orderId: order.id,
        razorpayOrderId: String(razorpay_order_id),
        mode: rzpStatus.mode,
        firestoreSynced: fsCapture.handledByFirestore
      });

      return sendJsonSuccess(res, 200, 'Razorpay payment successfully verified and order marked as paid.', {
        firestoreSynced: fsCapture.handledByFirestore,
        order: fsCapture.order || order,
        payment: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          amount: order.totalAmount,
          currency: 'INR',
          status: 'captured'
        }
      });
    } catch (err: any) {
      const safeMsg = extractServerErrorMessage(err, 'Internal error verifying Razorpay payment.');
      logPaymentDiagnostic('verify_payment_error', { reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, 'PAYMENT_VERIFICATION_ERROR');
    }
  });

  // Fetch payment details
  app.get('/api/razorpay/payment/:id', async (req, res) => {
    const paymentId = req.params.id;
    const rzpStatus = getRazorpayConfigStatus();
    const razorpayClient = getRazorpayClient();

    if (!rzpStatus.configured || !razorpayClient) {
      return sendJsonError(
        res,
        503,
        'Razorpay payment gateway is not yet configured.',
        'RAZORPAY_NOT_CONFIGURED'
      );
    }

    try {
      const payment = await razorpayClient.payments.fetch(paymentId);
      return sendJsonSuccess(res, 200, 'Payment details retrieved', { payment });
    } catch (err: any) {
      const tx = paymentTransactions.find(t => t.gatewayReference === paymentId || t.transactionId === paymentId);
      if (tx) {
        return sendJsonSuccess(res, 200, 'Payment ledger record retrieved', {
          payment: {
            id: paymentId,
            amount: Math.round(tx.amount * 100),
            currency: tx.currency,
            status: tx.status === 'SUCCESS' ? 'captured' : tx.status.toLowerCase(),
            order_id: tx.orderId,
            method: tx.paymentMethod,
            created_at: Math.floor(new Date(tx.createdAt).getTime() / 1000)
          }
        });
      }
      return sendJsonError(
        res,
        404,
        extractServerErrorMessage(err, 'Payment record not found'),
        'PAYMENT_NOT_FOUND'
      );
    }
  });

  // Generate Razorpay Payment Link for APPROVED large orders / institutional quotes
  app.post('/api/razorpay/create-payment-link', async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      if (!rzpStatus.configured || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          'Razorpay merchant credentials are not yet configured. Cannot create live/test payment links yet.',
          'RAZORPAY_NOT_CONFIGURED'
        );
      }

      const { requestId, notes = {} } = req.body || {};
      if (!requestId) {
        return sendJsonError(res, 400, 'requestId parameter is mandatory.', 'REQUEST_ID_REQUIRED');
      }

      const request = orderRequests.find(r => r.requestId === requestId || r.id === requestId);
      if (!request) {
        return sendJsonError(res, 404, `Order request "${requestId}" not found.`, 'ORDER_REQUEST_NOT_FOUND');
      }

      if (request.approvalStatus !== 'approved') {
        return sendJsonError(
          res,
          400,
          `Cannot generate payment link. Order request ${requestId} has approval status "${request.approvalStatus}". Only after administrator approval and final quotation confirmation can a payment link be generated.`,
          'APPROVAL_REQUIRED',
          { approvalStatus: request.approvalStatus }
        );
      }

      const approvedAmount = request.finalQuotedAmount || request.finalAmount || request.requestedAmount;
      const amountInPaise = Math.round(approvedAmount * 100);

      if (request.razorpayPaymentLinkId && request.razorpayPaymentLinkUrl) {
        return sendJsonSuccess(res, 200, 'Existing payment link retrieved', {
          paymentLinkId: request.razorpayPaymentLinkId,
          paymentLinkUrl: request.razorpayPaymentLinkUrl,
          amount: approvedAmount,
          currency: 'INR',
          status: 'active',
          reused: true
        });
      }

      const linkRes: any = await razorpayClient.paymentLink.create({
        amount: amountInPaise,
        currency: 'INR',
        accept_partial: false,
        description: `Approved Institutional Quotation Payment for ${request.requestId} - Balki Technologies`,
        customer: {
          name: request.customerDetails?.name || 'Institutional Client',
          email: request.customerDetails?.email || '',
          contact: request.customerDetails?.phone || ''
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        notes: {
          requestId: request.requestId,
          schoolName: request.customerDetails?.schoolName || '',
          ...notes
        }
      });

      request.razorpayPaymentLinkId = linkRes.id;
      request.razorpayPaymentLinkUrl = linkRes.short_url;
      request.paymentStatus = 'LINK_GENERATED';
      request.updatedAt = new Date().toISOString();

      notifications.unshift({
        notificationId: `notif_${Date.now()}`,
        recipientId: request.customerId,
        recipientEmail: request.customerDetails?.email,
        title: `Payment Link Generated for Approved Quote ${request.requestId}`,
        message: `Your quotation for ₹${approvedAmount.toLocaleString('en-IN')} has been approved by the procurement desk. Complete payment via Razorpay: ${linkRes.short_url}`,
        type: 'approval',
        orderId: request.requestId,
        read: false,
        createdAt: new Date().toISOString()
      });

      return sendJsonSuccess(res, 200, 'Razorpay payment link generated successfully', {
        paymentLinkId: linkRes.id,
        paymentLinkUrl: linkRes.short_url,
        amount: approvedAmount,
        currency: 'INR',
        status: 'created'
      });
    } catch (err: any) {
      const msg = extractServerErrorMessage(err, 'Error creating Razorpay payment link');
      logPaymentDiagnostic('create_payment_link_failed', { reason: msg });
      return sendJsonError(
        res,
        502,
        msg,
        'RAZORPAY_PAYMENT_LINK_FAILED'
      );
    }
  });

  // Dynamic QR payment request
  app.post('/api/razorpay/create-qr', async (req, res) => {
    const rzpStatus = getRazorpayConfigStatus();
    const razorpayClient = getRazorpayClient();

    if (!rzpStatus.configured || !razorpayClient) {
      return sendJsonError(
        res,
        503,
        'Dynamic QR payment requires configured Razorpay merchant credentials.',
        'RAZORPAY_NOT_CONFIGURED'
      );
    }

    const { orderId, orderToken, customerPhone } = req.body || {};
    let order = orderId ? orders.find(o => o.id === orderId || o.orderId === orderId) : undefined;
    if (!order && orderToken) {
      const verified = verifyOrderToken(orderToken);
      if (verified) {
        order = hydrateOrderFromSignedToken(verified);
      }
    }

    if (!order) {
      return sendJsonError(res, 404, 'Valid order reference is required for QR payment.', 'ORDER_NOT_FOUND');
    }

    const cleanAmount = Number(order.totalAmount);
    if (!Number.isFinite(cleanAmount) || cleanAmount <= 0 || cleanAmount >= getApprovalThresholdInr()) {
      return sendJsonError(res, 400, 'Order is ineligible for automatic QR payment.', 'QR_INELIGIBLE');
    }

    try {
      const qrCode: any = await razorpayClient.qrCode.create({
        type: 'upi_qr',
        name: `BALKI ${order.id}`,
        usage: 'single_use',
        fixed_amount: true,
        payment_amount: Math.round(cleanAmount * 100),
        description: `Order ${order.id}`,
        notes: {
          balkiOrderId: order.id
        }
      });

      return sendJsonSuccess(res, 200, 'Razorpay dynamic QR created', {
        qrId: qrCode.id,
        qrImageUrl: qrCode.image_url,
        qrString: qrCode.image_url || qrCode.id,
        orderId: order.id,
        amount: cleanAmount,
        currency: 'INR',
        customerPhone: customerPhone || order.customerPhone || null
      });
    } catch (qrErr: any) {
      const msg = extractServerErrorMessage(
        qrErr,
        'Razorpay QR creation is unavailable on this merchant account. Please use Razorpay Checkout modal.'
      );
      logPaymentDiagnostic('create_qr_failed', { orderId: order.id, reason: msg });
      return sendJsonError(res, 502, msg, 'RAZORPAY_QR_UNAVAILABLE');
    }
  });

  // ==========================================
  // 3. REAL-TIME CONSIGNMENT TRACKING & ORDERS API
  // ==========================================
  app.get('/api/orders', (req, res) => {
    const { search, email, phone, status, trackingNumber } = req.query;
    let filtered = [...orders];

    if (email && typeof email === 'string') {
      filtered = filtered.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    }
    if (phone && typeof phone === 'string') {
      filtered = filtered.filter(o => o.customerPhone.includes(phone));
    }
    if (status && typeof status === 'string') {
      filtered = filtered.filter(o => o.orderStatus === status || o.paymentStatus.toLowerCase().includes(status.toLowerCase()));
    }
    if (trackingNumber && typeof trackingNumber === 'string') {
      filtered = filtered.filter(o => o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.schoolName && o.schoolName.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  });

  app.get('/api/orders/threshold', (_req, res) => {
    const threshold = getApprovalThresholdInr();
    sendJsonSuccess(res, 200, 'Threshold configuration retrieved', {
      threshold,
      currency: 'INR',
      description: `Orders < ₹${threshold.toLocaleString('en-IN')} proceed with automatic payment; orders >= ₹${threshold.toLocaleString('en-IN')} require owner approval.`
    });
  });

  // Direct Live Tracking Lookup (must come before /api/orders/:id)
  app.get('/api/orders/track/:query', (req, res) => {
    const queryStr = req.params.query.trim().toLowerCase();
    const order = orders.find(
      o =>
        o.trackingNumber.toLowerCase() === queryStr ||
        o.id.toLowerCase() === queryStr ||
        (o.trackingDetails?.awbNumber && o.trackingDetails.awbNumber.toLowerCase() === queryStr) ||
        o.customerPhone.replace(/\D/g, '').includes(queryStr.replace(/\D/g, '')) ||
        o.customerEmail.toLowerCase() === queryStr
    );

    if (!order) {
      return sendJsonError(
        res,
        404,
        `No consignment found for tracking identifier: "${req.params.query}".`,
        'TRACKING_NOT_FOUND',
        {
          found: false,
          suggestions: ['BALKI-EXP-940212IN', 'DELHIVERY-B2B-8971203', 'ORD-2026-9081']
        }
      );
    }

    if (!order.trackingDetails) {
      const generated = generateOrderTracking(
        order.id,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.paymentMethod,
        order.schoolName
      );
      order.trackingDetails = generated.trackingDetails;
      order.trackingNumber = order.trackingNumber || generated.trackingNumber;
      order.deliveryOtp = order.deliveryOtp || generated.deliveryOtp;
    }

    return sendJsonSuccess(res, 200, 'Order tracking details retrieved', {
      found: true,
      order,
      trackingDetails: order.trackingDetails
    });
  });

  app.post('/api/orders/:id/track/advance', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    if (!order.trackingDetails) {
      const generated = generateOrderTracking(
        order.id,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.paymentMethod,
        order.schoolName
      );
      order.trackingDetails = generated.trackingDetails;
    }

    const stages: OrderStatus[] = [
      'order_placed',
      'qc_assembly',
      'dispatched',
      'in_transit',
      'out_for_delivery',
      'delivered'
    ];

    const currentIdx = stages.indexOf(order.orderStatus || 'qc_assembly');
    if (currentIdx === -1 || currentIdx >= stages.length - 1) {
      return sendJsonSuccess(res, 200, 'Order is already delivered or in final stage.', { order });
    }

    const nextStatus = stages[currentIdx + 1];
    order.orderStatus = nextStatus;
    const nowIso = new Date().toISOString();

    order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map(cp => {
      const cpIdx = stages.indexOf(cp.status);
      const nextIdx = currentIdx + 1;
      if (cpIdx <= nextIdx) {
        return {
          ...cp,
          completed: true,
          current: cpIdx === nextIdx,
          timestamp: cpIdx === nextIdx ? nowIso : cp.timestamp
        };
      }
      return { ...cp, completed: false, current: false };
    });

    if (nextStatus === 'dispatched') {
      order.trackingDetails.liveCoordinates = { lat: 17.2341, lng: 78.4312 };
    } else if (nextStatus === 'in_transit') {
      order.trackingDetails.liveCoordinates = { lat: 17.4721, lng: 78.4892 };
    } else if (nextStatus === 'out_for_delivery') {
      order.trackingDetails.liveCoordinates = { lat: 17.5021, lng: 78.5082 };
    } else if (nextStatus === 'delivered') {
      order.trackingDetails.liveCoordinates = { lat: 17.5118, lng: 78.5204 };
    }

    return sendJsonSuccess(res, 200, `Consignment tracking advanced to ${nextStatus}`, { order });
  });

  app.post('/api/orders/:id/cancel', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    if (order.orderStatus === 'delivered') {
      return sendJsonError(
        res,
        400,
        'Delivered orders cannot be cancelled online. Please initiate return request.',
        'ORDER_ALREADY_DELIVERED'
      );
    }

    if (order.orderStatus === 'cancelled') {
      return sendJsonError(res, 400, 'Order is already cancelled', 'ORDER_ALREADY_CANCELLED');
    }

    for (const item of order.items) {
      const prod = products.find(p => p.id === item.product.id || p.sku === item.product.sku);
      if (prod) {
        prod.stock += item.quantity;
        const inv = inventory.find(i => i.sku === prod.sku);
        if (inv) {
          inv.currentStock = prod.stock;
          inv.status = inv.currentStock > inv.minimumThreshold ? 'In Stock' : 'Low Stock';
        }
      }
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'Paid' ? 'Refunded' : 'Failed';

    if (order.trackingDetails) {
      order.trackingDetails.checkpoints.push({
        id: `chk-cancel-${Date.now()}`,
        status: 'cancelled',
        title: 'Order Cancelled & Stock Restored',
        description: 'Customer requested cancellation before delivery. Reserved inventory restored.',
        location: 'Balki Corporate HQ, Hyderabad',
        timestamp: new Date().toISOString(),
        completed: true,
        current: true
      });
    }

    return sendJsonSuccess(res, 200, 'Order cancelled successfully. Inventory restored.', { order });
  });

  // ==========================================
  // 4. SECURE SERVER-SIDE PRICING & CHECKOUT ENGINE
  // ==========================================
  app.post('/api/orders/calculate', (req, res) => {
    const { items, couponCode } = req.body || {};
    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return sendJsonError(res, 400, calc.error || 'Calculation error', calc.code || 'CALCULATION_ERROR', {
        availableStock: calc.availableStock
      });
    }

    const rzpStatus = getRazorpayConfigStatus();
    return sendJsonSuccess(res, 200, 'Order total calculated authoritatively', {
      ...calc.data,
      amountInPaise: Math.round(calc.data.finalAmount * 100),
      razorpay: {
        configured: rzpStatus.configured,
        mode: rzpStatus.mode
      }
    });
  });

  // Small Order Checkout (< ₹5,000)
  app.post('/api/orders/checkout-small', async (req, res) => {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      deliveryAddress,
      shippingAddress,
      items,
      couponCode,
      paymentMethod = 'Razorpay'
    } = req.body || {};

    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      return sendJsonError(res, 400, 'Customer full name is required.', 'INVALID_CUSTOMER_NAME');
    }
    if (!isValidEmail(customerEmail)) {
      return sendJsonError(res, 400, 'A valid email address is required.', 'INVALID_CUSTOMER_EMAIL');
    }
    if (!isValidPhone(customerPhone)) {
      return sendJsonError(res, 400, 'A valid 10-digit phone number is required.', 'INVALID_CUSTOMER_PHONE');
    }

    const address = normalizeAddress(deliveryAddress || shippingAddress);
    if (!address) {
      return sendJsonError(
        res,
        400,
        'Complete delivery address (street, city, state, and 6-digit PIN code) is mandatory.',
        'INVALID_DELIVERY_ADDRESS'
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendJsonError(res, 400, 'Cart items are required for checkout.', 'EMPTY_ITEMS');
    }

    // Duplicate submission protection (8s window)
    const idempotencyKey = `${customerEmail.trim().toLowerCase()}_${JSON.stringify(
      items.map((i: any) => ({ id: i.productId || i.id, q: i.quantity }))
    )}`;
    const now = Date.now();
    if (recentSubmissions.has(idempotencyKey) && now - recentSubmissions.get(idempotencyKey)! < 8000) {
      return sendJsonError(
        res,
        429,
        'A duplicate checkout submission is already being processed. Please wait a moment.',
        'DUPLICATE_SUBMISSION'
      );
    }
    recentSubmissions.set(idempotencyKey, now);

    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return sendJsonError(res, 400, calc.error || 'Invalid order items', calc.code || 'CALCULATION_ERROR', {
        availableStock: calc.availableStock
      });
    }

    const threshold = getApprovalThresholdInr();
    if (calc.data.finalAmount >= threshold) {
      return sendJsonError(
        res,
        400,
        `Order amount of ₹${calc.data.finalAmount.toLocaleString('en-IN')} meets or exceeds the approval threshold of ₹${threshold.toLocaleString('en-IN')}. Please submit as "Request Owner Approval".`,
        'APPROVAL_REQUIRED',
        {
          requiresApproval: true,
          threshold,
          finalAmount: calc.data.finalAmount
        }
      );
    }

    // Reserve stock authoritatively
    for (const it of calc.data.items) {
      const prod = products.find(p => p.id === it.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - it.quantity);
        const inv = inventory.find(i => i.sku === prod.sku);
        if (inv) {
          inv.currentStock = prod.stock;
          if (inv.currentStock <= inv.minimumThreshold) {
            inv.status = inv.currentStock === 0 ? 'Critical' : 'Low Stock';
          }
        }
      }
    }

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCustomerId = customerId || 'client_' + customerEmail.trim().split('@')[0];

    const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
      orderId,
      address.city,
      address.state,
      paymentMethod,
      schoolName
    );

    const fullItems: CartItem[] = calc.data.items.map(it => {
      const fullProd = products.find(p => p.id === it.productId)!;
      return {
        product: fullProd,
        quantity: it.quantity
      };
    });

    const rzpStatus = getRazorpayConfigStatus();
    const razorpayClient = getRazorpayClient();
    let razorpayOrderId: string | undefined = undefined;
    let razorpayErrorMessage: string | undefined = undefined;

    if (rzpStatus.configured && razorpayClient) {
      const amountInPaise = Math.round(calc.data.finalAmount * 100);
      if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
        razorpayErrorMessage = 'Order payable amount must be at least ₹1.00 (100 paise) for Razorpay processing.';
        logPaymentDiagnostic('checkout_small_invalid_amount', { orderId, amountInPaise });
      } else {
        try {
          const rzpOrder: any = await razorpayClient.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: orderId,
            notes: {
              balkiOrderId: orderId,
              customerEmail: customerEmail.trim(),
              customerPhone: customerPhone.trim()
            }
          });
          razorpayOrderId = rzpOrder.id;
          logPaymentDiagnostic('checkout_small_rzp_order_created', {
            orderId,
            razorpayOrderId,
            amountInPaise,
            mode: rzpStatus.mode
          });
        } catch (sdkErr: any) {
          const statusCode = Number(sdkErr?.statusCode || sdkErr?.error?.statusCode || 502);
          const extracted = extractServerErrorMessage(sdkErr, 'Unable to initialize Razorpay order right now.');
          const isAuthError =
            statusCode === 401 ||
            extracted.toLowerCase().includes('authentication failed') ||
            extracted.toLowerCase().includes('key_id');
          razorpayErrorMessage = isAuthError
            ? 'Razorpay merchant authentication failed on the server. Please verify server RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
            : extracted;
          logPaymentDiagnostic('checkout_small_rzp_order_failed', {
            orderId,
            statusCode,
            isAuthError,
            reason: razorpayErrorMessage
          });
        }
      }
    }

    const newOrder: Order = {
      id: orderId,
      orderId,
      userId: effectiveCustomerId,
      customerId: effectiveCustomerId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      schoolName: typeof schoolName === 'string' && schoolName.trim() ? schoolName.trim() : undefined,
      gstin: typeof gstin === 'string' && gstin.trim() ? gstin.trim().toUpperCase() : undefined,
      deliveryAddress: address,
      shippingAddress: address,
      products: fullItems,
      items: fullItems,
      subtotal: calc.data.subtotal,
      taxAmount: calc.data.taxAmount,
      gstAmount: calc.data.taxAmount,
      shippingCharges: calc.data.shippingCharges,
      shippingFee: calc.data.shippingCharges,
      discount: calc.data.discount,
      finalAmount: calc.data.finalAmount,
      serverVerifiedTotal: calc.data.finalAmount,
      totalAmount: calc.data.finalAmount,
      currency: 'INR',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Payment Pending',
      normalizedPaymentStatus: 'pending',
      orderStatus: 'order_placed',
      deliveryStatus: 'pending',
      approvalStatus: 'approved',
      razorpayOrderId,
      trackingNumber,
      courierName: 'Delhivery B2B Priority',
      deliveryOtp,
      trackingDetails,
      confirmationNotificationSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    const firestoreSynced = await syncOrderCreatedToFirestore(newOrder);

    const orderToken = signOrderToken({
      orderId,
      customerId: effectiveCustomerId,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
      schoolName: newOrder.schoolName,
      gstin: newOrder.gstin,
      deliveryAddress: address,
      subtotal: calc.data.subtotal,
      taxAmount: calc.data.taxAmount,
      shippingCharges: calc.data.shippingCharges,
      discount: calc.data.discount,
      finalAmount: calc.data.finalAmount,
      currency: 'INR',
      razorpayOrderId,
      trackingNumber,
      deliveryOtp,
      items: calc.data.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      iat: Date.now()
    });

    const razorpayInfo =
      rzpStatus.configured && rzpStatus.keyId && razorpayOrderId
        ? {
            configured: true,
            mode: rzpStatus.mode,
            orderId: razorpayOrderId,
            amount: Math.round(calc.data.finalAmount * 100),
            currency: 'INR',
            status: 'created',
            keyId: rzpStatus.keyId,
            notes: {
              balkiOrderId: orderId,
              customerEmail: newOrder.customerEmail,
              customerPhone: newOrder.customerPhone
            }
          }
        : {
            configured: rzpStatus.configured,
            mode: rzpStatus.mode,
            orderId: null,
            amount: Math.round(calc.data.finalAmount * 100),
            currency: 'INR',
            status: rzpStatus.configured ? 'gateway_error' : 'not_configured',
            keyId: null,
            message:
              razorpayErrorMessage ||
              'Razorpay payment gateway is not yet configured with merchant API credentials. Your order has been saved safely as Payment Pending.'
          };

    return sendJsonSuccess(
      res,
      201,
      razorpayInfo.orderId
        ? 'Small order created and prepared for Razorpay checkout.'
        : 'Small order saved as Payment Pending. Online payment gateway is awaiting merchant credential setup.',
      {
        orderCategory: 'SMALL_ORDER',
        order: newOrder,
        orderToken,
        firestoreSynced,
        razorpay: razorpayInfo
      }
    );
  });

  // Large Order Checkout (₹5,000 or above - Owner Approval Required)
  app.post('/api/orders/request-approval', async (req, res) => {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      deliveryAddress,
      shippingAddress,
      items,
      couponCode
    } = req.body || {};

    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      return sendJsonError(res, 400, 'Customer full name is required.', 'INVALID_CUSTOMER_NAME');
    }
    if (!isValidEmail(customerEmail)) {
      return sendJsonError(res, 400, 'A valid email address is required.', 'INVALID_CUSTOMER_EMAIL');
    }
    if (!isValidPhone(customerPhone)) {
      return sendJsonError(res, 400, 'A valid 10-digit phone number is required.', 'INVALID_CUSTOMER_PHONE');
    }

    const address = normalizeAddress(deliveryAddress || shippingAddress);
    if (!address) {
      return sendJsonError(
        res,
        400,
        'Complete delivery address (street, city, state, and 6-digit PIN code) is mandatory.',
        'INVALID_DELIVERY_ADDRESS'
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendJsonError(res, 400, 'Cart items are required.', 'EMPTY_ITEMS');
    }

    const idempotencyKey = `req_${customerEmail.trim().toLowerCase()}_${JSON.stringify(
      items.map((i: any) => ({ id: i.productId || i.id, q: i.quantity }))
    )}`;
    const now = Date.now();
    if (recentSubmissions.has(idempotencyKey) && now - recentSubmissions.get(idempotencyKey)! < 8000) {
      return sendJsonError(
        res,
        429,
        'A duplicate approval request is already in progress. Please wait a moment.',
        'DUPLICATE_SUBMISSION'
      );
    }
    recentSubmissions.set(idempotencyKey, now);

    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return sendJsonError(res, 400, calc.error || 'Invalid items', calc.code || 'CALCULATION_ERROR', {
        availableStock: calc.availableStock
      });
    }

    const threshold = getApprovalThresholdInr();
    if (calc.data.finalAmount < threshold) {
      return sendJsonError(
        res,
        400,
        `Order amount ₹${calc.data.finalAmount.toLocaleString('en-IN')} is below ₹${threshold.toLocaleString('en-IN')} and qualifies for direct automatic payment checkout.`,
        'SMALL_ORDER_PATH_REQUIRED',
        { requiresApproval: false, threshold, finalAmount: calc.data.finalAmount }
      );
    }

    const requestId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCustomerId = customerId || 'client_' + customerEmail.trim().split('@')[0];

    const newRequest: OrderRequest = {
      requestId,
      id: requestId,
      customerId: effectiveCustomerId,
      customerDetails: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        schoolName: typeof schoolName === 'string' && schoolName.trim() ? schoolName.trim() : undefined,
        gstin: typeof gstin === 'string' && gstin.trim() ? gstin.trim().toUpperCase() : undefined,
        address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        shippingAddress: address
      },
      requestedProducts: calc.data.items.map(it => ({
        productId: it.productId,
        productName: it.name,
        quantity: it.quantity,
        estimatedUnitPrice: it.unitPrice
      })),
      subtotal: calc.data.subtotal,
      taxAmount: calc.data.taxAmount,
      shippingCharges: calc.data.shippingCharges,
      requestedAmount: calc.data.finalAmount,
      finalAmount: calc.data.finalAmount,
      currency: 'INR',
      approvalStatus: 'PENDING',
      paymentStatus: 'NOT_STARTED',
      rejectionReason: null,
      finalQuotedAmount: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orderRequests.unshift(newRequest);
    const firestoreSynced = await syncOrderRequestToFirestore(newRequest);

    notifications.unshift({
      notificationId: `notif_admin_${Date.now()}`,
      recipientId: 'super-admin-balki',
      recipientEmail: 'kartikks1205@gmail.com',
      title: `High-Value Order Approval Request: ${requestId}`,
      message: `${schoolName || customerName} requested approval for ₹${calc.data.finalAmount.toLocaleString('en-IN')} (${calc.data.items.length} hardware packages).`,
      type: 'approval',
      orderId: requestId,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(
      res,
      201,
      'Your order request has been successfully submitted. Our team will verify product availability and contact you shortly regarding pricing and payment.',
      {
        orderCategory: 'LARGE_ORDER',
        requestId,
        firestoreSynced,
        request: newRequest
      }
    );
  });

  app.get('/api/orders/:id/payment-status', async (req, res) => {
    const orderId = req.params.id;
    const razorpayOrderId = typeof req.query.razorpayOrderId === 'string' ? req.query.razorpayOrderId : undefined;
    const fsOrder = await findFirestoreOrder({ orderId, razorpayOrderId });
    const memOrder = orders.find(
      o => o.id === orderId || o.orderId === orderId || (razorpayOrderId && o.razorpayOrderId === razorpayOrderId)
    );
    const found: any = fsOrder || memOrder;
    if (!found) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }
    return sendJsonSuccess(res, 200, 'Order payment status retrieved', {
      orderId: found.id || found.orderId,
      paymentStatus: found.paymentStatus,
      normalizedPaymentStatus: found.normalizedPaymentStatus || mapNormalizedPaymentStatus(found.paymentStatus),
      orderStatus: found.orderStatus,
      deliveryStatus: found.deliveryStatus || mapNormalizedDeliveryStatus(found.orderStatus),
      approvalStatus: found.approvalStatus,
      razorpayOrderId: found.razorpayOrderId || null,
      razorpayPaymentId: found.razorpayPaymentId || null,
      paidAt: found.paidAt || null,
      lastPaymentError: found.lastPaymentError || null,
      confirmed: found.paymentStatus === 'Paid'
    });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }
    res.json(order);
  });

  // ==========================================
  // 5. CUSTOMER HISTORY & NOTIFICATIONS APIS
  // ==========================================
  app.get('/api/customer/orders', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, 'customerId or email parameter required', 'MISSING_CUSTOMER_IDENTIFIER');
    }

    const filtered = orders.filter(
      o =>
        (customerId && (o.customerId === customerId || o.userId === customerId)) ||
        (email && typeof email === 'string' && o.customerEmail.toLowerCase() === email.toLowerCase())
    );
    res.json(filtered);
  });

  app.get('/api/customer/order-requests', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, 'customerId or email parameter required', 'MISSING_CUSTOMER_IDENTIFIER');
    }

    const filtered = orderRequests.filter(
      r =>
        (customerId && r.customerId === customerId) ||
        (email && typeof email === 'string' && r.customerDetails.email?.toLowerCase() === email.toLowerCase())
    );
    res.json(filtered);
  });

  app.get('/api/customer/notifications', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, 'customerId or email parameter required', 'MISSING_CUSTOMER_IDENTIFIER');
    }

    const filtered = notifications.filter(
      n =>
        (customerId && n.recipientId === customerId) ||
        (email && typeof email === 'string' && n.recipientEmail?.toLowerCase() === email.toLowerCase())
    );
    res.json(filtered);
  });

  app.post('/api/customer/notifications/:id/read', (req, res) => {
    const notif = notifications.find(n => n.notificationId === req.params.id);
    if (!notif) {
      return sendJsonError(res, 404, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
    }
    notif.read = true;
    res.json({ success: true, notification: notif });
  });

  // ==========================================
  // 6. SECURE ROLE-BASED ADMIN MANAGEMENT APIS
  // ==========================================
  app.get('/api/admin/verify', (req, res) => {
    const access = verifyAdminAccess(req);
    res.json({
      isAdmin: access.authorized,
      admin: access.authorized
        ? {
            email: access.email,
            role: access.role,
            permissions: ['manage_orders', 'approve_requests', 'change_delivery_status', 'view_analytics']
          }
        : null
    });
  });

  app.get('/api/admin/orders', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const { approvalStatus, orderStatus, search } = req.query;
    let list = [...orders];

    if (approvalStatus && typeof approvalStatus === 'string') {
      list = list.filter(o => o.approvalStatus === approvalStatus);
    }
    if (orderStatus && typeof orderStatus === 'string') {
      list = list.filter(o => o.orderStatus === orderStatus);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.schoolName && o.schoolName.toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  app.post('/api/admin/orders/:id/approve', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    order.approvalStatus = 'approved';
    order.approvedAt = new Date().toISOString();
    order.approvedBy = access.email || 'kartikks1205@gmail.com';
    order.orderStatus = 'qc_assembly';
    order.updatedAt = new Date().toISOString();

    if (order.trackingDetails) {
      order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map(cp => {
        if (cp.status === 'order_placed' || cp.status === 'qc_assembly') {
          return { ...cp, completed: true, current: cp.status === 'qc_assembly' };
        }
        return cp;
      });
    }

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || 'client',
      recipientEmail: order.customerEmail,
      title: `Order ${order.id} Approved by Procurement Desk`,
      message: 'Your order has passed administrative verification and advanced to technical assembly and QA testing.',
      type: 'approval',
      orderId: order.id,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(res, 200, `Order ${order.id} approved successfully`, { order });
  });

  app.post('/api/admin/orders/:id/reject', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const { rejectionReason } = req.body || {};
    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    order.approvalStatus = 'rejected';
    order.rejectionReason = rejectionReason || 'Institutional document requirements not satisfied.';
    order.orderStatus = 'cancelled';
    order.updatedAt = new Date().toISOString();

    for (const item of order.items) {
      const prod = products.find(p => p.id === item.product?.id || p.sku === item.product?.sku);
      if (prod) {
        prod.stock += item.quantity;
      }
    }

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || 'client',
      recipientEmail: order.customerEmail,
      title: `Notice Regarding Order ${order.id}`,
      message: `Order update: ${order.rejectionReason}. Allocated inventory has been restored. Contact support for assistance.`,
      type: 'approval',
      orderId: order.id,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(res, 200, `Order ${order.id} rejected and inventory stock restored`, { order });
  });

  app.post('/api/admin/orders/:id/status', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const { status, courierName, trackingNumber, note } = req.body || {};
    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    if (status) order.orderStatus = status;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    if (order.trackingDetails && status) {
      const stages: OrderStatus[] = ['order_placed', 'qc_assembly', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered'];
      const targetIdx = stages.indexOf(status);
      if (targetIdx !== -1) {
        order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map((cp, idx) => ({
          ...cp,
          completed: idx <= targetIdx,
          current: idx === targetIdx
        }));
      }
    }

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || 'client',
      recipientEmail: order.customerEmail,
      title: `Consignment Update: Order ${order.id} is ${status?.replace('_', ' ').toUpperCase()}`,
      message: note || `Consignment status updated to ${status}. Carrier: ${order.courierName || 'Delhivery'}.`,
      type: 'tracking',
      orderId: order.id,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(res, 200, `Order ${order.id} status updated to ${status}`, { order });
  });

  app.get('/api/admin/order-requests', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }
    res.json(orderRequests);
  });

  app.post('/api/admin/order-requests/:id/approve', async (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const { finalQuotedAmount, shippingCharges = 0 } = req.body || {};
    const request = orderRequests.find(r => r.requestId === req.params.id);
    if (!request) {
      return sendJsonError(res, 404, 'Quote request not found', 'ORDER_REQUEST_NOT_FOUND');
    }

    const quotedInr = Number(finalQuotedAmount) || request.requestedAmount;
    if (!Number.isFinite(quotedInr) || quotedInr <= 0) {
      return sendJsonError(res, 400, 'Approved quoted amount must be positive.', 'INVALID_QUOTED_AMOUNT');
    }

    request.approvalStatus = 'approved';
    request.finalQuotedAmount = quotedInr;
    request.shippingCharges = Number(shippingCharges) || 0;
    request.updatedAt = new Date().toISOString();

    const rzpStatus = getRazorpayConfigStatus();
    const razorpayClient = getRazorpayClient();
    let linkId: string | undefined = undefined;
    let linkUrl: string | undefined = undefined;

    if (rzpStatus.configured && razorpayClient) {
      try {
        const linkRes: any = await razorpayClient.paymentLink.create({
          amount: Math.round(quotedInr * 100),
          currency: 'INR',
          accept_partial: false,
          description: `Approved Institutional Quotation Payment for ${request.requestId} - Balki Technologies`,
          customer: {
            name: request.customerDetails?.name || 'Institutional Client',
            email: request.customerDetails?.email || '',
            contact: request.customerDetails?.phone || ''
          },
          notify: { sms: true, email: true },
          reminder_enable: true,
          notes: {
            requestId: request.requestId,
            schoolName: request.customerDetails?.schoolName || ''
          }
        });
        linkId = linkRes.id;
        linkUrl = linkRes.short_url;
        request.razorpayPaymentLinkId = linkId;
        request.razorpayPaymentLinkUrl = linkUrl;
        request.paymentStatus = 'LINK_GENERATED';
      } catch (linkErr: any) {
        console.warn('Razorpay payment link creation failed during approval:', linkErr?.error || linkErr);
        request.paymentStatus = 'Pending';
      }
    } else {
      request.paymentStatus = 'Pending';
    }

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: request.customerId,
      recipientEmail: request.customerDetails?.email,
      title: `Institutional Quote Approved: ${request.requestId}`,
      message: linkUrl
        ? `Your bulk quote has been approved at INR ${quotedInr.toLocaleString('en-IN')}. Razorpay payment link: ${linkUrl}`
        : `Your bulk quote has been approved at INR ${quotedInr.toLocaleString('en-IN')}. Payment link pending merchant gateway configuration.`,
      type: 'approval',
      orderId: request.requestId,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(
      res,
      200,
      linkUrl
        ? `Quote request ${request.requestId} approved and Razorpay payment link generated.`
        : `Quote request ${request.requestId} approved. Razorpay credentials are not yet configured to generate live payment link.`,
      {
        request,
        paymentLink: linkId && linkUrl ? { paymentLinkId: linkId, paymentLinkUrl: linkUrl, amount: quotedInr } : null
      }
    );
  });

  app.post('/api/admin/order-requests/:id/reject', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }

    const { rejectionReason } = req.body || {};
    const request = orderRequests.find(r => r.requestId === req.params.id);
    if (!request) {
      return sendJsonError(res, 404, 'Quote request not found', 'ORDER_REQUEST_NOT_FOUND');
    }

    request.approvalStatus = 'rejected';
    request.rejectionReason = rejectionReason || 'Institutional quote guidelines not met.';
    request.updatedAt = new Date().toISOString();

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: request.customerId,
      recipientEmail: request.customerDetails?.email,
      title: `Quote Request Notice: ${request.requestId}`,
      message: `Your quotation request could not be approved: ${request.rejectionReason}.`,
      type: 'approval',
      orderId: request.requestId,
      read: false,
      createdAt: new Date().toISOString()
    });

    return sendJsonSuccess(res, 200, `Quote request ${request.requestId} rejected`, { request });
  });

  app.get('/api/admin/transactions', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }
    res.json(paymentTransactions);
  });

  app.get('/api/admin/admin-users', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, 'Unauthorized. Administrator credentials required.', 'ADMIN_UNAUTHORIZED');
    }
    res.json(adminUsers);
  });

  // Inventory API
  app.get('/api/inventory', (_req, res) => {
    res.json(inventory);
  });

  app.post('/api/inventory/update', (req, res) => {
    const { sku, deltaStock, newMinThreshold, notes } = req.body || {};
    const item = inventory.find(i => i.sku === sku);
    if (!item) {
      return sendJsonError(res, 404, 'SKU not found in inventory', 'SKU_NOT_FOUND');
    }

    if (typeof deltaStock === 'number') {
      item.currentStock = Math.max(0, item.currentStock + deltaStock);
      item.lastRestocked = new Date().toISOString().split('T')[0];
    }
    if (typeof newMinThreshold === 'number') {
      item.minimumThreshold = newMinThreshold;
    }

    if (item.currentStock <= 0) {
      item.status = 'Critical';
    } else if (item.currentStock <= item.minimumThreshold) {
      item.status = 'Low Stock';
    } else {
      item.status = 'In Stock';
    }

    const prod = products.find(p => p.sku === sku);
    if (prod) {
      prod.stock = item.currentStock;
    }

    res.json({ success: true, item, notes });
  });

  // User Progress API
  app.get('/api/user/progress', (_req, res) => {
    res.json(userProgress);
  });

  app.post('/api/user/progress/complete-lesson', (req, res) => {
    const { lessonId, quizScore, courseId, hoursAdded = 1.5 } = req.body || {};

    if (lessonId && !userProgress.completedLessonIds.includes(lessonId)) {
      userProgress.completedLessonIds.push(lessonId);
    }
    if (lessonId && typeof quizScore === 'number') {
      userProgress.quizScores[lessonId] = quizScore;
    }
    userProgress.tinkeringHours += Number(hoursAdded);

    const course = courses.find(c => c.id === courseId);
    if (course) {
      const allDone = course.lessons.every(l => userProgress.completedLessonIds.includes(l.id));
      const alreadyHasCert = userProgress.earnedCertificates.some(c => c.courseId === courseId);

      if (allDone && !alreadyHasCert) {
        userProgress.earnedCertificates.push({
          courseId,
          courseTitle: course.title,
          issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          certificateId: `BALKI-CERT-${Date.now().toString().slice(-6)}`
        });
      }
    }

    res.json(userProgress);
  });

  // B2B ATL Quotations
  app.post('/api/b2b/quote', (req, res) => {
    const { schoolName, contactPerson, email, phone, cityState, studentStrength, packageType, estimatedBudget, notes } = req.body || {};
    if (!schoolName || !contactPerson || !isValidEmail(email)) {
      return sendJsonError(res, 400, 'School name, contact person, and valid email are required.', 'INVALID_B2B_QUOTE');
    }

    const newQuote: ATLQuoteRequest = {
      id: `QUOTE-${Date.now().toString().slice(-5)}`,
      schoolName,
      contactPerson,
      email,
      phone,
      cityState,
      studentStrength: Number(studentStrength) || 50,
      packageType: packageType || 'Comprehensive ATL Lab',
      estimatedBudget: estimatedBudget || '₹3,00,000 - ₹5,00,000',
      notes,
      createdAt: new Date().toISOString()
    };
    quoteRequests.unshift(newQuote);
    res.status(201).json({ success: true, quote: newQuote });
  });

  // Marketing Internship Application API
  app.get('/api/internship/applications', (_req, res) => {
    res.json(internshipApplications);
  });

  app.post('/api/internship/apply', (req, res) => {
    const { fullName, email, phone, location, college, degree, languages, whyBalki, resumeFileName } = req.body || {};
    if (!fullName || !isValidEmail(email) || !phone) {
      return sendJsonError(res, 400, 'Full name, valid email, and phone are mandatory.', 'INVALID_INTERNSHIP_APPLICATION');
    }

    const application: InternshipApplication = {
      id: `APP-2026-${Date.now().toString().slice(-4)}`,
      fullName,
      email,
      phone,
      location: location || 'Remote',
      college: college || 'University',
      degree: degree || 'Graduate',
      languages: languages || 'English, Hindi',
      whyBalki: whyBalki || 'Excited to drive STEM education outreach across 50,000+ ATL labs.',
      resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
      submittedAt: new Date().toISOString()
    };

    internshipApplications.unshift(application);
    res.status(201).json({ success: true, application });
  });

  // Client Reviews API
  app.get('/api/reviews', (_req, res) => {
    res.json(clientReviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { authorName, designation, institution, institutionType, location, productId, productName, rating, headline, reviewText, studentsImpacted } = req.body || {};
    if (!authorName || !institution || !reviewText) {
      return sendJsonError(res, 400, 'Author name, institution and review text are required.', 'INVALID_REVIEW');
    }

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      authorName,
      designation: designation || 'Educator',
      institution,
      institutionType: institutionType || 'Private CBSE/ICSE',
      location: location || 'India',
      productId: productId || 'prod-1',
      productName: productName || 'ATL Master Tinkering Lab Setup Kit',
      rating: Number(rating) || 5,
      date: 'Just now',
      verifiedPurchase: true,
      headline: headline || 'Quality STEM hardware for students',
      reviewText,
      studentsImpacted: Number(studentsImpacted) || 100,
      likesCount: 1,
      badge: 'Verified School Buyer'
    };

    clientReviews.unshift(newRev);
    res.status(201).json(newRev);
  });

  // Case Studies & Blog API
  app.get('/api/case-studies', (_req, res) => {
    res.json(caseStudies);
  });

  app.get('/api/case-studies/:id', (req, res) => {
    const study = caseStudies.find(s => s.id === req.params.id || s.slug === req.params.id);
    if (!study) {
      return sendJsonError(res, 404, 'Case study not found', 'CASE_STUDY_NOT_FOUND');
    }
    res.json(study);
  });

  // Support Tickets API
  app.get('/api/support/tickets', (req, res) => {
    const { status, search } = req.query;
    let filtered = [...supportTickets];

    if (status && typeof status === 'string') {
      filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.institutionName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.post('/api/support/tickets', (req, res) => {
    const { name, role, institutionName, email, phone, category, orderIdOrSku, priority, subject, description } = req.body || {};

    if (!name || !institutionName || !isValidEmail(email) || !description) {
      return sendJsonError(res, 400, 'Name, Institution, valid Email, and Description are required.', 'INVALID_SUPPORT_TICKET');
    }

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      role: role || 'ATL Lab In-Charge',
      institutionName,
      email,
      phone: phone || '+91 9071199139',
      category: category || 'Hardware Defect & 12-Month Replacement',
      orderIdOrSku: orderIdOrSku || 'N/A',
      priority: priority || 'Urgent (Classroom Paused)',
      subject: subject || `${category || 'Problem Resolvance'} - ${institutionName}`,
      description,
      status: 'Open',
      assignedEngineer: 'Balki National Support Desk (Field Tech Routing)',
      slaHours: priority === 'Urgent (Classroom Paused)' ? 4 : 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    supportTickets.unshift(newTicket);
    res.status(201).json(newTicket);
  });

  // 404 Catch-All for unknown /api/* routes (always returns JSON, never HTML/empty)
  app.use('/api', (req, res) => {
    return sendJsonError(
      res,
      404,
      `API endpoint not found: ${req.method} ${req.originalUrl}`,
      'API_ROUTE_NOT_FOUND'
    );
  });

  // Global Express Error Handler for /api/* (e.g. malformed JSON body)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.originalUrl.startsWith('/api')) {
      if (err instanceof SyntaxError && 'body' in err) {
        return sendJsonError(res, 400, 'Malformed JSON request payload.', 'INVALID_JSON_PAYLOAD');
      }
      const safeErr = extractServerErrorMessage(err, 'Unexpected internal server error.');
      logPaymentDiagnostic('unhandled_api_error', { path: req.originalUrl, reason: safeErr });
      return sendJsonError(
        res,
        err?.status || 500,
        safeErr,
        'INTERNAL_SERVER_ERROR'
      );
    }
    return next(err);
  });

  return app;
}

export function getApiApp(): express.Express {
  if (!cachedApiApp) {
    cachedApiApp = createApiApp();
  }
  return cachedApiApp;
}

// SEO Sitemap & Robots helper for Express local server.ts
export function attachSeoRoutes(app: express.Express) {
  app.get('/sitemap.xml', (_req, res) => {
    const sitemapPublic = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapDist = path.join(process.cwd(), 'dist', 'sitemap.xml');
    const target = fs.existsSync(sitemapPublic) ? sitemapPublic : sitemapDist;

    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(target);
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.balkitechnologies.com/</loc>
    <lastmod>2026-11-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  app.get('/robots.txt', (_req, res) => {
    const robotsPublic = path.join(process.cwd(), 'public', 'robots.txt');
    const robotsDist = path.join(process.cwd(), 'dist', 'robots.txt');
    const target = fs.existsSync(robotsPublic) ? robotsPublic : robotsDist;

    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(target);
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`# Robots.txt for BALKI TECHNOLOGIES
User-agent: *
Allow: /
Allow: /assets/
Allow: /products/
Disallow: /api/

Sitemap: https://www.balkitechnologies.com/sitemap.xml\n`);
  });
}
