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
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
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
        <div className="relative px-6 py-12 md:px-12 md:py-16 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official ATL & NEP 2020 Lab Hardware Partner</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            India's Most Complete <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Grade-Progressive STEM Kits
            </span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
            From Junior magnetic circuits in Classes 3–5 to Autonomous Quadcopters and 3D CAD in Classes 11–12. Standardizing hands-on engineering across India's 50,000+ Atal Tinkering Labs with free installation, teacher training, and warranty.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={openB2BModal}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg hover:shadow-amber-600/30 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Request School ATL Quotation</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('grade-kits');
              }}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Explore Grade 3–12 Kits
            </button>
          </div>

          {/* Value Props Bar */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>12-Month Onsite Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pan-India Safe Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>NEP 2020 Competency Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Educator Training</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Anchor Jump Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 px-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          Explore Homepage:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="#robocup-special-mention"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black border border-amber-400 hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>ROBOCUP 2027 Hackathon (Brochure & QR Form)</span>
          </a>

          <a
            href="#flagship-spotlight"
            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Flagship Lab Spotlight</span>
          </a>

          <a
            href="#products-catalog"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-500" />
            <span>Full Hardware Catalog ({products.length})</span>
          </a>

          <a
            href="#client-reviews"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>School Reviews (340+)</span>
          </a>

          <a
            href="#case-studies-blogs"
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Industry Studies & Blogs</span>
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
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Complete STEM Hardware Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Robotics kits, IoT sensors, electronic prototyping components, and equipment
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {filteredProducts.length} Products Found
          </span>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Grade Level Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Grade Level:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
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
          <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500"
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-400 text-base font-semibold">No STEM products match your current filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedGrade('All Grades');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500/40 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image Box */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {product.gradeLevel}
                    </span>
                    {product.atlCertified && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        ATL Standard
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
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
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">SKU: {product.sku}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal ml-1">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-600 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Specs</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
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

