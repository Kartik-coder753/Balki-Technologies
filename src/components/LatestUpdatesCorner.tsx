import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  Building2, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Bell, 
  Rocket, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  ShoppingCart, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  X, 
  FileText, 
  Flame,
  Award,
  Truck,
  Share2,
  Calendar,
  Layers,
  Check,
  Compass
} from 'lucide-react';
import { 
  Product, 
  Course, 
  RentalEquipment, 
  CompanyUpdate, 
  UpdateType,
  NavTab 
} from '../types';
import { INITIAL_COMPANY_UPDATES, LIVE_TICKER_ITEMS } from '../data/updatesData';

interface LatestUpdatesCornerProps {
  products: Product[];
  courses?: Course[];
  rentals?: RentalEquipment[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  setActiveTab?: (tab: NavTab) => void;
  openB2BModal: () => void;
}

export const LatestUpdatesCorner: React.FC<LatestUpdatesCornerProps> = ({
  products,
  courses = [],
  rentals = [],
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  setActiveTab,
  openB2BModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | UpdateType>('all');
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);
  const [selectedUpdateForModal, setSelectedUpdateForModal] = useState<CompanyUpdate | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const updates = INITIAL_COMPANY_UPDATES;

  // Auto-cycle the live news ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Filter updates based on active category
  const filteredUpdates = activeFilter === 'all' 
    ? updates 
    : updates.filter(u => u.type === activeFilter);

  // Identify featured launch (hardware kit) and secondary stream
  const featuredLaunch = updates.find(u => u.featured) || updates[0];
  const streamUpdates = filteredUpdates.filter(u => u.id !== (activeFilter === 'all' ? featuredLaunch.id : ''));

  // Counts for filter pills
  const counts = {
    all: updates.length,
    product: updates.filter(u => u.type === 'product').length,
    course: updates.filter(u => u.type === 'course').length,
    company: updates.filter(u => u.type === 'company').length,
    rental: updates.filter(u => u.type === 'rental').length,
  };

  // Handle Action click based on update type
  const handleUpdateAction = (update: CompanyUpdate) => {
    if (update.type === 'product' && update.productId) {
      const prod = products.find(p => p.id === update.productId);
      if (prod) {
        onSelectProduct(prod);
        return;
      }
    }
    if (update.type === 'course') {
      if (setActiveTab) {
        setActiveTab('courses');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    if (update.type === 'rental') {
      if (setActiveTab) {
        setActiveTab('rentals');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    if (update.id === 'upd-robocup-hackathon') {
      if (setActiveTab) {
        setActiveTab('hackathon');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setSelectedUpdateForModal(update);
      return;
    }
    if (update.id === 'upd-atl-packages') {
      if (setActiveTab) {
        setActiveTab('quotations');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    if (update.type === 'company') {
      if (update.id === 'upd-5') {
        openB2BModal();
        return;
      }
    }
    // Default open announcement modal
    setSelectedUpdateForModal(update);
  };

  const handleTickerClick = (ticker: typeof LIVE_TICKER_ITEMS[0]) => {
    if (ticker.actionModal === 'b2b') {
      openB2BModal();
    } else if (ticker.actionTab && setActiveTab) {
      setActiveTab(ticker.actionTab as NavTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() || !subscriberEmail.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setSubscriberEmail('');
    }, 3000);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper for badge colors
  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
      case 'blue':
        return 'bg-blue-500/15 text-blue-700 border-blue-300';
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
      case 'purple':
        return 'bg-purple-500/15 text-purple-700 border-purple-300';
      case 'rose':
        return 'bg-rose-500/15 text-rose-700 border-rose-300';
      default:
        return 'bg-amber-500/15 text-amber-700 border-amber-300';
    }
  };

  const currentTicker = LIVE_TICKER_ITEMS[activeTickerIndex];

  return (
    <section id="latest-updates-corner" className="relative space-y-6 pt-2">
      
      {/* 1. Iconic Live Ticker Ribbon: Breaking Lab Announcements */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-2.5 sm:p-3 text-white shadow-md border border-amber-500/30">
        {/* Background Image with Ambient Telemetry Grid Blend */}
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
          alt="STEM Telemetry & Circuit Feed"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        />
        <div className="relative z-10 flex items-center justify-between gap-3">
          
          {/* Live Beacon */}
          <div className="flex items-center gap-2 shrink-0 pl-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>LIVE INNOVATION FEED</span>
            </span>
          </div>

          {/* Ticker Content */}
          <div 
            onClick={() => handleTickerClick(currentTicker)}
            className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer group px-2 py-0.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
              {currentTicker.badge}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 truncate group-hover:text-amber-300 transition-colors">
              {currentTicker.text}
            </p>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 shrink-0 ml-auto group-hover:translate-x-1 transition-transform">
              <span>View Update</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Manual Ticker Controls */}
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <button
              onClick={() => setActiveTickerIndex((prev) => (prev - 1 + LIVE_TICKER_ITEMS.length) % LIVE_TICKER_ITEMS.length)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Previous Headline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              {activeTickerIndex + 1}/{LIVE_TICKER_ITEMS.length}
            </span>
            <button
              onClick={() => setActiveTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Next Headline"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Latest Updates Corner Container */}
      <div className="bg-gradient-to-b from-white via-amber-50/20 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-amber-200/80 shadow-xl relative overflow-hidden">
        
        {/* Subtle Decorative STEM Laboratory Blueprint Grid Background */}
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Prototyping Laboratory Background"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-6 mix-blend-multiply pointer-events-none"
        />

        {/* Subtle Decorative Ambient Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative space-y-5 sm:space-y-6">

          {/* Section Header with Quick Indicators */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] sm:text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>WHAT'S NEW AT BALKI TECHNOLOGIES</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                <span>Latest Updates & Innovations Corner</span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Updated Sept 2026
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Explore newly launched STEM laboratory hardware, certified NEP 2020 interactive courses, equipment rentals, and institutional partnerships built for India's 50,000+ Atal Tinkering Labs.
              </p>
            </div>

            {/* Quick Metrics Badges with Ambient Visual Imagery */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0 text-xs font-semibold">
              <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-white border border-amber-200/80 shadow-2xs text-slate-700 flex items-center gap-2 group flex-1 sm:flex-initial">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80"
                  alt="AI Robotics Background"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform"
                />
                <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold">Latest Hardware</p>
                  <p className="text-xs font-extrabold text-slate-900">AI Robotics Kit</p>
                </div>
              </div>

              <div className="relative overflow-hidden px-3 py-2 rounded-2xl bg-white border border-blue-200/80 shadow-2xs text-slate-700 flex items-center gap-2 group flex-1 sm:flex-initial">
                <img
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=400&q=80"
                  alt="Classroom Lab Background"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform"
                />
                <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">New NEP Course</p>
                  <p className="text-xs font-extrabold text-slate-900">Robotics & CAD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>All Updates</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-white font-mono">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('product')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'product'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>Hardware Launches</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-mono">
                {counts.product}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('course')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'course'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span>Interactive Courses</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-mono">
                {counts.course}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('company')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'company'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Company Milestones & GeM</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {counts.company}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('rental')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'rental'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>Equipment Rentals</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-mono">
                {counts.rental}
              </span>
            </button>
          </div>

          {/* 3. Showcase Grid: Featured Spotlight on Left + Stream on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Featured Major Headline Spotlight (5 Cols) */}
            {activeFilter === 'all' && (
              <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/40 relative overflow-hidden flex flex-col justify-between group">
                
                {/* Visual Ambient Glow & Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
                <img
                  src={featuredLaunch.image}
                  alt={featuredLaunch.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Top Ribbons */}
                <div className="relative z-20 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      <span>{featuredLaunch.badge}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{featuredLaunch.date}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {featuredLaunch.title}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {featuredLaunch.subtitle}
                  </p>
                </div>

                {/* Middle: Highlights */}
                <div className="relative z-20 my-6 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {featuredLaunch.description}
                  </p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {featuredLaunch.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-slate-800/90 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                      Classes 11–12
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      DGCA & NITI Aayog Framework
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      In Stock: Ambala & Hyderabad Hubs
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="relative z-20 pt-4 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateAction(featuredLaunch)}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{featuredLaunch.actionText}</span>
                    </button>

                    <button
                      onClick={() => setSelectedUpdateForModal(featuredLaunch)}
                      className="w-full py-2.5 px-3 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Read Full Story</span>
                    </button>
                  </div>

                  {featuredLaunch.productId && onAddToCart && (
                    <button
                      onClick={() => {
                        const p = products.find(prod => prod.id === featuredLaunch.productId);
                        if (p) onAddToCart(p, 1);
                      }}
                      className="w-full py-1.5 text-center text-[11px] text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Direct Add to Lab Cart (₹12,499)</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* RIGHT: Grid of All Active Updates (7 Cols if featured, 12 Cols if filtered) */}
            <div className={`${activeFilter === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streamUpdates.map((update) => {
                  const isProduct = update.type === 'product';
                  const isCourse = update.type === 'course';
                  const isRental = update.type === 'rental';
                  const isCompany = update.type === 'company';

                  return (
                    <div
                      key={update.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all hover:border-amber-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        
                        {/* Thumbnail & Badges */}
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                          <img
                            src={update.image}
                            alt={update.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xs ${getBadgeClass(update.badgeColor)}`}>
                              {update.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                            {update.date}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h4 
                            onClick={() => setSelectedUpdateForModal(update)}
                            className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-amber-700 cursor-pointer transition-colors line-clamp-2"
                          >
                            {update.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                            {update.subtitle}
                          </p>
                        </div>

                        {/* Short Description */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {update.description}
                        </p>

                        {/* Highlight Pill list */}
                        <div className="space-y-1 pt-1">
                          {update.highlights.slice(0, 2).map((h, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="truncate">{h}</span>
                            </div>
                          ))}
                        </div>

                      </div>

                      {/* Card Bottom CTA */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleUpdateAction(update)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          {isProduct && <Eye className="w-3.5 h-3.5" />}
                          {isCourse && <GraduationCap className="w-3.5 h-3.5" />}
                          {isRental && <Clock className="w-3.5 h-3.5" />}
                          {isCompany && <Building2 className="w-3.5 h-3.5" />}
                          <span>{update.actionText}</span>
                        </button>

                        <button
                          onClick={() => setSelectedUpdateForModal(update)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Read full announcement"
                          aria-label="Read full announcement"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* 4. Interactive Bottom Bar: Never Miss an Innovation Alert Box */}
          <div className="relative mt-6 pt-6 border-t border-slate-200/80 rounded-2xl p-5 md:p-6 overflow-hidden bg-slate-950 text-white shadow-lg border border-amber-500/30">
            {/* Authentic STEM Innovation Laboratory Background */}
            <img
              src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1400&q=80"
              alt="ATL Tinkering Laboratory Background"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                    <span>Get Notified When New ATL Kits or Syllabus Modules Launch</span>
                    <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-400 text-slate-950">Quarterly Digest</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Join 1,200+ STEM teachers, ATL coordinators, and principals receiving quarterly syllabus release notes and early procurement pricing.
                  </p>
                </div>
              </div>

              {/* Subscribe Input Form */}
              <form onSubmit={handleSubscribe} className="w-full md:w-auto">
                {isSubscribed ? (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Subscribed! You'll receive priority launch updates.</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-96">
                    <input
                      type="email"
                      required
                      placeholder="Enter school or teacher email..."
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-slate-900 min-h-[42px]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shrink-0 transition-colors shadow-md cursor-pointer min-h-[42px] flex items-center justify-center"
                    >
                      Notify Me
                    </button>
                  </div>
                )}
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* 5. Detailed Update Announcement Modal */}
      {selectedUpdateForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header Cover */}
            <div className="relative aspect-video max-h-64 w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedUpdateForModal.image}
                alt={selectedUpdateForModal.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedUpdateForModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition-colors"
                aria-label="Close Announcement"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeClass(selectedUpdateForModal.badgeColor)}`}>
                  {selectedUpdateForModal.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                  {selectedUpdateForModal.title}
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  {selectedUpdateForModal.subtitle} • Released {selectedUpdateForModal.date}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-slate-700">
              
              {/* Executive Overview */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider text-amber-700">
                  Official Announcement
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {selectedUpdateForModal.announcementDetails?.fullStory || selectedUpdateForModal.description}
                </p>
              </div>

              {/* Impact on Schools & Teachers */}
              {selectedUpdateForModal.announcementDetails?.impactOnSchools && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Impact for Schools, Educators & Students:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedUpdateForModal.announcementDetails.impactOnSchools.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specifications */}
              {selectedUpdateForModal.announcementDetails?.technicalHighlights && (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span>Technical Highlights & Certifications:</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedUpdateForModal.announcementDetails.technicalHighlights.map((tech, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Quote */}
              {selectedUpdateForModal.announcementDetails?.officialQuote && (
                <div className="relative overflow-hidden p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
                    alt="Telemetry Pattern"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none"
                  />
                  <div className="relative z-10">
                    <p className="italic text-xs text-slate-200">
                      "{selectedUpdateForModal.announcementDetails.officialQuote.text}"
                    </p>
                    <div className="text-[11px] text-amber-400 font-bold mt-1">
                      — {selectedUpdateForModal.announcementDetails.officialQuote.author}, {selectedUpdateForModal.announcementDetails.officialQuote.designation}
                    </div>
                  </div>
                </div>
              )}

              {/* Key Bullet Highlights */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">Features & Key Specs:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedUpdateForModal.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Update'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUpdateForModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const u = selectedUpdateForModal;
                    setSelectedUpdateForModal(null);
                    handleUpdateAction(u);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{selectedUpdateForModal.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
