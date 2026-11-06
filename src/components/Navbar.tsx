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
  User
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const cornerMenuRef = useRef<HTMLDivElement>(null);

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
      if (cornerMenuRef.current && !cornerMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsMobileMenuOpen(false);
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

            {/* Corner 3-Line Menu Trigger & Dedicated Flyout Panel */}
            <div className="relative" ref={cornerMenuRef}>
              <button
                id="btn-corner-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`min-w-[42px] min-h-[42px] p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isMobileMenuOpen
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md ring-2 ring-amber-500/25'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 hover:border-slate-300'
                }`}
                aria-label="Toggle All Sections Menu"
                title="All Sections & Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-amber-400" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-800" />
                )}
              </button>

              {/* CORNER DROPDOWN POPOVER: Built right there at the corner, all sections neatly visible without scrolling */}
              {isMobileMenuOpen && (
                <>
                  {/* Subtle backdrop overlay */}
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px] transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Corner Popover Panel - Positioned directly under the 3-line button at the corner */}
                  <div 
                    className="fixed sm:absolute right-2 sm:right-0 top-[56px] sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-[410px] max-w-[430px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/95 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-slate-900/10"
                    style={{ maxHeight: 'calc(100vh - 75px)' }}
                  >
                    
                    {/* Header Strip with Emblem */}
                    <div className="px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <BalkiLogo type="icon" className="w-5 h-5" />
                        <div>
                          <span className="font-extrabold text-[11px] tracking-wider uppercase text-amber-400 block leading-tight">
                            Balki Technologies
                          </span>
                          <span className="text-[9px] text-slate-400 block leading-none">
                            All Platform Sections
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Close Menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 2-Column Compact Sections Bento Grid - Everything visible right here without scrolling! */}
                    <div className="p-2 sm:p-2.5 bg-slate-50/80 grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                      
                      {/* 1. Home */}
                      <button
                        onClick={() => {
                          setActiveTab('home');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'home'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'home' ? 'bg-white/15 text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
                          <Home className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">Home</span>
                          <span className="text-[10px] opacity-70 block truncate">Main Portal</span>
                        </div>
                      </button>

                      {/* 2. Store Catalog */}
                      <button
                        onClick={() => {
                          setActiveTab('store');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'store'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'store' ? 'bg-white/15 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">Catalog</span>
                          <span className="text-[10px] opacity-70 block truncate">1,000+ Hardware</span>
                        </div>
                      </button>

                      {/* 3. RoboCup 2027 Hackathon */}
                      <button
                        onClick={() => {
                          setActiveTab('hackathon');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'hackathon'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-xs font-bold'
                            : 'bg-gradient-to-r from-cyan-50/90 to-teal-50/70 hover:from-cyan-100 hover:to-teal-100 text-cyan-950 border-cyan-200'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'hackathon' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-700'}`}>
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold block text-xs truncate">RoboCup 2027</span>
                          <span className="text-[10px] text-amber-600 font-bold block truncate">₹10K Hackathon</span>
                        </div>
                      </button>

                      {/* 4. ATL Quotations Dossier */}
                      <button
                        onClick={() => {
                          setActiveTab('quotations');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'quotations'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'quotations' ? 'bg-white/15 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                          <Boxes className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">ATL Quotations</span>
                          <span className="text-[10px] opacity-70 block truncate">169 Line Items</span>
                        </div>
                      </button>

                      {/* 5. NEP Interactive Courses */}
                      <button
                        onClick={() => {
                          setActiveTab('courses');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'courses'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'courses' ? 'bg-white/15 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
                          <GraduationCap className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">NEP Courses</span>
                          <span className="text-[10px] opacity-70 block truncate">Simulators 3–12</span>
                        </div>
                      </button>

                      {/* 6. Equipment Rentals */}
                      <button
                        onClick={() => {
                          setActiveTab('rentals');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'rentals'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'rentals' ? 'bg-white/15 text-amber-400' : 'bg-purple-50 text-purple-600'}`}>
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">Lab Rentals</span>
                          <span className="text-[10px] opacity-70 block truncate">3D & DSOs</span>
                        </div>
                      </button>

                      {/* 7. Live Order Tracking / Account */}
                      {onOpenTracking ? (
                        <button
                          onClick={() => {
                            onOpenTracking();
                            setIsMobileMenuOpen(false);
                          }}
                          className="p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold block text-xs truncate">Track Order</span>
                            <span className="text-[10px] text-emerald-600 font-semibold block truncate">Live Consignment</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setIsMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold block text-xs truncate">Account</span>
                            <span className="text-[10px] opacity-70 block truncate">Orders & Profile</span>
                          </div>
                        </button>
                      )}

                      {/* 8. 24/7 Problem Resolvance & Helpdesk */}
                      <button
                        onClick={() => {
                          setActiveTab('contact');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'contact'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200/90 hover:border-amber-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'contact' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'}`}>
                          <LifeBuoy className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">24/7 Support</span>
                          <span className="text-[10px] opacity-70 block truncate">Help & Warranty</span>
                        </div>
                      </button>

                      {/* 9. About Us */}
                      <button
                        onClick={() => {
                          setActiveTab('about');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'about'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'about' ? 'bg-white/15 text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">About Balki</span>
                          <span className="text-[10px] opacity-70 block truncate">Heritage & Hubs</span>
                        </div>
                      </button>

                      {/* 10. Tech Blog */}
                      <button
                        onClick={() => {
                          setActiveTab('blog');
                          setIsMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'blog'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'blog' ? 'bg-white/15 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate">Tech Blog</span>
                          <span className="text-[10px] opacity-70 block truncate">Guides & News</span>
                        </div>
                      </button>

                    </div>

                    {/* Quick Institutional Action Strip */}
                    <div className="p-2.5 bg-white border-t border-slate-200 space-y-1.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            openB2BModal();
                            setIsMobileMenuOpen(false);
                          }}
                          className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>School Quote</span>
                        </button>
                        
                        <a
                          href="tel:+919071199139"
                          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call Helpline</span>
                        </a>
                      </div>

                      {currentUser && (
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="truncate max-w-[200px] text-[11px]">
                            {userProfile?.displayName || currentUser.email}
                          </span>
                          <button
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer text-xs"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>
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
