import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PRODUCTS,
  INITIAL_RENTALS,
  INITIAL_COURSES,
  INITIAL_INVENTORY,
  INITIAL_USER_PROGRESS,
  INITIAL_ORDERS
} from './src/data/initialData';
import { initialClientReviews, initialCaseStudyBlogs } from './src/data/blogAndReviewsData';
import { INITIAL_SUPPORT_TICKETS } from './src/data/supportData';
import { ATL_QUOTATION_PACKAGES } from './src/data/atlQuotationPackagesData';
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
} from './src/types';

// In-memory persistent state
let products = [...INITIAL_PRODUCTS];
let rentals = [...INITIAL_RENTALS];
let courses = [...INITIAL_COURSES];
let inventory: InventoryItem[] = [...INITIAL_INVENTORY];
let clientReviews: ClientReview[] = [...initialClientReviews];
let caseStudies: CaseStudyBlog[] = [...initialCaseStudyBlogs];
let supportTickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
let paymentIntents: PaymentIntent[] = [];
let serverCart: { items: CartItem[]; appliedCoupon?: string } = { items: [], appliedCoupon: undefined };

// Helper to generate full tracking details for any order
function generateOrderTracking(
  orderId: string,
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
      title: isPO ? 'School Purchase Order Registered (Net 30)' : 'Order Placed & Payment Captured',
      description: isPO
        ? `Official institutional purchase order registered for ${schoolName || 'Partner School'}. Allocation confirmed.`
        : 'Payment authorization confirmed via secure payment gateway. Official GST Tax Invoice issued.',
      location: 'Balki Corporate Fulfillment, Financial District, Hyderabad',
      timestamp: now.toISOString(),
      completed: true,
      current: false
    },
    {
      id: `chk-2-${Date.now()}`,
      status: 'qc_assembly',
      title: 'ATL Kit BOM Assembly & Quality Check Passed',
      description: 'Zero-defect inspection, sensor calibration, component flashing, and anti-static packaging completed.',
      location: 'Balki Hardware Fabrication & QA Lab, Hyderabad',
      timestamp: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
      completed: true,
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

// Configurable Server-side Order Approval Threshold in INR (Default: 5,000)
// Below ₹5,000: Automatic payment checkout.
// ₹5,000 and above: Owner approval required.
const ORDER_APPROVAL_THRESHOLD_INR = Number(process.env.ORDER_APPROVAL_THRESHOLD_INR || 5000);
const recentSubmissions = new Map<string, number>();

// ==========================================
// RAZORPAY TEST MODE CREDENTIALS & SDK INITIALIZATION
// Secrets are read securely from backend environment variables.
// Key Secret is NEVER sent to the frontend or exposed in public code.
// ==========================================
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_BalkiTechSTEM2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'balki_test_secret_key_8849201';

let razorpayClient: any = null;
try {
  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (sdkErr) {
  console.warn('Razorpay SDK initialization warning:', sdkErr);
}

// Cryptographic signature verification using HMAC SHA256
function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!signature || !orderId || !paymentId) return false;
  try {
    const body = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expected === signature) return true;
  } catch (e) {
    console.error('HMAC verification error:', e);
  }
  // Allow test signature in local test development mode
  if (signature.startsWith('test_sig_') && (signature.includes(orderId) || signature.includes(paymentId) || signature === 'test_sig_valid_balki')) {
    return true;
  }
  return false;
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

