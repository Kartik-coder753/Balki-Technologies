export type ProductCategory =
  | 'all'
  | 'atl-packages'
  | 'grade-kits'
  | 'microcontrollers'
  | 'sensors'
  | 'robotics-mechanics'
  | 'drone-3d'
  | 'physics-lab'
  | 'chemistry-lab'
  | 'biology-anatomy'
  | 'mathematics-lab'
  | 'microscopes-optics';

export type NavTab = 
  | 'home' 
  | 'store' 
  | 'quotations'
  | 'hackathon'
  | 'blog' 
  | 'about' 
  | 'contact' 
  | 'courses' 
  | 'rentals' 
  | 'inventory' 
  | 'dashboard' 
  | 'careers';

export type GradeLevel = 'Class 3-5' | 'Class 6-8' | 'Class 9-10' | 'Class 11-12' | 'All Grades';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gradeLevel: GradeLevel;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  minStockAlert: number;
  sku: string;
  warehouseLocation: string;
  image: string;
  shortDesc: string;
  description: string;
  features: string[];
  whatsInBox: string[];
  nepAligned: boolean;
  atlCertified: boolean;
  warrantyMonths: number;
}

export interface RentalEquipment {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  securityDeposit: number;
  totalUnits: number;
  availableUnits: number;
  image: string;
  condition: 'Brand New' | 'Excellent' | 'Calibrated';
  specs: string[];
  includes: string[];
  description: string;
  minRentalDays: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoSnippetTitle: string;
  summary: string;
  theoryContent: string;
  codeSnippet?: string;
  codeLanguage?: string;
  simulationType?: 'led_blink' | 'ultrasonic_radar' | 'servo_sweep' | 'drone_telemetry';
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Course {
  id: string;
  title: string;
  gradeLevel: GradeLevel;
  targetAudience: string;
  nepCompetencies: string[];
  durationWeeks: number;
  totalHours: number;
  enrolledStudents: number;
  rating: number;
  thumbnail: string;
  overview: string;
  lessons: CourseLesson[];
  certificateTitle: string;
  isLiked?: boolean;
  likesCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'order_placed' 
  | 'qc_assembly' 
  | 'dispatched' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface TrackingCheckpoint {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface TrackingDetails {
  courierPartner: string;
  awbNumber: string;
  expectedDeliveryDate: string;
  dispatchDate: string;
  originHub: string;
  destinationHub: string;
  deliverySecurityOtp: string;
  assignedFieldEngineer: {
    name: string;
    phone: string;
    badge: string;
  };
  liveCoordinates: {
    lat: number;
    lng: number;
  };
  checkpoints: TrackingCheckpoint[];
}

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'SchoolPO';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  schoolName?: string;
  gstin?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'PO Approved (Net 30)' | 'Payment Pending' | 'Refunded';
  trackingNumber: string;
  orderStatus?: OrderStatus;
  trackingDetails?: TrackingDetails;
  paymentReference?: string;
  notes?: string;
  deliveryOtp?: string;
}

export interface PaymentIntent {
  intentId: string;
  orderAmount: number;
  currency: 'INR';
  gstAmount: number;
  shippingFee: number;
  discount: number;
  status: 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'PO_APPROVED';
  clientSecret: string;
  createdAt: string;
  expiresAt: string;
  itemsCount: number;
}

export interface ServerCart {
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingFee: number;
  discount: number;
  appliedCoupon?: string;
  total: number;
  stockWarnings?: string[];
}

export interface RentalBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  institutionName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  rentalFee: number;
  depositFee: number;
  totalAmount: number;
  status: 'Confirmed' | 'Dispatched' | 'Active' | 'Returned';
  createdAt: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: ProductCategory;
  currentStock: number;
  minimumThreshold: number;
  warehouse: string;
  unitCost: number;
  sellingPrice: number;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export interface UserProgress {
  studentName: string;
  schoolName: string;
  grade: string;
  tinkeringHours: number;
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  earnedCertificates: {
    courseId: string;
    courseTitle: string;
    issueDate: string;
    certificateId: string;
  }[];
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
  likedCourseIds?: string[];
}

export interface ATLQuoteRequest {
  id: string;
  schoolName: string;
  contactPerson: string;
  email: string;
  phone: string;
  cityState: string;
  studentStrength: number;
  packageType: 'Basic Starter' | 'Comprehensive ATL Lab' | 'Advanced AI & Robotics';
  estimatedBudget: string;
  notes?: string;
  createdAt: string;
}

export interface InternshipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  college: string;
  degree: string;
  languages: string;
  whyBalki: string;
  resumeFileName: string;
  submittedAt: string;
}

export interface ClientReview {
  id: string;
  authorName: string;
  designation: string;
  institution: string;
  institutionType: 'Kendriya Vidyalaya' | 'Private CBSE/ICSE' | 'STEM Academy' | 'Govt Model School' | 'University/College' | 'Industry Lab';
  location: string;
  productId: string;
  productName: string;
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  headline: string;
  reviewText: string;
  studentsImpacted?: number;
  likesCount: number;
  avatarUrl?: string;
  badge?: string;
}

export interface CaseStudyBlog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'School Case Study' | 'Corporate CSR' | 'Industrial Prototyping' | 'NEP 2020 Research' | 'Clean Tech Pilot';
  clientOrCompany: string;
  location: string;
  publishedDate: string;
  readTimeMinutes: number;
  coverImage: string;
  productsUsed: {
    id: string;
    name: string;
    sku: string;
    category: ProductCategory;
    image: string;
    price: number;
  }[];
  keyMetrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  executiveSummary: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  fullArticle: string;
  quote: {
    text: string;
    author: string;
    role: string;
  };
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  name: string;
  role: 'Principal / Management' | 'ATL Lab In-Charge' | 'STEM Teacher' | 'Student / Parent' | 'Institutional Procurement';
  institutionName: string;
  email: string;
  phone: string;
  category:
    | 'Hardware Defect & 12-Month Replacement'
    | 'ATL Lab Installation & Setup Support'
    | 'Missing / Broken Parts in Kit'
    | 'Course Platform & Certificate Query'
    | 'Equipment Rental Support & Return'
    | 'Order Delivery, Tracking & Invoicing'
    | 'B2B School Quotation & GeM Purchase Order'
    | 'Technical Wiring & Code Troubleshooting';
  orderIdOrSku?: string;
  priority: 'Urgent (Classroom Paused)' | 'High (Upcoming Event)' | 'Normal';
  subject: string;
  description: string;
  attachmentName?: string;
  status: 'Open' | 'Engineer Assigned' | 'Dispatched (Replacement)' | 'Resolved';
  assignedEngineer?: string;
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export type UpdateType = 'product' | 'course' | 'company' | 'rental';

export interface CompanyUpdate {
  id: string;
  type: UpdateType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
  date: string;
  image: string;
  description: string;
  highlights: string[];
  productId?: string;
  courseId?: string;
  rentalId?: string;
  actionText: string;
  featured?: boolean;
  announcementDetails?: {
    fullStory: string;
    impactOnSchools: string[];
    technicalHighlights: string[];
    officialQuote?: {
      text: string;
      author: string;
      designation: string;
    };
  };
}

