import http from 'http';
import express from 'express';
import path from 'path';
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
  ServerCart
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

let orders: Order[] = [
  ...INITIAL_ORDERS,
  {
    id: 'ORD-2026-9081',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    customerName: 'Kendriya Vidyalaya Lab In-charge',
    customerEmail: 'kv.hyderabad.atl@edu.in',
    customerPhone: '+91 98480 22334',
    schoolName: 'Kendriya Vidyalaya No. 1, Hyderabad',
    gstin: '36AAAAA0000A1Z5',
    shippingAddress: {
      street: 'Opp. Air Force Station, Bowenpally',
      city: 'Secunderabad',
      state: 'Telangana',
      pincode: '500011'
    },
    items: [
      { product: products[0], quantity: 1 },
      { product: products[6], quantity: 5 }
    ],
    subtotal: 52494,
    gstAmount: 9448.92,
    shippingFee: 0,
    discount: 2500,
    totalAmount: 59442.92,
    paymentMethod: 'SchoolPO',
    paymentStatus: 'PO Approved (Net 30)',
    trackingNumber: 'DELHIVERY-B2B-8971203',
    orderStatus: 'in_transit',
    deliveryOtp: '7194',
    paymentReference: 'PO-KV-HYD-2026-9081',
    trackingDetails: {
      courierPartner: 'Delhivery B2B Logistics (Priority STEM Express)',
      awbNumber: 'DELHIVERY-B2B-8971203',
      dispatchDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      originHub: 'Balki Central Fulfillment, Financial District, Hyderabad',
      destinationHub: 'Secunderabad Delivery Center, Telangana',
      deliverySecurityOtp: '7194',
      assignedFieldEngineer: {
        name: 'Suresh Nambiar',
        phone: '+91 90711 99139',
        badge: 'Lead Field Electronics Engineer'
      },
      liveCoordinates: {
        lat: 17.4721,
        lng: 78.4892
      },
      checkpoints: [
        {
          id: 'chk-kv-1',
          status: 'order_placed',
          title: 'School Purchase Order Registered (Net 30)',
          description: 'Official institutional purchase order registered for Kendriya Vidyalaya No. 1.',
          location: 'Balki Corporate Fulfillment, Hyderabad',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          completed: true,
          current: false
        },
        {
          id: 'chk-kv-2',
          status: 'qc_assembly',
          title: 'ATL Kit BOM Assembly & Quality Audit Passed',
          description: 'Hardware flashed, sensor components tested, barcoded with anti-static foam.',
          location: 'Balki Hardware Fabrication & QA Lab, Hyderabad',
          timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
          completed: true,
          current: false
        },
        {
          id: 'chk-kv-3',
          status: 'dispatched',
          title: 'Dispatched with Delhivery B2B Express',
          description: 'Package dispatched via Priority Express. Waybill DELHIVERY-B2B-8971203 issued.',
          location: 'Shamshabad Air Freight & Cargo Hub, Hyderabad',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          completed: true,
          current: false
        },
        {
          id: 'chk-kv-4',
          status: 'in_transit',
          title: 'In Transit – Arrived at Secunderabad North Hub',
          description: 'Consignment arrived at transshipment sorting center. Outward van scheduled.',
          location: 'Secunderabad North Delivery Center, Telangana',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
          completed: true,
          current: true
        },
        {
          id: 'chk-kv-5',
          status: 'out_for_delivery',
          title: 'Out for School Lab Delivery',
          description: 'Out for school gate handover with field engineer. Security OTP: 7194.',
          location: 'Secunderabad Delivery Van 02',
          timestamp: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
          completed: false,
          current: false
        },
        {
          id: 'chk-kv-6',
          status: 'delivered',
          title: 'Delivered & Lab Installation Sign-off',
          description: 'Unboxing and equipment testing with ATL teacher in-charge.',
          location: 'KV No. 1 Bowenpally Lab',
          timestamp: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          completed: false,
          current: false
        }
      ]
    }
  }
];
let rentalBookings: RentalBooking[] = [
  {
    id: 'RENT-2026-104',
    equipmentId: 'rent-1',
    equipmentName: 'Industrial High-Speed 3D Printer Pro (Bambu Lab / Creality CoreXY)',
    userName: 'Prof. S. R. Rao',
    userEmail: 'sr.rao@stemschool.edu.in',
    userPhone: '+91 91234 56789',
    institutionName: 'Hyderabad Public School Innovation Cell',
    startDate: '2026-09-20',
    endDate: '2026-09-27',
    totalDays: 7,
    rentalFee: 3500,
    depositFee: 8000,
    totalAmount: 11500,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
];
let userProgress: UserProgress = { ...INITIAL_USER_PROGRESS };
let quoteRequests: ATLQuoteRequest[] = [];
let internshipApplications: InternshipApplication[] = [
  {
    id: 'APP-2026-001',
    fullName: 'Priya Reddy',
    email: 'priya.reddy@gmail.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, Telangana',
    college: 'Osmania University College of Engineering',
    degree: 'B.Tech Electrical & Electronics',
    languages: 'English, Hindi, Telugu',
    whyBalki: 'Passionate about democratizing ATL robotics in rural schools and experienced in organizing college tech symposiums.',
    resumeFileName: 'Priya_Reddy_Resume.pdf',
    submittedAt: new Date().toISOString()
  }
];

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
  // 2. PAYMENT GATEWAY & INTENT BACKEND
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

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      shippingAddress,
      items,
      subtotal,
      gstAmount,
      shippingFee,
      discount,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: isSchoolPO ? 'PO Approved (Net 30)' : 'Paid',
      trackingNumber,
      orderStatus: 'qc_assembly',
      deliveryOtp,
      paymentReference: paymentRef,
      trackingDetails
    };

    orders.unshift(newOrder);

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

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerEmail,
      customerPhone,
      schoolName,
      gstin,
      shippingAddress,
      items,
      subtotal,
      gstAmount,
      shippingFee,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'SchoolPO' ? 'PO Approved (Net 30)' : 'Paid',
      trackingNumber,
      orderStatus: 'qc_assembly',
      deliveryOtp,
      trackingDetails
    };

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
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