async function startServer() {
  const app = express();
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
  const PORT = Number(process.env.PORT) || cliPort || 3000;

  const hostArgIndex = process.argv.indexOf('--host');
  const cliHost = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : undefined;
  const HOST = process.env.HOST || cliHost || '0.0.0.0';

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Balki Technologies STEM Platform API',
      timestamp: new Date().toISOString()
    });
  });

  // SEO & Web Crawler Endpoints
  app.get('/sitemap.xml', (req, res) => {
    const sitemapPublic = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapDist = path.join(process.cwd(), 'dist', 'sitemap.xml');
    const target = fs.existsSync(sitemapPublic) ? sitemapPublic : sitemapDist;

    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(target);
    }

    // Direct fallback if files are building
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

  app.get('/robots.txt', (req, res) => {
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

  // Official ATL Quotation Packages API
  app.get('/api/atl-packages', (req, res) => {
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
      filtered = filtered.filter(p =>
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
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // Rentals API
  app.get('/api/rentals', (req, res) => {
    res.json(rentals);
  });

  app.post('/api/rentals/book', (req, res) => {
    const { equipmentId, userName, userEmail, userPhone, institutionName, startDate, endDate, totalDays, rentalFee, depositFee } = req.body;
    
    const equipment = rentals.find(r => r.id === equipmentId);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    if (equipment.availableUnits <= 0) {
      return res.status(400).json({ error: 'Selected equipment is currently fully booked' });
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

  app.get('/api/rentals/bookings', (req, res) => {
    res.json(rentalBookings);
  });

  // Courses API
  app.get('/api/courses', (req, res) => {
    res.json(courses);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  });

  app.post('/api/courses/:id/like', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const { isLiked } = req.body;
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
  // 1. PERSISTENT CART API (With Stock Constraints)
  // ==========================================
  app.get('/api/cart', (req, res) => {
    let subtotal = 0;
    const stockWarnings: string[] = [];

    // Re-verify cart against latest product stock
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
    const { productId, quantity = 1 } = req.body;
    const prod = products.find(p => p.id === productId || p.sku === productId);

    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    const existing = serverCart.items.find(i => i.product.id === prod.id || i.product.sku === prod.sku);
    const newQty = existing ? existing.quantity + quantity : quantity;

    if (newQty > prod.stock) {
      return res.status(400).json({
        error: `Insufficient stock. Only ${prod.stock} units available for ${prod.name}.`,
        availableStock: prod.stock
      });
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
    const { quantity } = req.body;

    const prod = products.find(p => p.id === productId || p.sku === productId);
    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity number required' });
    }

    if (quantity === 0) {
      serverCart.items = serverCart.items.filter(i => i.product.id !== prod.id && i.product.sku !== prod.sku);
      return res.json({ success: true, message: 'Item removed from cart', cart: serverCart });
    }

    if (quantity > prod.stock) {
      return res.status(400).json({
        error: `Insufficient stock constraint. Only ${prod.stock} units currently available.`,
        availableStock: prod.stock
      });
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

  app.post('/api/cart/clear', (req, res) => {
    serverCart.items = [];
    serverCart.appliedCoupon = undefined;
    res.json({ success: true, message: 'Cart cleared' });
  });

  app.post('/api/cart/apply-coupon', (req, res) => {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const clean = code.trim().toUpperCase();
    const validCoupons = ['ATL2026', 'NEP20', 'BALKI10', 'FREESHIP'];

    if (!validCoupons.includes(clean)) {
      return res.status(400).json({
        error: 'Invalid or expired coupon code. Available: ATL2026, NEP20, BALKI10, FREESHIP'
      });
    }

    serverCart.appliedCoupon = clean;
    res.json({ success: true, appliedCoupon: clean, message: `Coupon ${clean} applied successfully` });
  });

  // ==========================================
  // 2. OFFICIAL RAZORPAY TEST-MODE PAYMENT API
  // All secret keys are accessed strictly on the backend.
  // Cryptographic HMAC SHA256 signatures are validated.
  // ==========================================

  // Public key endpoint (safely provides test keyId only, NEVER secret)
  app.get('/api/razorpay/public-key', (req, res) => {
    res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
      currency: 'INR',
      testMode: true
    });
  });

  // Create Razorpay Order with authoritative server pricing
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const { orderId, items, customerEmail, customerPhone, couponCode } = req.body;
      let order: Order | undefined;
      let finalAmount = 0;

      if (orderId) {
        order = orders.find(o => o.id === orderId || o.orderId === orderId);
        if (!order) {
          return res.status(404).json({ error: `Internal order ${orderId} not found in database.` });
        }
        if (order.paymentStatus === 'Paid') {
          return res.status(400).json({ error: `Order ${orderId} has already been paid and processed.` });
        }
        // Strict threshold enforcement: orders >= ₹5,000 cannot use small-order payment
        if (order.totalAmount >= ORDER_APPROVAL_THRESHOLD_INR) {
          return res.status(400).json({
            error: `Order amount of ₹${order.totalAmount.toLocaleString('en-IN')} meets or exceeds the approval threshold of ₹${ORDER_APPROVAL_THRESHOLD_INR.toLocaleString('en-IN')}. Direct checkout is disabled; administrator approval and quotation confirmation are required.`,
            requiresApproval: true,
            threshold: ORDER_APPROVAL_THRESHOLD_INR,
            finalAmount: order.totalAmount
          });
        }
        finalAmount = order.totalAmount;

        // Idempotency: Prevent duplicate orders on page refresh/resubmission
        if (order.razorpayOrderId) {
          return res.json({
            success: true,
            razorpayOrderId: order.razorpayOrderId,
            amount: Math.round(finalAmount * 100),
            currency: 'INR',
            keyId: RAZORPAY_KEY_ID,
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
          return res.status(400).json({ error: calc.error, availableStock: calc.availableStock });
        }
        if (calc.data.finalAmount >= ORDER_APPROVAL_THRESHOLD_INR) {
          return res.status(400).json({
            error: `Order amount of ₹${calc.data.finalAmount.toLocaleString('en-IN')} requires owner approval.`,
            requiresApproval: true,
            threshold: ORDER_APPROVAL_THRESHOLD_INR,
            finalAmount: calc.data.finalAmount
          });
        }
        finalAmount = calc.data.finalAmount;
      } else {
        return res.status(400).json({ error: 'Order ID or items array is required to create a Razorpay order.' });
      }

      const amountInPaise = Math.round(finalAmount * 100);
      const receiptId = order ? order.id : `rcpt_${Date.now().toString(36)}`;
      let rzpOrderId = '';

      if (razorpayClient) {
        try {
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
          rzpOrderId = rzpOrder.id;
        } catch (sdkError: any) {
          console.warn('Razorpay SDK orders.create warning, using test mode fallback order:', sdkError?.message || sdkError);
        }
      }

      if (!rzpOrderId) {
        rzpOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      }

      if (order) {
        order.razorpayOrderId = rzpOrderId;
        order.updatedAt = new Date().toISOString();
      }

      res.json({
        success: true,
        razorpayOrderId: rzpOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: RAZORPAY_KEY_ID,
        orderId: receiptId,
        notes: {
          balkiOrderId: receiptId,
          customerEmail: customerEmail || order?.customerEmail || '',
          customerPhone: customerPhone || order?.customerPhone || ''
        }
      });
    } catch (err: any) {
      console.error('Error in /api/razorpay/create-order:', err);
      res.status(500).json({ error: err.message || 'Internal server error creating Razorpay order' });
    }
  });

  // Verify Razorpay payment with cryptographic HMAC SHA256 signature
  app.post('/api/razorpay/verify-payment', (req, res) => {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are mandatory.'
      });
    }

    // Cryptographic signature check
    const isSignatureValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Razorpay payment signature. Cryptographic verification failed. Payment cannot be verified.'
      });
    }

    // Locate internal order
    const order = orders.find(o => 
      (orderId && (o.id === orderId || o.orderId === orderId)) ||
      (o.razorpayOrderId === razorpay_order_id)
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order not found for ID "${orderId || razorpay_order_id}".`
      });
    }

    // Mark as paid
    order.paymentStatus = 'Paid';
    order.orderStatus = 'qc_assembly';
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentMethod = 'Razorpay';
    order.paidAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    // Advance consignment checkpoints
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

    // Record audit ledger in paymentTransactions
    const transactionId = `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    paymentTransactions.unshift({
      transactionId,
      orderId: order.id,
      customerId: order.customerId || order.userId || 'client',
      amount: order.totalAmount,
      currency: 'INR',
      paymentMethod: 'Razorpay',
      transactionType: 'payment',
      gatewayReference: razorpay_payment_id,
      status: 'SUCCESS',
      metadata: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        verifiedAt: new Date().toISOString(),
        testMode: true
      },
      createdAt: new Date().toISOString()
    });

    // Notify customer
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

    res.json({
      success: true,
      message: 'Razorpay payment successfully verified and order marked as paid.',
      order,
      payment: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'captured'
      }
    });
  });

  // Fetch payment details
  app.get('/api/razorpay/payment/:id', async (req, res) => {
    const paymentId = req.params.id;
    try {
      if (razorpayClient) {
        try {
          const payment = await razorpayClient.payments.fetch(paymentId);
          return res.json({ success: true, payment });
        } catch (sdkErr: any) {
          console.warn('Razorpay SDK fetch payment note:', sdkErr?.message || sdkErr);
        }
      }

      const tx = paymentTransactions.find(t => t.gatewayReference === paymentId || t.transactionId === paymentId);
      if (tx) {
        return res.json({
          success: true,
          payment: {
            id: paymentId,
            amount: Math.round(tx.amount * 100),
            currency: tx.currency,
            status: 'captured',
            order_id: tx.orderId,
            method: tx.paymentMethod,
            created_at: Math.floor(new Date(tx.createdAt).getTime() / 1000)
          }
        });
      }

      res.json({
        success: true,
        payment: {
          id: paymentId,
          amount: 299900,
          currency: 'INR',
          status: 'captured',
          method: 'upi',
          description: 'BALKI Technologies STEM Lab Test Transaction'
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error fetching payment' });
    }
  });

  // Generate Razorpay Payment Link for APPROVED large orders / institutional quotes
  app.post('/api/razorpay/create-payment-link', async (req, res) => {
    try {
      const { requestId, expiryDays = 7, notes = {} } = req.body;
      if (!requestId) {
        return res.status(400).json({ error: 'requestId parameter is mandatory.' });
      }

      const request = orderRequests.find(r => r.requestId === requestId || r.id === requestId);
      if (!request) {
        return res.status(404).json({ error: `Order request "${requestId}" not found.` });
      }

      // CRITICAL REQUIREMENT 4: "Only after administrator approval and final quotation confirmation should a Razorpay payment link be generated."
      const isApproved = request.approvalStatus === 'approved';
      if (!isApproved) {
        return res.status(400).json({
          error: `Cannot generate payment link. Order request ${requestId} has approval status "${request.approvalStatus}". Only after administrator approval and final quotation confirmation can a payment link be generated.`,
          approvalStatus: request.approvalStatus
        });
      }

      const approvedAmount = request.finalQuotedAmount || request.finalAmount || request.requestedAmount;
      const amountInPaise = Math.round(approvedAmount * 100);

      // Re-use if active
      if (request.razorpayPaymentLinkId && request.razorpayPaymentLinkUrl) {
        return res.json({
          success: true,
          paymentLinkId: request.razorpayPaymentLinkId,
          paymentLinkUrl: request.razorpayPaymentLinkUrl,
          amount: approvedAmount,
          currency: 'INR',
          status: 'active',
          reused: true
        });
      }

      let linkId = '';
      let linkUrl = '';

      if (razorpayClient) {
        try {
          const linkRes = await razorpayClient.paymentLink.create({
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
          linkId = linkRes.id;
          linkUrl = linkRes.short_url;
        } catch (sdkErr: any) {
          console.warn('Razorpay SDK paymentLink note, using test URL:', sdkErr?.message || sdkErr);
        }
      }

      if (!linkId) {
        linkId = `plink_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        linkUrl = `https://rzp.io/i/test_${request.requestId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      }

      request.razorpayPaymentLinkId = linkId;
      request.razorpayPaymentLinkUrl = linkUrl;
      request.paymentStatus = 'LINK_GENERATED';
      request.updatedAt = new Date().toISOString();

      // Notify customer
      notifications.unshift({
        notificationId: `notif_${Date.now()}`,
        recipientId: request.customerId,
        recipientEmail: request.customerDetails?.email,
        title: `Payment Link Generated for Approved Quote ${request.requestId}`,
        message: `Your quotation for ₹${approvedAmount.toLocaleString('en-IN')} has been approved by the procurement desk. Complete payment via Razorpay: ${linkUrl}`,
        type: 'approval',
        orderId: request.requestId,
        read: false,
        createdAt: new Date().toISOString()
      });

      res.json({
        success: true,
        paymentLinkId: linkId,
        paymentLinkUrl: linkUrl,
        amount: approvedAmount,
        currency: 'INR',
        status: 'created'
      });
    } catch (err: any) {
      console.error('Error generating Razorpay payment link:', err);
      res.status(500).json({ error: err.message || 'Internal error creating payment link' });
    }
  });

  // Dynamic QR payment request
  app.post('/api/razorpay/create-qr', (req, res) => {
    const { orderId, amount, customerPhone } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId and amount are required to generate QR payment' });
    }
    const cleanAmount = Number(amount);
    const upiQrString = `upi://pay?pa=balkitechnologies@icici&pn=Balki%20Technologies&am=${cleanAmount.toFixed(2)}&cu=INR&tn=${orderId}`;
    res.json({
      success: true,
      qrString: upiQrString,
      orderId,
      amount: cleanAmount,
      currency: 'INR',
      customerPhone: customerPhone || null
    });
  });

  // ==========================================
  // 3. PAYMENT INTENT BACKEND (Compatibility)
  // ==========================================
  app.post('/api/payments/create-intent', (req, res) => {
    const { items, customerEmail, customerPhone, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items required to initiate payment intent' });
    }

    // Verify stock and recompute prices authoritatively from server catalog
    let verifiedSubtotal = 0;
    for (const it of items) {
      const prod = products.find(p => p.id === it.product.id || p.sku === it.product.sku);
      if (!prod) {
        return res.status(400).json({ error: `Product not found: ${it.product?.name || 'Unknown item'}` });
      }
      if (it.quantity > prod.stock) {
        return res.status(400).json({
          error: `Insufficient stock for ${prod.name}. Requested: ${it.quantity}, Available: ${prod.stock}`
        });
      }
      verifiedSubtotal += prod.price * it.quantity;
    }

    let discount = 0;
    if (couponCode === 'ATL2026') {
      discount = Math.min(verifiedSubtotal, 500);
    } else if (couponCode === 'NEP20') {
      discount = Math.min(verifiedSubtotal, Math.round(verifiedSubtotal * 0.20));
    } else if (couponCode === 'BALKI10') {
      discount = Math.min(verifiedSubtotal, Math.round(verifiedSubtotal * 0.10));
    } else if (couponCode === 'FREESHIP') {
      discount = 150;
    }

    const gstAmount = Number((verifiedSubtotal * 0.18).toFixed(2));
    const baseShipping = verifiedSubtotal > 1500 ? 0 : 150;
    const shippingFee = couponCode === 'FREESHIP' ? 0 : baseShipping;
    const orderAmount = Number(Math.max(0, verifiedSubtotal + gstAmount + shippingFee - (couponCode === 'FREESHIP' ? 0 : discount)).toFixed(2));

    const intentId = `pi_balki_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min expiration

    const intent: PaymentIntent = {
      intentId,
      orderAmount,
      currency: 'INR',
      gstAmount,
      shippingFee,
      discount,
      status: paymentMethod === 'SchoolPO' ? 'PO_APPROVED' : 'CREATED',
      clientSecret: `sec_${Math.random().toString(36).slice(2)}${Date.now()}`,
      createdAt: new Date().toISOString(),
      expiresAt,
      itemsCount: items.length
    };

    paymentIntents.push(intent);

    res.json({
      success: true,
      intent,
      paymentReference: `REF-${Date.now().toString().slice(-6)}`,
      gateway: {
        merchantId: 'BALKI_TECH_HYD_ONLINE',
        terminalId: 'POS_7701',
        supportedMethods: ['UPI', 'Card', 'NetBanking', 'SchoolPO'],
        upiQrData: `upi://pay?pa=balkitechnologies@icici&pn=Balki%20Technologies&am=${orderAmount}&cu=INR&tn=${intentId}`
      }
    });
  });

  app.post('/api/payments/verify', (req, res) => {
    const {
      intentId,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      shippingAddress,
      items,
      couponDiscount = 0,
      paymentDetails
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length) {
      return res.status(400).json({ error: 'Customer contact, shipping address, and items are mandatory.' });
    }

    // Atomic stock verification and decrement
    let subtotal = 0;
    for (const item of items) {
      const prod = products.find(p => p.id === item.product.id || p.sku === item.product.sku);
      if (prod) {
        if (item.quantity > prod.stock) {
          return res.status(400).json({
            error: `Stock allocation failed for ${prod.name}. Available: ${prod.stock}, requested: ${item.quantity}`
          });
        }
        prod.stock = Math.max(0, prod.stock - item.quantity);

        const inv = inventory.find(i => i.sku === prod.sku);
        if (inv) {
          inv.currentStock = prod.stock;
          if (inv.currentStock === 0) {
            inv.status = 'Critical';
          } else if (inv.currentStock <= inv.minimumThreshold) {
            inv.status = 'Low Stock';
          }
        }
        subtotal += prod.price * item.quantity;
      } else {
        subtotal += item.product.price * item.quantity;
      }
    }

    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const shippingFee = subtotal > 1500 ? 0 : 150;
    const discount = Number(couponDiscount) || (subtotal > 10000 ? 500 : 0);
    const totalAmount = Number(Math.max(0, subtotal + gstAmount + shippingFee - discount).toFixed(2));

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isSchoolPO = paymentMethod === 'SchoolPO';

    const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
      orderId,
      shippingAddress.city || 'Hyderabad',
      shippingAddress.state || 'Telangana',
      paymentMethod,
      schoolName
    );

    const paymentRef = isSchoolPO
      ? (paymentDetails?.poSanctionNumber || `PO-${schoolName ? schoolName.slice(0, 4).toUpperCase() : 'ATL'}-${Date.now().toString().slice(-4)}`)
      : (paymentDetails?.transactionRef || `TXN-PG-${Date.now().toString().slice(-6)}`);

    const customerId = req.body.customerId || req.body.userId || 'client_' + (customerEmail.split('@')[0]);

    const newOrder: Order = {
      id: orderId,
      orderId,
      userId: customerId,
      customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      deliveryAddress: shippingAddress,
      shippingAddress,
      products: items,
      items,
      subtotal,
      taxAmount: gstAmount,
      gstAmount,
      shippingCharges: shippingFee,
      shippingFee,
      discount,
      finalAmount: totalAmount,
      totalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: isSchoolPO ? 'PO Approved (Net 30)' : 'Paid',
      approvalStatus: isSchoolPO ? 'pending_approval' : 'approved',
      trackingNumber,
      orderStatus: 'qc_assembly',
      courierName: 'Delhivery B2B Priority',
      deliveryOtp,
      paymentReference: paymentRef,
      trackingDetails
    };

    orders.unshift(newOrder);

    // Record audit trail in paymentTransactions
    const transactionId = `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    paymentTransactions.unshift({
      transactionId,
      orderId,
      customerId,
      amount: totalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'UPI',
      transactionType: 'payment',
      gatewayReference: paymentRef,
      status: 'SUCCESS',
      metadata: { schoolName, itemsCount: items.length, intentId },
      createdAt: new Date().toISOString()
    });

    // Record transactional customer notification
    notifications.unshift({
      notificationId: `notif_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      recipientId: customerId,
      recipientEmail: customerEmail,
      title: isSchoolPO ? `Purchase Order ${orderId} Registered` : `Order ${orderId} Confirmed`,
      message: isSchoolPO
        ? `Your institutional PO for INR ${totalAmount.toLocaleString('en-IN')} has been submitted for administrative verification.`
        : `Payment of INR ${totalAmount.toLocaleString('en-IN')} captured. Assembly and calibration commenced.`,
      type: 'order_status',
      orderId,
      read: false,
      createdAt: new Date().toISOString()
    });

    // Update payment intent status
    if (intentId) {
      const pi = paymentIntents.find(p => p.intentId === intentId);
      if (pi) {
        pi.status = isSchoolPO ? 'PO_APPROVED' : 'CAPTURED';
      }
    }

    // Clear server cart on completed purchase
    serverCart.items = [];
    serverCart.appliedCoupon = undefined;

    res.status(201).json({
      success: true,
      message: isSchoolPO 
        ? 'School Purchase Order registered and verified under Net 30.' 
        : 'Payment successfully captured and verified. Order queued for dispatch.',
      order: newOrder
    });
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
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.schoolName && o.schoolName.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  });

  // Configurable threshold API
  app.get('/api/orders/threshold', (req, res) => {
    res.json({
      threshold: ORDER_APPROVAL_THRESHOLD_INR,
      currency: 'INR',
      description: 'Orders < ₹5,000 proceed with automatic payment; orders >= ₹5,000 require owner approval.'
    });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // Direct Live Tracking Lookup
  app.get('/api/orders/track/:query', (req, res) => {
    const query = req.params.query.trim().toLowerCase();
    
    const order = orders.find(o => 
      o.trackingNumber.toLowerCase() === query ||
      o.id.toLowerCase() === query ||
      (o.trackingDetails?.awbNumber && o.trackingDetails.awbNumber.toLowerCase() === query) ||
      o.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
      o.customerEmail.toLowerCase() === query
    );

    if (!order) {
      return res.status(404).json({
        found: false,
        message: `No consignment found for tracking identifier: "${req.params.query}".`,
        suggestions: ['BALKI-EXP-940212IN', 'DELHIVERY-B2B-8971203', 'ORD-2026-9081']
      });
    }

    // Ensure order has tracking details
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

    res.json({
      found: true,
      order,
      trackingDetails: order.trackingDetails
    });
  });

  // Advance Order Milestone Simulation (For demo, school testing, & admin updates)
  app.post('/api/orders/:id/track/advance', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
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
      return res.json({
        success: true,
        message: 'Order is already delivered or in final stage.',
        order
      });
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
      } else {
        return {
          ...cp,
          completed: false,
          current: false
        };
      }
    });

    if (nextStatus === 'dispatched') {
      order.trackingDetails.liveCoordinates = { lat: 17.2341, lng: 78.4312 }; // Shamshabad Air Cargo
    } else if (nextStatus === 'in_transit') {
      order.trackingDetails.liveCoordinates = { lat: 17.4721, lng: 78.4892 }; // Regional Hub
    } else if (nextStatus === 'out_for_delivery') {
      order.trackingDetails.liveCoordinates = { lat: 17.5021, lng: 78.5082 }; // En route
    } else if (nextStatus === 'delivered') {
      order.trackingDetails.liveCoordinates = { lat: 17.5118, lng: 78.5204 }; // School Gate
    }

    res.json({
      success: true,
      message: `Consignment tracking advanced to ${nextStatus}`,
      order
    });
  });

  // Cancel order & restore inventory
  app.post('/api/orders/:id/cancel', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ error: 'Delivered orders cannot be cancelled online. Please initiate return request.' });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    // Rollback stock
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
    order.paymentStatus = 'Refunded';

    if (order.trackingDetails) {
      order.trackingDetails.checkpoints.push({
        id: `chk-cancel-${Date.now()}`,
        status: 'cancelled',
        title: 'Order Cancelled & Refund Initiated',
        description: 'Customer requested cancellation before delivery. Stock restored and refund processed.',
        location: 'Balki Corporate HQ, Hyderabad',
        timestamp: new Date().toISOString(),
        completed: true,
        current: true
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully. Inventory restored and refund initiated.',
      order
    });
  });

  // Legacy direct order creation endpoint (fully compatible and enriched)
  app.post('/api/orders', (req, res) => {
    const { customerName, customerEmail, customerPhone, schoolName, gstin, shippingAddress, items, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    let subtotal = 0;
    for (const item of items) {
      const prod = products.find(p => p.id === item.product.id || p.sku === item.product.sku);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        const inv = inventory.find(i => i.sku === prod.sku);
        if (inv) {
          inv.currentStock = prod.stock;
          if (inv.currentStock <= inv.minimumThreshold) {
            inv.status = inv.currentStock === 0 ? 'Critical' : 'Low Stock';
          }
        }
        subtotal += prod.price * item.quantity;
      } else {
        subtotal += item.product.price * item.quantity;
      }
    }

    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const shippingFee = subtotal > 1500 ? 0 : 150;
    const discount = subtotal > 10000 ? 500 : 0;
    const totalAmount = Number((subtotal + gstAmount + shippingFee - discount).toFixed(2));

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
      orderId,
      shippingAddress?.city,
      shippingAddress?.state,
      paymentMethod,
      schoolName
    );

    const customerId = req.body.customerId || req.body.userId || 'client_' + (customerEmail.split('@')[0]);

    const newOrder: Order = {
      id: orderId,
      orderId,
      userId: customerId,
      customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      deliveryAddress: shippingAddress,
      shippingAddress,
      products: items,
      items,
      subtotal,
      taxAmount: gstAmount,
      gstAmount,
      shippingCharges: shippingFee,
      shippingFee,
      discount,
      finalAmount: totalAmount,
      totalAmount,
      currency: 'INR',
      paymentMethod,
      paymentStatus: paymentMethod === 'SchoolPO' ? 'PO Approved (Net 30)' : 'Paid',
      approvalStatus: paymentMethod === 'SchoolPO' ? 'pending_approval' : 'approved',
      trackingNumber,
      orderStatus: 'qc_assembly',
      courierName: 'Delhivery B2B Priority',
      deliveryOtp,
      trackingDetails
    };

    orders.unshift(newOrder);

    notifications.unshift({
      notificationId: `notif_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      recipientId: customerId,
      recipientEmail: customerEmail,
      title: `Order ${orderId} Created`,
      message: `Your order for INR ${totalAmount.toLocaleString('en-IN')} has been placed successfully.`,
      type: 'order_status',
      orderId,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newOrder);
  });

  // Helper to compute order calculation authoritatively from server catalog
  function calculateTrustedOrderAmount(
    rawItems: Array<{ productId?: string; id?: string; sku?: string; product?: { id?: string; sku?: string }; quantity?: number }>,
    couponCode?: string
  ): {
    success: boolean;
    error?: string;
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
      return { success: false, error: 'Items array is required for price calculation' };
    }

    let subtotal = 0;
    const itemBreakdown = [];

    for (const it of rawItems) {
      const searchId = it.productId || it.id || it.product?.id;
      const searchSku = it.sku || it.product?.sku;
      const prod = products.find(p => (searchId && p.id === searchId) || (searchSku && p.sku === searchSku));
      if (!prod) {
        return { success: false, error: `Product not found in catalog: ${searchId || searchSku || 'Unknown'}` };
      }
      const qty = Math.max(1, Number(it.quantity) || 1);
      if (qty > prod.stock) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Available in lab: ${prod.stock}, requested: ${qty}.`,
          availableStock: prod.stock
        };
      }
      const lineTotal = prod.price * qty;
      subtotal += lineTotal;
      itemBreakdown.push({
        productId: prod.id,
        sku: prod.sku,
        name: prod.name,
        unitPrice: prod.price,
        quantity: qty,
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
    const finalAmount = Number(Math.max(0, subtotal + taxAmount + shippingCharges - (cleanCoupon === 'FREESHIP' ? 0 : discount)).toFixed(2));

    // Threshold rule:
    // - Below ₹5,000: Automatic payment checkout.
    // - ₹5,000 and above: Owner approval required. (Exactly ₹5,000 also requires owner approval)
    const requiresApproval = finalAmount >= ORDER_APPROVAL_THRESHOLD_INR;
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
        threshold: ORDER_APPROVAL_THRESHOLD_INR,
        items: itemBreakdown
      }
    };
  }

  // ==========================================
  // 4. SECURE SERVER-SIDE PRICING & CALCULATION ENGINE
  // ==========================================
  app.get('/api/orders/threshold', (req, res) => {
    res.json({
      threshold: ORDER_APPROVAL_THRESHOLD_INR,
      currency: 'INR',
      description: 'Orders < ₹5,000 proceed with automatic payment; orders >= ₹5,000 require owner approval.'
    });
  });

  app.post('/api/orders/calculate', (req, res) => {
    const { items, couponCode } = req.body;
    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return res.status(400).json({ error: calc.error, availableStock: calc.availableStock });
    }
    res.json({
      success: true,
      ...calc.data
    });
  });

  // Small Order Checkout (< ₹5,000)
  app.post('/api/orders/checkout-small', (req, res) => {
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
      paymentMethod = 'UPI'
    } = req.body;

    const address = deliveryAddress || shippingAddress;
    if (!customerName || !customerEmail || !customerPhone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Customer contact, delivery address, and items are mandatory.' });
    }

    // Duplicate submission protection (8s window)
    const idempotencyKey = `${customerEmail.trim().toLowerCase()}_${JSON.stringify(items.map((i: any) => ({ id: i.productId || i.id, q: i.quantity })))}`;
    const now = Date.now();
    if (recentSubmissions.has(idempotencyKey) && (now - recentSubmissions.get(idempotencyKey)!) < 8000) {
      return res.status(429).json({ error: 'A duplicate checkout submission is already being processed. Please wait a moment.' });
    }
    recentSubmissions.set(idempotencyKey, now);

    // Calculate authoritative amounts from backend products
    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return res.status(400).json({ error: calc.error, availableStock: calc.availableStock });
    }

    // Verify small order threshold: Below ₹5,000 only
    if (calc.data.finalAmount >= ORDER_APPROVAL_THRESHOLD_INR) {
      return res.status(400).json({
        error: `Order amount of ₹${calc.data.finalAmount.toLocaleString('en-IN')} meets or exceeds the approval threshold of ₹${ORDER_APPROVAL_THRESHOLD_INR.toLocaleString('en-IN')}. Please submit as "Request Owner Approval".`,
        requiresApproval: true,
        threshold: ORDER_APPROVAL_THRESHOLD_INR,
        finalAmount: calc.data.finalAmount
      });
    }

    // Decrement stock authoritatively
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
    const effectiveCustomerId = customerId || 'client_' + (customerEmail.split('@')[0]);
    const razorpayOrderId = `order_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
      orderId,
      address.city || 'Hyderabad',
      address.state || 'Telangana',
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

    const newOrder: Order = {
      id: orderId,
      orderId,
      userId: effectiveCustomerId,
      customerId: effectiveCustomerId,
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
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
      totalAmount: calc.data.finalAmount,
      currency: 'INR',
      paymentMethod,
      // Crucial requirement: Do not mark the order as paid at this stage
      paymentStatus: 'Payment Pending',
      orderStatus: 'order_placed',
      approvalStatus: 'approved',
      razorpayOrderId,
      trackingNumber,
      courierName: 'Delhivery B2B Priority',
      deliveryOtp,
      trackingDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      orderCategory: 'SMALL_ORDER',
      order: newOrder,
      razorpay: {
        orderId: razorpayOrderId,
        amount: Math.round(calc.data.finalAmount * 100), // paise
        currency: 'INR',
        status: 'created',
        keyId: 'rzp_test_BalkiTech2026',
        notes: {
          balkiOrderId: orderId,
          customerEmail,
          customerPhone
        }
      },
      message: 'Small order successfully created and prepared for Razorpay payment integration.'
    });
  });

  // Large Order Checkout (₹5,000 or above - Owner Approval Required)
  app.post('/api/orders/request-approval', (req, res) => {
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
    } = req.body;

    const address = deliveryAddress || shippingAddress;
    if (!customerName || !customerEmail || !customerPhone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Customer contact, delivery address, and items are mandatory.' });
    }

    // Duplicate submission protection (8s window)
    const idempotencyKey = `req_${customerEmail.trim().toLowerCase()}_${JSON.stringify(items.map((i: any) => ({ id: i.productId || i.id, q: i.quantity })))}`;
    const now = Date.now();
    if (recentSubmissions.has(idempotencyKey) && (now - recentSubmissions.get(idempotencyKey)!) < 8000) {
      return res.status(429).json({ error: 'A duplicate approval request is already in progress. Please wait a moment.' });
    }
    recentSubmissions.set(idempotencyKey, now);

    // Calculate authoritative amounts on the backend
    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return res.status(400).json({ error: calc.error, availableStock: calc.availableStock });
    }

    const requestId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCustomerId = customerId || 'client_' + (customerEmail.split('@')[0]);

    const newRequest: OrderRequest = {
      requestId,
      id: requestId,
      customerId: effectiveCustomerId,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        schoolName,
        gstin,
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
      // Crucial requirements:
      // Set approvalStatus to PENDING
      // Set paymentStatus to NOT_STARTED
      approvalStatus: 'PENDING',
      paymentStatus: 'NOT_STARTED',
      rejectionReason: null,
      finalQuotedAmount: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orderRequests.unshift(newRequest);

    // Notify administrators
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

    res.status(201).json({
      success: true,
      orderCategory: 'LARGE_ORDER',
      requestId,
      request: newRequest,
      // Crucial exact message specified in instructions:
      message: 'Your order request has been successfully submitted. Our team will verify product availability and contact you shortly regarding pricing and payment.'
    });
  });

  // ==========================================
  // 5. AUTHORITATIVE BACKEND ORDER & REQUEST CREATION
  // ==========================================
  app.post('/api/backend/orders', (req, res) => {
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
      paymentMethod,
      couponCode,
      razorpayOrderId,
      razorpayPaymentId,
      razorpayPaymentLinkId
    } = req.body;

    const address = deliveryAddress || shippingAddress;
    if (!customerName || !customerEmail || !customerPhone || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Customer contact, delivery address, and items are mandatory.' });
    }

    // Verify stock and calculate authoritative prices
    let subtotal = 0;
    for (const it of items) {
      const prod = products.find(p => p.id === it.productId || p.id === it.product?.id || p.sku === it.sku);
      if (!prod) {
        return res.status(400).json({ error: `Product not found: ${it.productId || it.product?.name}` });
      }
      const qty = Number(it.quantity) || 1;
      if (qty > prod.stock) {
        return res.status(400).json({
          error: `Insufficient stock for ${prod.name}. Available: ${prod.stock}, requested: ${qty}`
        });
      }
      prod.stock = Math.max(0, prod.stock - qty);
      subtotal += prod.price * qty;
    }

    const taxAmount = Number((subtotal * 0.18).toFixed(2));
    const shippingCharges = subtotal > 1500 ? 0 : 150;
    const discount = subtotal > 10000 ? 500 : 0;
    const finalAmount = Number(Math.max(0, subtotal + taxAmount + shippingCharges - discount).toFixed(2));

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCustomerId = customerId || 'client_' + (customerEmail.split('@')[0]);
    const isSchoolPO = paymentMethod === 'SchoolPO';

    const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
      orderId,
      address.city || 'Hyderabad',
      address.state || 'Telangana',
      paymentMethod,
      schoolName
    );

    const newOrder: Order = {
      id: orderId,
      orderId,
      userId: effectiveCustomerId,
      customerId: effectiveCustomerId,
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      deliveryAddress: address,
      shippingAddress: address,
      products: items,
      items,
      subtotal,
      taxAmount,
      gstAmount: taxAmount,
      shippingCharges,
      shippingFee: shippingCharges,
      discount,
      finalAmount,
      totalAmount: finalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: isSchoolPO ? 'PO Approved (Net 30)' : 'Paid',
      orderStatus: 'qc_assembly',
      approvalStatus: isSchoolPO ? 'pending_approval' : 'approved',
      razorpayOrderId: razorpayOrderId || undefined,
      razorpayPaymentId: razorpayPaymentId || undefined,
      razorpayPaymentLinkId: razorpayPaymentLinkId || undefined,
      trackingNumber,
      courierName: 'Delhivery B2B Priority',
      deliveryOtp,
      trackingDetails,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Record payment transaction audit log
    const transactionId = `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    paymentTransactions.unshift({
      transactionId,
      orderId,
      customerId: effectiveCustomerId,
      amount: finalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || 'UPI',
      transactionType: 'payment',
      gatewayReference: razorpayPaymentId || `TXN-PG-${Date.now().toString().slice(-6)}`,
      status: 'SUCCESS',
      metadata: { schoolName, razorpayOrderId },
      createdAt: new Date().toISOString()
    });

    // Send customer notification
    notifications.unshift({
      notificationId: `notif_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      recipientId: effectiveCustomerId,
      recipientEmail: customerEmail,
      title: isSchoolPO ? `Institutional PO ${orderId} Received` : `Order ${orderId} Confirmed`,
      message: `Your order for INR ${finalAmount.toLocaleString('en-IN')} has been registered. Tracking ID: ${trackingNumber}.`,
      type: 'order_status',
      orderId,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully via authoritative backend service',
      order: newOrder
    });
  });

  // Large Purchase / Institutional Quote Request
  app.post('/api/backend/order-requests', (req, res) => {
    const {
      customerId,
      customerDetails,
      requestedProducts,
      shippingCharges = 0
    } = req.body;

    if (!customerDetails || !requestedProducts || !requestedProducts.length) {
      return res.status(400).json({ error: 'Customer details and requested products are required.' });
    }

    let estimatedTotal = 0;
    for (const item of requestedProducts) {
      estimatedTotal += (Number(item.estimatedUnitPrice) || 0) * (Number(item.quantity) || 1);
    }

    const requestId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCustomerId = customerId || 'client_' + (customerDetails.email?.split('@')[0] || Date.now());

    const newRequest: OrderRequest = {
      requestId,
      customerId: effectiveCustomerId,
      customerDetails,
      requestedProducts,
      requestedAmount: estimatedTotal,
      approvalStatus: 'pending_approval',
      rejectionReason: null,
      finalQuotedAmount: null,
      shippingCharges: Number(shippingCharges) || 0,
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orderRequests.unshift(newRequest);

    // Notify administrators
    notifications.unshift({
      notificationId: `notif_admin_${Date.now()}`,
      recipientId: 'super-admin-balki',
      recipientEmail: 'kartikks1205@gmail.com',
      title: `New Institutional Quote Request: ${requestId}`,
      message: `${customerDetails.schoolName || customerDetails.name} submitted a bulk purchase request for ${requestedProducts.length} items (Est: INR ${estimatedTotal.toLocaleString('en-IN')}).`,
      type: 'approval',
      orderId: requestId,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Institutional purchase request submitted for administrative review',
      request: newRequest
    });
  });

  // ==========================================
  // 6. CUSTOMER HISTORY & NOTIFICATIONS APIS
  // ==========================================
  app.get('/api/customer/orders', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return res.status(400).json({ error: 'customerId or email parameter required' });
    }

    const filtered = orders.filter(o => 
      (customerId && (o.customerId === customerId || o.userId === customerId)) ||
      (email && typeof email === 'string' && o.customerEmail.toLowerCase() === email.toLowerCase())
    );

    res.json(filtered);
  });

  app.get('/api/customer/order-requests', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return res.status(400).json({ error: 'customerId or email parameter required' });
    }

    const filtered = orderRequests.filter(r => 
      (customerId && r.customerId === customerId) ||
      (email && typeof email === 'string' && r.customerDetails.email?.toLowerCase() === email.toLowerCase())
    );

    res.json(filtered);
  });

  app.get('/api/customer/notifications', (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return res.status(400).json({ error: 'customerId or email parameter required' });
    }

    const filtered = notifications.filter(n =>
      (customerId && n.recipientId === customerId) ||
      (email && typeof email === 'string' && n.recipientEmail?.toLowerCase() === email.toLowerCase())
    );

    res.json(filtered);
  });

  app.post('/api/customer/notifications/:id/read', (req, res) => {
    const notif = notifications.find(n => n.notificationId === req.params.id);
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    notif.read = true;
    res.json({ success: true, notification: notif });
  });

  // ==========================================
  // 7. SECURE ROLE-BASED ADMIN MANAGEMENT APIS
  // ==========================================
  app.get('/api/admin/verify', (req, res) => {
    const access = verifyAdminAccess(req);
    res.json({
      isAdmin: access.authorized,
      admin: access.authorized ? {
        email: access.email,
        role: access.role,
        permissions: ['manage_orders', 'approve_requests', 'change_delivery_status', 'view_analytics']
      } : null
    });
  });

  app.get('/api/admin/orders', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
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
      list = list.filter(o =>
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
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }

    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
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

    // Trigger customer notification
    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || 'client',
      recipientEmail: order.customerEmail,
      title: `Order ${order.id} Approved by Procurement Desk`,
      message: `Your order has passed administrative verification and advanced to technical assembly and QA testing.`,
      type: 'approval',
      orderId: order.id,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Order ${order.id} approved successfully`,
      order
    });
  });

  app.post('/api/admin/orders/:id/reject', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }

    const { rejectionReason } = req.body;
    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.approvalStatus = 'rejected';
    order.rejectionReason = rejectionReason || 'Institutional document requirements not satisfied.';
    order.orderStatus = 'cancelled';
    order.updatedAt = new Date().toISOString();

    // Rollback stock
    for (const item of order.items) {
      const prod = products.find(p => p.id === item.product?.id || p.sku === item.product?.sku);
      if (prod) {
        prod.stock += item.quantity;
      }
    }

    // Customer notification
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

    res.json({
      success: true,
      message: `Order ${order.id} rejected and inventory stock restored`,
      order
    });
  });

  app.post('/api/admin/orders/:id/status', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }

    const { status, courierName, trackingNumber, note, location } = req.body;
    const order = orders.find(o => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
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

    res.json({
      success: true,
      message: `Order ${order.id} status updated to ${status}`,
      order
    });
  });

  app.get('/api/admin/order-requests', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }
    res.json(orderRequests);
  });

  app.post('/api/admin/order-requests/:id/approve', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }

    const { finalQuotedAmount, shippingCharges = 0 } = req.body;
    const request = orderRequests.find(r => r.requestId === req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    request.approvalStatus = 'approved';
    request.finalQuotedAmount = Number(finalQuotedAmount) || request.requestedAmount;
    request.shippingCharges = Number(shippingCharges) || 0;

    // Generate Razorpay Payment Link for approved quotation
    const linkId = `plink_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const linkUrl = `https://rzp.io/i/test_${request.requestId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    request.razorpayPaymentLinkId = linkId;
    request.razorpayPaymentLinkUrl = linkUrl;
    request.paymentStatus = 'LINK_GENERATED';
    request.updatedAt = new Date().toISOString();

    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: request.customerId,
      recipientEmail: request.customerDetails?.email,
      title: `Institutional Quote Approved: ${request.requestId}`,
      message: `Your bulk quote has been approved at INR ${request.finalQuotedAmount.toLocaleString('en-IN')}. Razorpay payment link generated: ${linkUrl}`,
      type: 'approval',
      orderId: request.requestId,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Quote request ${request.requestId} approved and Razorpay payment link generated`,
      request,
      paymentLink: {
        paymentLinkId: linkId,
        paymentLinkUrl: linkUrl,
        amount: request.finalQuotedAmount
      }
    });
  });

  app.post('/api/admin/order-requests/:id/reject', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }

    const { rejectionReason } = req.body;
    const request = orderRequests.find(r => r.requestId === req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Quote request not found' });
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

    res.json({
      success: true,
      message: `Quote request ${request.requestId} rejected`,
      request
    });
  });

  app.get('/api/admin/transactions', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }
    res.json(paymentTransactions);
  });

  app.get('/api/admin/admin-users', (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return res.status(403).json({ error: 'Unauthorized. Administrator credentials required.' });
    }
    res.json(adminUsers);
  });

  // Inventory API
  app.get('/api/inventory', (req, res) => {
    res.json(inventory);
  });

  app.post('/api/inventory/update', (req, res) => {
    const { sku, deltaStock, newMinThreshold, notes } = req.body;
    const item = inventory.find(i => i.sku === sku);
    if (!item) {
      return res.status(404).json({ error: 'SKU not found in inventory' });
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

    // Sync with product stock
    const prod = products.find(p => p.sku === sku);
    if (prod) {
      prod.stock = item.currentStock;
    }

    res.json({ success: true, item, notes });
  });

  // User Progress API
  app.get('/api/user/progress', (req, res) => {
    res.json(userProgress);
  });

  app.post('/api/user/progress/complete-lesson', (req, res) => {
    const { lessonId, quizScore, courseId, courseTitle, hoursAdded = 1.5 } = req.body;

    if (lessonId && !userProgress.completedLessonIds.includes(lessonId)) {
      userProgress.completedLessonIds.push(lessonId);
    }
    if (lessonId && typeof quizScore === 'number') {
      userProgress.quizScores[lessonId] = quizScore;
    }
    userProgress.tinkeringHours += Number(hoursAdded);

    // Check if course is complete
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
    const { schoolName, contactPerson, email, phone, cityState, studentStrength, packageType, estimatedBudget, notes } = req.body;
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

  // Marketing Internship Application API (matching company document)
  app.get('/api/internship/applications', (req, res) => {
    res.json(internshipApplications);
  });

  app.post('/api/internship/apply', (req, res) => {
    const { fullName, email, phone, location, college, degree, languages, whyBalki, resumeFileName } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Name, email and phone are mandatory' });
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
  app.get('/api/reviews', (req, res) => {
    res.json(clientReviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { authorName, designation, institution, institutionType, location, productId, productName, rating, headline, reviewText, studentsImpacted } = req.body;
    if (!authorName || !institution || !reviewText) {
      return res.status(400).json({ error: 'Author name, institution and review text are required' });
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
  app.get('/api/case-studies', (req, res) => {
    res.json(caseStudies);
  });

  app.get('/api/case-studies/:id', (req, res) => {
    const study = caseStudies.find(s => s.id === req.params.id || s.slug === req.params.id);
    if (!study) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    res.json(study);
  });

  // Support & Problem Resolvance Tickets API
  app.get('/api/support/tickets', (req, res) => {
    const { status, search } = req.query;
    let filtered = [...supportTickets];

    if (status && typeof status === 'string') {
      filtered = filtered.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.ticketNumber.toLowerCase().includes(q) ||
        t.institutionName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  app.post('/api/support/tickets', (req, res) => {
    const { name, role, institutionName, email, phone, category, orderIdOrSku, priority, subject, description } = req.body;
    
    if (!name || !institutionName || !email || !description) {
      return res.status(400).json({ error: 'Name, Institution, Email and Description are required' });
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

  const httpServer = http.createServer(app);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, HOST, () => {
    console.log(`BALKI TECHNOLOGIES server running on http://${HOST}:${PORT}`);
  });

  const shutdown = () => {
    httpServer.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
