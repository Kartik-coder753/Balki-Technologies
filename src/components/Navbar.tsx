import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  ShoppingCart, 
  ShoppingBag,
  BookOpen, 
  Clock, 
  Package, 
  Award, 
  Building2, 
  Briefcase, 
  Search, 
  Sparkles, 
  Phone, 
  Mail, 
  UserCheck, 
  LifeBuoy, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  FileSpreadsheet, 
  ChevronRight,
  ChevronDown,
  Menu,
  Home,
  Info,
  Layers,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Compass,
  Truck,
  Boxes,
  Trophy,
  LogOut,
  User,
  Sun,
  Bot,
  Zap
} from 'lucide-react';
import { CartItem, Product, Course, RentalEquipment, ProductCategory, NavTab } from '../types';
import { downloadCurriculumGuide } from '../utils/downloadHelpers';
import { BalkiLogo } from './BalkiLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openB2BModal: () => void;
  tinkeringHours: number;
  products?: Product[];
  courses?: Course[];
  rentals?: RentalEquipment[];
  onSelectProduct?: (product: Product) => void;
  onSelectCategory?: (category: ProductCategory) => void;
  onOpenTracking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItems,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  openB2BModal,
  tinkeringHours,
  products = [],
  courses = [],
  rentals = [],
  onSelectProduct,
  onSelectCategory,
  onOpenTracking
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isMobileShopDrawerOpen, setIsMobileShopDrawerOpen] = useState(false);
  const [mobileShopCategory, setMobileShopCategory] = useState<'all' | 'green-tech' | 'robotics' | 'packages' | 'categories'>('all');
  const [mobileShopSearch, setMobileShopSearch] = useState('');
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [mobileMoreExpanded, setMobileMoreExpanded] = useState(false);

  const { currentUser, userProfile, logout } = useAuth();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const mobileShopDrawerRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (mobileShopDrawerRef.current && !mobileShopDrawerRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('#nav-tab-mobile-shop')) {
          setIsMobileShopDrawerOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Complete List of Products & Packages mentioned in the Shop section
  const SHOP_FEATURED_PRODUCTS = [
    // 1. Scientific & Green Tech
    {
      id: 'solar-tracker',
      name: 'SRROBOTICS Single Axis Solar Tracking System',
      tag: 'LDR Sun-Sync',
      spec: 'Dual LDR Photocell Sun-Tracking with SG90 Micro Servo (100% Hands-On)',
      category: 'green-tech' as const,
      categoryLabel: 'Scientific & Green Tech',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      searchQuery: 'solar tracking',
      productCategory: 'physics-lab' as ProductCategory
    },
    {
      id: 'soil-irrigation',
      name: 'Smart Soil Moisture Automatic Irrigation System',
      tag: 'Moisture Pump',
      spec: 'Capacitive Soil Probe + 5V Submersible Pump + 5V Relay Module',
      category: 'green-tech' as const,
      categoryLabel: 'Scientific & Green Tech',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      searchQuery: 'soil',
      productCategory: 'biology-anatomy' as ProductCategory
    },
    {
      id: 'aqi-analyzer',
      name: 'Smart Air Quality & Pollution Analyzer',
      tag: 'OLED AQI',
      spec: 'MQ-135 Gas Sensor + DHT11 Temp/Humidity + 0.96" I2C OLED Display',
      category: 'green-tech' as const,
      categoryLabel: 'Scientific & Green Tech',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      searchQuery: 'air quality',
      productCategory: 'sensors' as ProductCategory
    },
    {
      id: 'auto-dustbin',
      name: 'Smart Automatic Touchless Dustbin',
      tag: 'Sonar SG90',
      spec: 'Ultrasonic HC-SR04 Proximity Sensor + SG90 Servo Actuated Lid',
      category: 'green-tech' as const,
      categoryLabel: 'Scientific & Green Tech',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      searchQuery: 'dustbin',
      productCategory: 'sensors' as ProductCategory
    },
    {
      id: 'sanitizer-kit',
      name: 'Touchless IR Sanitizer Dispenser Kit',
      tag: 'IR Mist',
      spec: 'Infrared Proximity Module + Transistor Switch + Mini Mist Pump',
      category: 'green-tech' as const,
      categoryLabel: 'Scientific & Green Tech',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      searchQuery: 'sanitizer',
      productCategory: 'sensors' as ProductCategory
    },

    // 2. ATL & Robotics
    {
      id: 'maze-robot',
      name: 'Maze Solving Autonomous Robot',
      tag: 'Hackathon Winner',
      spec: 'Multi-Sensor Array + Microcontroller + Wall Follow Algorithm',
      category: 'robotics' as const,
      categoryLabel: 'ATL & Robotics',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      searchQuery: 'maze',
      productCategory: 'atl-packages' as ProductCategory
    },
    {
      id: 'q250-drone',
      name: 'Q250 Quadcopter Drone Kit (DGCA Aligned)',
      tag: 'DGCA Aligned',
      spec: 'Carbon Fiber Frame + 2204 BLDC Motors + SimonK ESCs + Flight Board',
      category: 'robotics' as const,
      categoryLabel: 'ATL & Robotics',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      searchQuery: 'drone',
      productCategory: 'drone-3d' as ProductCategory
    },
    {
      id: 'bluetooth-car',
      name: 'Bluetooth Smartphone Controlled Car',
      tag: 'UNO R3 + HC-05',
      spec: '4WD Chassis + L298N Motor Driver + HC-05 Bluetooth + Android App',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      searchQuery: 'bluetooth',
      productCategory: 'robotics-mechanics' as ProductCategory
    },
    {
      id: 'gesture-robot',
      name: 'Gesture Controlled Smart Robot',
      tag: 'MPU6050 Gyro',
      spec: 'Hand Motion Accelerometer Glove + NRF24L01 Wireless Radio Link',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      searchQuery: 'gesture',
      productCategory: 'robotics-mechanics' as ProductCategory
    },
    {
      id: 'obstacle-rover',
      name: 'Obstacle Avoiding Ultrasonic Rover',
      tag: 'Sonar Radar',
      spec: 'Ultrasonic HC-SR04 on SG90 Servo Scanning Radar + 4WD Gearbox',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      searchQuery: 'obstacle',
      productCategory: 'robotics-mechanics' as ProductCategory
    },
    {
      id: 'line-follower',
      name: 'Precision Dual-IR Line Follower Robot',
      tag: 'Track Sensor',
      spec: 'High-Speed Optical Comparator Sensors + BO Motors & Rubber Wheels',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      searchQuery: 'line follower',
      productCategory: 'robotics-mechanics' as ProductCategory
    },
    {
      id: 'self-balancing',
      name: 'Self Balancing Two-Wheel Robot',
      tag: 'PID Balance',
      spec: 'Inverted Pendulum 6-Axis Gyro Stabilization + Stepper/DC Drivers',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      searchQuery: 'balancing',
      productCategory: 'robotics-mechanics' as ProductCategory
    },
    {
      id: 'robotic-arm',
      name: 'Web / WiFi Controlled Robotic Arm',
      tag: 'ESP32 WiFi',
      spec: '4-DOF High-Torque Servo Gripper with Live Browser Joystick Dashboard',
      category: 'robotics' as const,
      categoryLabel: 'Pro-Range Robotics',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      searchQuery: 'robotic arm',
      productCategory: 'robotics-mechanics' as ProductCategory
    },

    // 3. ATL Curriculum & Package Sets
    {
      id: 'stem-primary',
      name: 'Primary STEM Innovation Kits (Classes 3–5)',
      tag: 'Foundational NEP',
      spec: 'Paper Circuits, Magnetic Snap Blocks, Creative Maker Tinkering',
      category: 'packages' as const,
      categoryLabel: 'Curriculum & Packages',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      searchQuery: 'grade 3',
      productCategory: 'grade-kits' as ProductCategory
    },
    {
      id: 'stem-middle',
      name: 'Middle School Autonomous Rovers (Classes 6–8)',
      tag: 'Classes 6–8',
      spec: 'Scratch & Block Coding, Ultrasonic Sensing, Mechanical Assembly',
      category: 'packages' as const,
      categoryLabel: 'Curriculum & Packages',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      searchQuery: 'grade 6',
      productCategory: 'grade-kits' as ProductCategory
    },
    {
      id: 'stem-senior',
      name: 'Senior Secondary Mechatronics (Classes 9–12)',
      tag: 'Classes 9–12',
      spec: 'Embedded C++/Python, ESP32 IoT, Computer Vision & Edge AI',
      category: 'packages' as const,
      categoryLabel: 'Curriculum & Packages',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      searchQuery: 'grade 9',
      productCategory: 'grade-kits' as ProductCategory
    },
    {
      id: 'pkg-a',
      name: 'AIM ATL Package A: Electronics, Dev & Sensors (65 Items)',
      tag: 'NITI Approved',
      spec: 'Arduino UNO R4 Minima, ESP32, Breadboards, Sensor Suites, Power Units',
      category: 'packages' as const,
      categoryLabel: 'Official ATL Packages',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      searchQuery: 'Package A',
      productCategory: 'atl-packages' as ProductCategory
    },
    {
      id: 'pkg-b',
      name: 'AIM ATL Package B: Rapid Prototyping & Tools (35 Items)',
      tag: 'NITI Approved',
      spec: 'EV Educational Prototyping Kit, Soldering Stations, Rotary Toolsets',
      category: 'packages' as const,
      categoryLabel: 'Official ATL Packages',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      searchQuery: 'Package B',
      productCategory: 'atl-packages' as ProductCategory
    },
    {
      id: 'pkg-c',
      name: 'AIM ATL Package C: Advanced Robotics & IoT (25 Items)',
      tag: 'NITI Approved',
      spec: 'Meta Quest 3S VR Headset 128GB, LiteWing Drone Board, Advanced IoT',
      category: 'packages' as const,
      categoryLabel: 'Official ATL Packages',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      searchQuery: 'Package C',
      productCategory: 'atl-packages' as ProductCategory
    },
    {
      id: 'pkg-d',
      name: 'AIM ATL Package D: 3D Printers & Power Supplies (15 Items)',
      tag: 'NITI Approved',
      spec: 'Creality K1C High-Speed 3D Printer, Wanptek WPS305H Bench DC Supply',
      category: 'packages' as const,
      categoryLabel: 'Official ATL Packages',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      searchQuery: 'Package D',
      productCategory: 'atl-packages' as ProductCategory
    },
    {
      id: 'pkg-e',
      name: 'AIM ATL Turnkey Package E: Complete 169-Item Turnkey Lab',
      tag: 'Complete Lab',
      spec: 'Full 169-Hardware setup with 12-Month Onsite Warranty & Teacher Training',
      category: 'packages' as const,
      categoryLabel: 'Official ATL Packages',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      searchQuery: '169 items',
      productCategory: 'atl-packages' as ProductCategory
    },

    // 4. Lab Department Categories
    {
      id: 'cat-bio',
      name: 'Biology & Anatomy 3D Lab Models',
      tag: 'Medical Grade',
      spec: 'Human Torso, Heart, Brain, Complete Skeleton & Dissection Sets',
      category: 'categories' as const,
      categoryLabel: 'Lab Departments',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      searchQuery: 'biology',
      productCategory: 'biology-anatomy' as ProductCategory
    },
    {
      id: 'cat-micro',
      name: 'Microscopes & Precision Optical Benches',
      tag: 'Precision Optics',
      spec: 'Monocular & Binocular Medical Microscopes, He-Ne Laser Benches, Prisms',
      category: 'categories' as const,
      categoryLabel: 'Lab Departments',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      searchQuery: 'microscope',
      productCategory: 'microscopes-optics' as ProductCategory
    },
    {
      id: 'cat-chem',
      name: 'Chemistry Borosilicate Glassware & Reagent Kits',
      tag: 'Class-A Borosilicate',
      spec: 'Beakers, Titration Burettes, Distillation Condensers & Safety Reagents',
      category: 'categories' as const,
      categoryLabel: 'Lab Departments',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      searchQuery: 'chemistry',
      productCategory: 'chemistry-lab' as ProductCategory
    },
    {
      id: 'cat-phy',
      name: 'Physics Laboratory Demonstration Apparatus',
      tag: 'NEP Aligned',
      spec: 'Ohm’s Law, Wheatstone Bridge, Optical Benches & Resonance Kits',
      category: 'categories' as const,
      categoryLabel: 'Lab Departments',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      searchQuery: 'physics',
      productCategory: 'physics-lab' as ProductCategory
    },
    {
      id: 'cat-math',
      name: 'Mathematics Manipulatives & Geometry Labs',
      tag: 'Hands-On Math',
      spec: 'Trigonometry Circles, Coordinate Geo-Boards, Algebraic Shape Tiles',
      category: 'categories' as const,
      categoryLabel: 'Lab Departments',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      searchQuery: 'mathematics',
      productCategory: 'mathematics-lab' as ProductCategory
    }
  ];

  // Filtered list of products for the Mobile Shop Drawer
  const filteredMobileShopProducts = SHOP_FEATURED_PRODUCTS.filter(item => {
    const matchesCategory = mobileShopCategory === 'all' || item.category === mobileShopCategory;
    const filterQuery = mobileShopSearch.trim().toLowerCase();
    const matchesSearch = !filterQuery || 
      item.name.toLowerCase().includes(filterQuery) ||
      item.tag.toLowerCase().includes(filterQuery) ||
      item.spec.toLowerCase().includes(filterQuery) ||
      item.categoryLabel.toLowerCase().includes(filterQuery);
    return matchesCategory && matchesSearch;
  });

  // Action when a product is clicked in the Mobile Shop Drawer
  const handleMobileProductSelect = (shopItem: typeof SHOP_FEATURED_PRODUCTS[0]) => {
    setIsMobileShopDrawerOpen(false);
    
    // Look for a match in products prop
    const matched = products.find(p => 
      p.name.toLowerCase().includes(shopItem.searchQuery.toLowerCase()) ||
      shopItem.name.toLowerCase().includes(p.name.toLowerCase()) ||
      p.sku.toLowerCase() === shopItem.id.toLowerCase()
    );

    if (matched && onSelectProduct) {
      setActiveTab('store');
      onSelectProduct(matched);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (shopItem.productCategory && onSelectCategory) {
      setActiveTab('store');
      onSelectCategory(shopItem.productCategory);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('store');
      setSearchQuery(shopItem.searchQuery);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter items based on searchQuery
  const query = searchQuery.trim().toLowerCase();

  const matchingProducts = query 
    ? products.filter(p => 
        (p?.name?.toLowerCase() || '').includes(query) ||
        (p?.sku?.toLowerCase() || '').includes(query) ||
        (p?.category?.toLowerCase() || '').includes(query) ||
        (p?.gradeLevel?.toLowerCase() || '').includes(query) ||
        (p?.shortDesc?.toLowerCase() || '').includes(query) ||
        (p?.description?.toLowerCase() || '').includes(query)
      ).slice(0, 4)
    : [];

  const matchingCourses = query
    ? courses.filter(c =>
        (c?.title?.toLowerCase() || '').includes(query) ||
        (c?.gradeLevel?.toLowerCase() || '').includes(query) ||
        (c?.overview?.toLowerCase() || '').includes(query) ||
        (c?.targetAudience?.toLowerCase() || '').includes(query) ||
        (c?.certificateTitle?.toLowerCase() || '').includes(query) ||
        (Array.isArray(c?.nepCompetencies) && c.nepCompetencies.some(comp => comp?.toLowerCase().includes(query)))
      ).slice(0, 3)
    : [];

  const matchingRentals = query
    ? rentals.filter(r =>
        (r?.name?.toLowerCase() || '').includes(query) ||
        (r?.category?.toLowerCase() || '').includes(query) ||
        (r?.description?.toLowerCase() || '').includes(query) ||
        (Array.isArray(r?.specs) && r.specs.some(s => s?.toLowerCase().includes(query)))
      ).slice(0, 2)
    : [];

  // Quick Action items
  const quickActions = [
    {
      id: 'download-curriculum',
      label: 'Download NEP 2020 ATL Complete Curriculum & Syllabus (PDF)',
      icon: Download,
      category: 'Curriculum & Resources',
      badge: 'PDF Guide',
      action: () => {
        downloadCurriculumGuide();
        setIsSearchOpen(false);
        setIsMobileSearchActive(false);
      }
    },
    {
      id: 'b2b-quote',
      label: 'Request Institutional ATL Quotation & Rate Card (Net-30 / GeM)',
      icon: Building2,
      category: 'Schools & Partners',
      badge: 'Official Quote',
      action: () => {
        openB2BModal();
        setIsSearchOpen(false);
        setIsMobileSearchActive(false);
      }
    },
    {
      id: 'flagship-kit',
      label: 'Flagship ATL Master Prototyping Setup Kit (P1–P4 Packages)',
      icon: Sparkles,
      category: 'Flagship Showcase',
      badge: 'NITI Aayog Approved',
      action: () => {
        setActiveTab('store');
        setIsSearchOpen(false);
        setIsMobileSearchActive(false);
        setTimeout(() => {
          const el = document.getElementById('flagship-spotlight');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    {
      id: 'support-desk',
      label: '24/7 Problem Resolvance & Technical Support Hotline',
      icon: LifeBuoy,
      category: 'Helpdesk & Tickets',
      badge: 'Active 24/7',
      action: () => {
        setActiveTab('contact');
        setIsSearchOpen(false);
        setIsMobileSearchActive(false);
      }
    }
  ];

  const matchingQuickActions = query
    ? quickActions.filter(a => (a.label?.toLowerCase() || '').includes(query) || (a.category?.toLowerCase() || '').includes(query))
    : quickActions.slice(0, 4);

  const hasAnyResults = matchingProducts.length > 0 || matchingCourses.length > 0 || matchingRentals.length > 0 || matchingQuickActions.length > 0;

  const handlePerformSearch = (explicitQuery?: string) => {
    const term = explicitQuery !== undefined ? explicitQuery : searchQuery;
    setSearchQuery(term);
    setIsSearchOpen(false);
    setIsMobileSearchActive(false);
    setActiveTab('store');
    setTimeout(() => {
      const el = document.getElementById('products-catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSelectProductItem = (product: Product) => {
    setIsSearchOpen(false);
    setIsMobileSearchActive(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setActiveTab('store');
    }
  };

  const handleSelectCourseItem = (course: Course) => {
    setIsSearchOpen(false);
    setIsMobileSearchActive(false);
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRentalItem = (rental: RentalEquipment) => {
    setIsSearchOpen(false);
    setIsMobileSearchActive(false);
    setActiveTab('rentals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for clicking a category from the SHOP menu
  const handleCategoryClick = (cat: ProductCategory) => {
    setIsShopMenuOpen(false);
    setIsMobileShopDrawerOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setActiveTab('store');
    setTimeout(() => {
      const el = document.getElementById('products-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      
      {/* 1. Top Bar: Contact Hotline, Accreditation & Fast Actions */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1 sm:py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 truncate">
            <a 
              href="tel:+919071199139" 
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors font-medium text-slate-200 shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+91-9071199139</span>
            </a>
            <a 
              href="mailto:balki.technologies@gmail.com" 
              className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors text-slate-400"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>balki.technologies@gmail.com</span>
            </a>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-amber-300 font-semibold truncate">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Official ATL & NEP 2020 Lab Hardware Partner • Pan-India Free Delivery</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] shrink-0">
            <button
              onClick={openB2BModal}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-amber-400 cursor-pointer"
            >
              <Building2 className="w-3 h-3" />
              <span className="hidden sm:inline">Institutional</span>
              <span>Quote</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => downloadCurriculumGuide()}
              className="hover:text-slate-100 transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">ATL</span>
              <span>Syllabus</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-20 lg:h-22 gap-2 sm:gap-6">
          
          {/* Company Logo - Prominent display fitting the header space */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center py-1 sm:py-2 shrink-0 cursor-pointer group select-none"
          >
            <BalkiLogo 
              type="full" 
              variant="light" 
              className="h-8 sm:h-12 md:h-14 w-auto max-w-[155px] sm:max-w-[240px] md:max-w-[320px] transition-transform duration-200 group-hover:scale-[1.02]" 
            />
          </div>

          {/* Desktop Central Interactive Search Bar */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search ATL kits, microscopes, sensors, physics lab, courses..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePerformSearch();
                  if (e.key === 'Escape') setIsSearchOpen(false);
                }}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Smart Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  
                  {/* Products Matches */}
                  {matchingProducts.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>Laboratory & STEM Hardware</span>
                        <span className="text-amber-700 font-bold">{matchingProducts.length} items</span>
                      </div>
                      <div className="space-y-1">
                        {matchingProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProductItem(p)}
                            className="p-2 rounded-xl hover:bg-amber-50/80 flex items-center gap-3 cursor-pointer transition-colors group"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80';
                              }}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                <span className="font-semibold text-amber-700">₹{p.price.toLocaleString('en-IN')}</span>
                                <span>•</span>
                                <span>{p.gradeLevel}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-400">{p.sku}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Courses Matches */}
                  {matchingCourses.length > 0 && (
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                        <span>NEP 2020 Interactive Courses</span>
                        <span className="text-blue-600 font-bold">{matchingCourses.length} modules</span>
                      </div>
                      <div className="space-y-1">
                        {matchingCourses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCourseItem(c)}
                            className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{c.title}</p>
                              <p className="text-[10px] text-slate-500">{c.gradeLevel} • {c.nepCompetencies?.[0] || 'NEP Aligned'}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Matches */}
                  {matchingQuickActions.length > 0 && (
                    <div className="p-2 space-y-1 bg-slate-50/50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Institutional Quick Tools
                      </div>
                      <div className="space-y-1">
                        {matchingQuickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <div
                              key={action.id}
                              onClick={action.action}
                              className="p-2 rounded-xl hover:bg-amber-50 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-semibold text-slate-800 truncate">{action.label}</span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-bold shrink-0">
                                {action.badge}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Results Fallback */}
                  {!hasAnyResults && (
                    <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                      <Search className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-800">No direct matches for "{searchQuery}"</p>
                      <p className="text-[11px] text-slate-400">Search for "ATL", "Microscope", "Physics", "Chemistry", "Uno", or "Syllabus".</p>
                      <button
                        onClick={() => handlePerformSearch()}
                        className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Search Catalog for "{searchQuery}"
                      </button>
                    </div>
                  )}

                </div>

                {/* Footer Search Submission Link */}
                <div 
                  onClick={() => handlePerformSearch()}
                  className="p-3 bg-slate-50 hover:bg-amber-50 text-xs font-bold text-amber-700 flex items-center justify-between cursor-pointer transition-colors border-t border-slate-100"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>View all matching results in Hardware Catalog</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Enter ↵</span>
                </div>

              </div>
            )}
          </div>

          {/* Action Buttons: Request Quote, Dashboard, Cart, Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            
            {/* Mobile Search Button Toggle */}
            <button
              id="btn-mobile-search-toggle"
              onClick={() => setIsMobileSearchActive(!isMobileSearchActive)}
              className="md:hidden min-w-[42px] min-h-[42px] p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Mobile Search"
            >
              <Search className="w-4 h-4 text-slate-700" />
            </button>

            {/* Request B2B ATL Quote */}
            <button
              id="btn-request-atl-quote"
              onClick={openB2BModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>School ATL Quote</span>
            </button>

            {/* Live Order Tracking Button */}
            {onOpenTracking && (
              <button
                id="btn-nav-track-order"
                onClick={onOpenTracking}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                title="Track Live Consignment"
              >
                <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Track Order</span>
              </button>
            )}

            {/* Client Dashboard / My Account & Purchases */}
            <button
              id="btn-client-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Client Profile, Credentials & Purchase History"
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold">
                {userProfile?.displayName ? userProfile.displayName.split(' ')[0] : 'My Account'}
              </span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-900 font-bold">
                {userProfile?.hasPurchased ? 'Buyer' : 'Client'}
              </span>
            </button>

            {/* Logout Action */}
            {currentUser && (
              <button
                id="btn-nav-logout"
                onClick={() => logout()}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Sign Out</span>
              </button>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button
              id="btn-open-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[42px] min-h-[42px] p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isMobileSearchActive && (
          <div className="md:hidden pb-3 pt-1 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                autoFocus
                placeholder="Search kits, microscopes, courses, rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePerformSearch();
                  if (e.key === 'Escape') setIsMobileSearchActive(false);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-100 text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-amber-500 focus:bg-white outline-none"
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsMobileSearchActive(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Horizontal Scrolling Navigation List - Permanently anchored to top of mobile screen */}
        <div 
          className="lg:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x select-none"
          aria-label="Mobile Horizontal Navigation"
        >
          {/* HOME */}
          <button
            id="nav-mobile-home"
            onClick={() => {
              setActiveTab('home');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'home' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-950'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          {/* SHOP */}
          <button
            id="nav-tab-mobile-shop"
            onClick={() => {
              setIsMobileShopDrawerOpen(!isMobileShopDrawerOpen);
                          }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isMobileShopDrawerOpen || activeTab === 'store'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200 hover:text-slate-950'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>SHOP</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isMobileShopDrawerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* ROBOCUP 2027 */}
          <button
            id="nav-mobile-hackathon"
            onClick={() => {
              setActiveTab('hackathon');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'hackathon' && !isMobileShopDrawerOpen
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                : 'bg-cyan-50 text-cyan-900 border border-cyan-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>ROBOCUP 2027</span>
            <span className="text-[9px] px-1 py-0.2 bg-amber-400 text-slate-950 rounded-full font-black">₹10K</span>
          </button>

          {/* 169 QUOTES */}
          <button
            id="nav-mobile-quotations"
            onClick={() => {
              setActiveTab('quotations');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quotations' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-amber-600" />
            <span>169 QUOTES</span>
          </button>

          {/* COURSES */}
          <button
            id="nav-mobile-courses"
            onClick={() => {
              setActiveTab('courses');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'courses' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>COURSES</span>
          </button>

          {/* RENTALS */}
          <button
            id="nav-mobile-rentals"
            onClick={() => {
              setActiveTab('rentals');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rentals' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>RENTALS</span>
          </button>

          {/* ABOUT */}
          <button
            id="nav-mobile-about"
            onClick={() => {
              setActiveTab('about');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'about' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>ABOUT</span>
          </button>

          {/* CONTACT */}
          <button
            id="nav-mobile-contact"
            onClick={() => {
              setActiveTab('contact');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contact' && !isMobileShopDrawerOpen
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>CONTACT</span>
          </button>

          {/* BLOG */}
          <button
            id="nav-mobile-blog"
            onClick={() => {
              setActiveTab('blog');
              setIsMobileShopDrawerOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'blog' && !isMobileShopDrawerOpen
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100/80 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>BLOG</span>
          </button>

        </div>

        {/* MOBILE SHOP DROPDOWN TABLE - Listed in a dropdown table manner matching laptop preview */}
        {isMobileShopDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 top-[88px] sm:top-[96px] z-40 bg-slate-950/30 backdrop-blur-[1px] transition-opacity lg:hidden"
              onClick={() => setIsMobileShopDrawerOpen(false)}
            />

            {/* Anchored Dropdown Table Panel */}
            <div 
              ref={mobileShopDrawerRef}
              className="absolute left-0 right-0 top-full mt-1.5 mx-2 sm:mx-4 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-y-auto max-h-[calc(100vh-115px)] lg:hidden"
            >
              {/* Header Strip with Title & Dismiss */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm tracking-wide text-slate-900 block leading-tight">
                      SHOP HARDWARE CATALOG
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-none mt-0.5">
                      Select any category or hardware to explore
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileShopDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close Shop Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dropdown Table Layout - 4 Distinct Structured Sections Matching Laptop Styling */}
              <div className="space-y-4">
                
                {/* Table 1: Scientific & Green Tech */}
                <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/90">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-amber-200/60">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Scientific & Green Tech</span>
                  </div>
                  <ul className="space-y-1.5 font-normal text-slate-600">
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('physics-lab');
                        }}
                        className="w-full text-left hover:text-amber-600 hover:bg-amber-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Solar Tracking System</span>
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">LDR Sun-Sync</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('biology-anatomy');
                        }}
                        className="w-full text-left hover:text-amber-600 hover:bg-amber-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Smart Soil Irrigation</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">Moisture Pump</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('sensors');
                        }}
                        className="w-full text-left hover:text-amber-600 hover:bg-amber-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Air Quality Analyzer</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">OLED AQI</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('sensors');
                        }}
                        className="w-full text-left hover:text-amber-600 hover:bg-amber-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Smart Automatic Dustbin</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">Sonar SG90</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('sensors');
                        }}
                        className="w-full text-left hover:text-amber-600 hover:bg-amber-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Touchless Sanitizer Kit</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">IR Mist</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Table 2: ATL & Problem Solving */}
                <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/90">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-blue-200/60">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>ATL & Problem Solving</span>
                  </div>
                  <ul className="space-y-1.5 font-normal text-slate-600">
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('atl-packages');
                        }}
                        className="w-full text-left hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Maze Solving Robot</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0">Hackathon</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('drone-3d');
                        }}
                        className="w-full text-left hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Q250 Quadcopter Drone</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full shrink-0">DGCA Aligned</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('grade-kits');
                        }}
                        className="w-full text-left hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Primary STEM (Classes 3–5)</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50 shrink-0">NEP Foundational</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('grade-kits');
                        }}
                        className="w-full text-left hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Middle School Rovers (Classes 6–8)</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50 shrink-0">NEP Middle</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('grade-kits');
                        }}
                        className="w-full text-left hover:text-blue-600 hover:bg-blue-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Senior Secondary Mechatronics</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50 shrink-0">Classes 9–12</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Table 3: Pro-Range Robotics */}
                <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/90">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-emerald-200/60">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Pro-Range Robotics</span>
                  </div>
                  <ul className="space-y-1.5 font-normal text-slate-600">
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Bluetooth Car Control</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">UNO R3</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Gesture Controlled Robot</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">MPU6050</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Obstacle Avoiding Rover</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">Sonar Radar</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Line Follower Robot</span>
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 shrink-0">Dual IR</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Self Balancing Robot</span>
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60 shrink-0">PID Balance</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          setIsMobileShopDrawerOpen(false);
                          handleCategoryClick('robotics-mechanics');
                        }}
                        className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/80 p-2 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer bg-white border border-slate-100 shadow-2xs"
                      >
                        <span className="font-semibold text-slate-800 text-xs truncate">Web Controlled Robotic Arm</span>
                        <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200/60 shrink-0">ESP32 WiFi</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Table 4: Quick Overview Card */}
                <div className="relative overflow-hidden bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 flex flex-col justify-between group">
                  <img
                    src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
                    alt="Scientific Laboratory Equipment Overview"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover opacity-12 mix-blend-multiply pointer-events-none"
                  />
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                      AIM ATL Packages (169 Items)
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">Official Lab Hardware & Quotations</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Turnkey Packages A, B, C, D & E approved under NITI Aayog guidelines with 12-month warranty.
                    </p>
                  </div>

                  <div className="relative z-10 space-y-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setIsMobileShopDrawerOpen(false);
                        setActiveTab('quotations');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>View 169-Item Quotations Dossier</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileShopDrawerOpen(false);
                        handleCategoryClick('all');
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                    >
                      View Full Store Catalog
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileShopDrawerOpen(false);
                        setActiveTab('rentals');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                    >
                      Lab Equipment Rentals
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* 3. Primary Navigation Bar - HOME, SHOP (with Mega Menu), BLOG, ABOUT US, CONTACT US, and MORE */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 py-1.5 text-xs font-semibold">
          
          <div className="flex items-center space-x-1">
            
            {/* 1. HOME */}
            <button
              id="nav-tab-home"
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>

            {/* 2. SHOP (with Mega Menu Dropdown) */}
            <div 
              ref={shopMenuRef} 
              className="relative"
              onMouseEnter={() => setIsShopMenuOpen(true)}
            >
              <button
                id="nav-tab-shop"
                onClick={() => {
                  setActiveTab('store');
                  setIsShopMenuOpen(!isShopMenuOpen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'store'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>SHOP</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* SHOP Mega Menu Dropdown */}
              {isShopMenuOpen && (
                <div 
                  onMouseLeave={() => setIsShopMenuOpen(false)}
                  className="absolute left-0 top-full mt-1.5 w-[840px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="grid grid-cols-4 gap-6 text-xs">
                    
                    {/* Column 1: Scientific & Environmental Kits */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-amber-100">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Scientific & Green Tech</span>
                      </div>
                      <ul className="space-y-1.5 font-normal text-slate-600">
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('physics-lab')}
                            className="w-full text-left hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Solar Tracking System</span>
                            <span className="text-[10px] text-amber-600 font-bold">LDR Sun-Sync</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('biology-anatomy')}
                            className="w-full text-left hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Smart Soil Irrigation</span>
                            <span className="text-[10px] text-slate-400">Moisture Pump</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('sensors')}
                            className="w-full text-left hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Air Quality Analyzer</span>
                            <span className="text-[10px] text-slate-400">OLED AQI</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('sensors')}
                            className="w-full text-left hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Smart Automatic Dustbin</span>
                            <span className="text-[10px] text-slate-400">Sonar SG90</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('sensors')}
                            className="w-full text-left hover:text-amber-600 hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Touchless Sanitizer Kit</span>
                            <span className="text-[10px] text-slate-400">IR Mist</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: ATL & Problem Solving */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-blue-100">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>ATL & Problem Solving</span>
                      </div>
                      <ul className="space-y-1.5 font-normal text-slate-600">
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('atl-packages')}
                            className="w-full text-left hover:text-blue-600 hover:bg-blue-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Maze Solving Robot</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">Hackathon</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('drone-3d')}
                            className="w-full text-left hover:text-blue-600 hover:bg-blue-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Q250 Quadcopter Drone</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">DGCA Aligned</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('grade-kits')}
                            className="w-full text-left hover:text-blue-600 hover:bg-blue-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Primary STEM (Classes 3–5)</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('grade-kits')}
                            className="w-full text-left hover:text-blue-600 hover:bg-blue-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Middle School Rovers (Classes 6–8)</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('grade-kits')}
                            className="w-full text-left hover:text-blue-600 hover:bg-blue-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Senior Secondary Mechatronics</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Pro-Range Robotics */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[11px] pb-1.5 border-b border-emerald-100">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Pro-Range Robotics</span>
                      </div>
                      <ul className="space-y-1.5 font-normal text-slate-600">
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>Bluetooth Car Control</span>
                            <span className="text-[10px] text-slate-400">UNO R3</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Gesture Controlled Robot</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Obstacle Avoiding Rover</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Line Follower Robot</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Self Balancing Robot</span>
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCategoryClick('robotics-mechanics')}
                            className="w-full text-left hover:text-emerald-600 hover:bg-emerald-50/60 p-1.5 rounded-lg transition-colors"
                          >
                            <span>Web Controlled Robotic Arm</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 4: Quick Overview Card */}
                    <div className="relative overflow-hidden bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 flex flex-col justify-between group">
                      <img
                        src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
                        alt="Scientific Laboratory Equipment Overview"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="absolute inset-0 w-full h-full object-cover opacity-12 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="relative z-10 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                          AIM ATL Packages (169 Items)
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">Official Lab Hardware & Quotations</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Turnkey Packages A, B, C, D & E approved under NITI Aayog guidelines with 12-month warranty.
                        </p>
                      </div>

                      <div className="relative z-10 space-y-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setIsShopMenuOpen(false);
                            setActiveTab('quotations');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Boxes className="w-3.5 h-3.5" />
                          <span>View 169-Item Quotations Dossier</span>
                        </button>
                        <button
                          onClick={() => handleCategoryClick('all')}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                        >
                          View Full Store Catalog
                        </button>
                        <button
                          onClick={() => {
                            setIsShopMenuOpen(false);
                            setActiveTab('rentals');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                        >
                          Lab Equipment Rentals
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>



            {/* ROBOCUP 2027 Hackathon Hub */}
            <button
              id="nav-tab-hackathon"
              onClick={() => {
                setActiveTab('hackathon');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'hackathon'
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-black shadow-md'
                  : 'text-cyan-950 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 font-bold'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>ROBOCUP 2027</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-full shadow-2xs">
                ₹10K + Drone
              </span>
            </button>

            {/* 4. BLOG */}
            <button
              id="nav-tab-blog"
              onClick={() => {
                setActiveTab('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BLOG</span>
            </button>

            {/* 4. ABOUT US */}
            <button
              id="nav-tab-about"
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>ABOUT US</span>
            </button>

            {/* 5. CONTACT US */}
            <button
              id="nav-tab-contact"
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 font-semibold'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
              <span>CONTACT US</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/70 text-amber-900 rounded-full font-bold">
                24/7
              </span>
            </button>

            {/* 6. MORE (Dropdown with Courses, Rentals, Inventory, Dashboard, Careers, etc.) */}
            <div 
              ref={moreMenuRef} 
              className="relative"
              onMouseEnter={() => setIsMoreMenuOpen(true)}
            >
              <button
                id="nav-tab-more"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  ['courses', 'rentals', 'inventory', 'dashboard', 'careers'].includes(activeTab)
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>MORE</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* MORE Dropdown Menu */}
              {isMoreMenuOpen && (
                <div 
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                  className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100 text-xs"
                >
                  <div className="space-y-1 pb-1.5">
                    <button
                      onClick={() => {
                        setActiveTab('quotations');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-amber-50 flex items-center justify-between text-amber-900 transition-colors text-left font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-amber-600" />
                        <span>ATL 169-Product Quotations</span>
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-950 font-black px-1.5 py-0.5 rounded-full">Dossier</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('courses');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>Interactive NEP Courses</span>
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full">3–12</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('rentals');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Equipment Rentals</span>
                      </span>
                      <span className="text-[10px] text-slate-400">DSO / 3D</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('inventory');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-600" />
                        <span>Inventory Lab Portal</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Multi-hub</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Tinkering Passport & Certs</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">{tinkeringHours}h</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('careers');
                        setIsMoreMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-amber-600" />
                        <span>Careers at Balki</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>
                  </div>

                  <div className="pt-1.5 space-y-1">
                    <button
                      onClick={() => {
                        openB2BModal();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-amber-50 flex items-center gap-2 text-amber-800 font-semibold transition-colors text-left"
                    >
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Request School ATL Quote</span>
                    </button>

                    <button
                      onClick={() => {
                        downloadCurriculumGuide();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-slate-700 transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      <span>Download ATL Syllabus (PDF)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>



          </div>

          {/* Right badge: 100% NEP 2020 Compliant */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NITI Aayog & NEP 2020 Compliant</span>
            </div>
          </div>

        </nav>

      </div>

    </header>

    {/* Native-Feeling Mobile Bottom Navigation Bar (Fixed for quick thumb reach) */}
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-15 items-center px-1">
        {/* Home Tab */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* Store / Catalog Tab */}
        <button
          onClick={() => {
            setActiveTab('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
            activeTab === 'store' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'store' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Catalog</span>
        </button>

        {/* RoboCup Hackathon Special Tab */}
        <button
          onClick={() => {
            setActiveTab('hackathon');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
            activeTab === 'hackathon' ? 'text-cyan-600 font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'hackathon' ? 'bg-cyan-100 text-cyan-700' : 'text-slate-600'}`}>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">RoboCup</span>
          <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center h-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
        </button>

        {/* Client Dashboard / Profile */}
        <button
          onClick={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {(userProfile?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[50px]">Account</span>
        </button>
      </div>
    </nav>
    </>
  );
};
