import React, { useState, useMemo } from 'react';
import { 
  Product, 
  ProductCategory, 
  GradeLevel,
  ClientReview,
  CaseStudyBlog
} from '../types';
import { 
  CheckCircle2, 
  Star, 
  ShoppingCart, 
  Eye, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Building2, 
  SlidersHorizontal,
  Zap,
  BookOpen,
  GraduationCap,
  Boxes
} from 'lucide-react';
import { Course, RentalEquipment, NavTab } from '../types';
import { FeaturedProductSpotlight } from './FeaturedProductSpotlight';
import { ClientReviewsHub } from './ClientReviewsHub';
import { CaseStudiesBlogSection } from './CaseStudiesBlogSection';
import { CaseStudyModal } from './CaseStudyModal';
import { LatestUpdatesCorner } from './LatestUpdatesCorner';
import { RobocupSpecialMentionSection } from './RobocupSpecialMentionSection';
import { initialClientReviews, initialCaseStudyBlogs } from '../data/blogAndReviewsData';

interface StoreSectionProps {
  products: Product[];
  courses?: Course[];
  rentals?: RentalEquipment[];
  reviews?: ClientReview[];
  caseStudies?: CaseStudyBlog[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  searchQuery: string;
  openB2BModal: () => void;
  onAddReview?: (review: ClientReview) => void;
  initialCategory?: ProductCategory;
  setActiveTab?: (tab: NavTab) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  products,
  courses = [],
  rentals = [],
  reviews = initialClientReviews,
  caseStudies = initialCaseStudyBlogs,
  onAddToCart,
  onSelectProduct,
  onBuyNow,
  searchQuery,
  openB2BModal,
  onAddReview,
  initialCategory = 'all',
  setActiveTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('All Grades');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeStudyModal, setActiveStudyModal] = useState<CaseStudyBlog | null>(null);

  // Sync category if initialCategory changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Flagship product (Package E or flagship kit)
  const flagshipProduct = useMemo(() => {
    return products.find(p => p.id === 'pkg-prod-e') || products[0];
  }, [products]);

  const categories = useMemo((): { id: ProductCategory; label: string }[] => [
    { id: 'all', label: `All Catalog (${products.length})` },
    { id: 'atl-packages', label: `ATL Turnkey Lab Packages (${products.filter(p => p.category === 'atl-packages').length})` },
    { id: 'microcontrollers', label: `Microcontrollers & IoT (${products.filter(p => p.category === 'microcontrollers').length})` },
    { id: 'sensors', label: `Sensors & Measurement (${products.filter(p => p.category === 'sensors').length})` },
    { id: 'robotics-mechanics', label: `Robotics & Actuators (${products.filter(p => p.category === 'robotics-mechanics').length})` },
    { id: 'drone-3d', label: `3D Printing & Drones (${products.filter(p => p.category === 'drone-3d').length})` },
    { id: 'physics-lab', label: `Physics & Solar Systems (${products.filter(p => p.category === 'physics-lab').length})` },
    { id: 'biology-anatomy', label: `Biotech & Smart Agri (${products.filter(p => p.category === 'biology-anatomy').length})` },
    { id: 'grade-kits', label: `Grade-Progressive Kits (${products.filter(p => p.category === 'grade-kits').length})` },
    { id: 'chemistry-lab', label: `Chemistry Lab (${products.filter(p => p.category === 'chemistry-lab').length})` },
    { id: 'microscopes-optics', label: `Microscopes & Optics (${products.filter(p => p.category === 'microscopes-optics').length})` },
    { id: 'mathematics-lab', label: `Math & Geometry (${products.filter(p => p.category === 'mathematics-lab').length})` },
  ], [products]);

  const grades: GradeLevel[] = [
    'All Grades',
    'Class 3-5',
    'Class 6-8',
    'Class 9-10',
    'Class 11-12'
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (product.category !== selectedCategory) {
            return false;
          }
        }
        // Grade filter
        if (selectedGrade !== 'All Grades' && product.gradeLevel !== selectedGrade && product.gradeLevel !== 'All Grades') {
          return false;
        }
        // In-stock only
        if (inStockOnly && product.stock <= 0) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (product?.name?.toLowerCase() || '').includes(q);
          const matchDesc = (product?.shortDesc?.toLowerCase() || '').includes(q);
          const matchSku = (product?.sku?.toLowerCase() || '').includes(q);
          if (!matchName && !matchDesc && !matchSku) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default order
      });
  }, [products, selectedCategory, selectedGrade, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        {/* Immersive Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Innovation Laboratory"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/35 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
        <div className="relative px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16 max-w-5xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 max-w-full truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Official ATL & NEP 2020 Lab Hardware Partner</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            India's Most Complete <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Grade-Progressive STEM Kits
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
            From Junior magnetic circuits in Classes 3–5 to Autonomous Quadcopters and 3D CAD in Classes 11–12. Standardizing hands-on engineering across India's 50,000+ Atal Tinkering Labs with free installation, teacher training, and warranty.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={openB2BModal}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Request School ATL Quotation</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('grade-kits');
                const el = document.getElementById('products-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center min-h-[44px] cursor-pointer"
            >
              Explore Grade 3–12 Kits
            </button>
          </div>

          {/* Value Props Bar */}
          <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">12-Month Onsite Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Pan-India Safe Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">NEP 2020 Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Free Educator Training</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Anchor Jump Bar - Responsive Touch Carousel on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 px-3 sm:px-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs scroll-smooth touch-pan-x">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline shrink-0">
          Explore:
        </span>
        <div className="flex items-center gap-2 text-xs shrink-0">
          <a
            href="#robocup-special-mention"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black border border-amber-400 hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>ROBOCUP 2027 Hackathon (Brochure & Form)</span>
          </a>

          <a
            href="#flagship-spotlight"
            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Flagship Lab</span>
          </a>

          <a
            href="#products-catalog"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
            <span>Catalog ({products.length})</span>
          </a>

          <a
            href="#client-reviews"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>School Reviews</span>
          </a>

          <a
            href="#case-studies-blogs"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Case Studies</span>
          </a>
        </div>
      </div>

      {/* Special Mention Section: National ROBOCUP Hackathon 2026-27 (Coming Soon — Be Ready For Updates!) */}
      <RobocupSpecialMentionSection
        setActiveTab={setActiveTab}
        onExploreCategory={(cat) => setSelectedCategory(cat as ProductCategory)}
        openB2BModal={openB2BModal}
      />

      {/* Latest Updates Corner - Eye-Catching New Products, Courses & Company Introductions */}
      <LatestUpdatesCorner
        products={products}
        courses={courses}
        rentals={rentals}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        setActiveTab={setActiveTab}
        openB2BModal={openB2BModal}
      />

      {/* 1. Big Major Product Spotlight Section */}
      {flagshipProduct && (
        <FeaturedProductSpotlight
          flagshipProduct={flagshipProduct}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onSelectProduct={onSelectProduct}
          openB2BModal={openB2BModal}
        />
      )}

      {/* 2. Products Catalog & Filters */}
      <div id="products-catalog" className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Complete STEM Hardware Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Robotics kits, IoT sensors, electronic prototyping components, and equipment
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 shrink-0 self-start sm:self-auto">
            {filteredProducts.length} Products Found
          </span>
        </div>

        {/* Category Pill Filters - Smooth Horizontal Swipe on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 scroll-smooth touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 min-h-[38px] flex items-center cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub-Filters: Grade Level & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Grade Level Selector */}
          <div className="w-full sm:w-auto flex flex-col xs:flex-row xs:items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Grade:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 touch-pan-x">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    selectedGrade === grade
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & In-Stock Switch */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - Single Column on Mobile (<500px), 2-Col on Tablet/Landscape (500px-1023px), 3-Col on Laptop (1024px-1279px), 4-Col on Desktop (1280px+) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
          <p className="text-slate-400 text-sm sm:text-base font-semibold">No STEM products match your current filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGrade('All Grades');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500/40 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group w-full"
            >
              <div>
                {/* Image Box */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/aistudio/1_08ee71b2.webp';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {product.gradeLevel}
                    </span>
                    {product.atlCertified && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        ATL Standard
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5 z-10">
                    {product.stock <= 5 && product.stock > 0 ? (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs animate-pulse">
                        Only {product.stock} left
                      </span>
                    ) : product.stock === 0 ? (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Out of Stock
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono truncate max-w-[140px]">SKU: {product.sku}</span>
                    <div className="flex items-center text-amber-500 font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal ml-1">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors min-h-[2.5rem]"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-1 pt-2">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all min-h-[40px] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Specs</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all min-h-[40px] cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* 3. Verified Registered Client Reviews Section */}
      <ClientReviewsHub
        products={products}
        onSelectProduct={onSelectProduct}
      />

      {/* 4. Field Studies & Corporate Innovation Blogs */}
      <CaseStudiesBlogSection
        caseStudies={caseStudies}
        products={products}
        onOpenStudy={(study) => setActiveStudyModal(study)}
        onSelectProduct={onSelectProduct}
      />

      {/* 5. Reader Modal for Case Studies */}
      {activeStudyModal && (
        <CaseStudyModal
          study={activeStudyModal}
          onClose={() => setActiveStudyModal(null)}
          products={products}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onSelectProduct={onSelectProduct}
        />
      )}
    </div>
  );
};

