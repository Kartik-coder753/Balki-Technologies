import React, { useState, useMemo } from 'react';
import { CaseStudyBlog, Product } from '../types';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  MapPin, 
  CheckCircle2,
  Filter,
  Microscope,
  Cpu,
  Atom,
  Share2
} from 'lucide-react';
import { CaseStudyModal } from './CaseStudyModal';
import { initialCaseStudyBlogs } from '../data/blogAndReviewsData';

interface BlogSectionProps {
  caseStudies?: CaseStudyBlog[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onExploreShop: () => void;
}

// Additional scientific and laboratory articles inspired by scientifickart.com/blog
const scientificGuides: CaseStudyBlog[] = [
  {
    id: 'guide-1',
    slug: 'choosing-physics-lab-equipment-cbse-icse',
    title: 'Precision Physics Lab Equipment: Choosing Optical Benches, Prisms & Lasers for CBSE & ICSE Class 9-12',
    subtitle: 'A practical buyer guide for science educators: key tolerances, aluminum vs. steel rails, and diode laser safety standards.',
    category: 'NEP 2020 Research',
    clientOrCompany: 'Science Faculty Association & Balki Research Group',
    location: 'Ambala Cantt Scientific Manufacturing Center',
    publishedDate: 'September 2, 2026',
    readTimeMinutes: 7,
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    productsUsed: [
      {
        id: 'prod-11',
        name: 'SRROBOTICS Single Axis Solar Tracking System Hand Made 100% Working Project',
        sku: 'BALKI-EXP-11-SOLARTRK',
        category: 'physics-lab',
        image: '/products/solar_tracker_overhead.jpg',
        price: 1599
      }
    ],
    keyMetrics: [
      { label: 'Optical Tolerance', value: '±0.02mm', detail: 'Laser etched scale precision' },
      { label: 'Schools Audited', value: '180 Labs', detail: 'Physics experiment setup compliance' },
      { label: 'Eye Safety', value: 'Class 2 <1mW', detail: 'Safe 650nm classroom laser diode' }
    ],
    executiveSummary: 'Physics laboratory experiments often suffer from misaligned optical mounts and inaccurate scale markings that cause student measurement discrepancies. This comprehensive guide outlines the technical criteria for purchasing durable optical rails, high-refraction borosilicate prisms, and child-safe diode lasers that meet NEP 2020 inquiry mandates.',
    challenge: 'Secondary school physics teachers report that up to 35% of student lab practical time is wasted leveling warped optical benches and aligning wobbly lens holders.',
    solution: 'Adopting extruded anodized aluminum optical rails with leveling thumb screws and heavy-gauge zinc alloy lens carriers maintains sub-millimeter axial alignment across hundreds of student trials.',
    outcomes: [
      'Student focal length measurement error dropped from 14% to under 1.8%.',
      'Classroom setup duration reduced from 20 minutes to 3 minutes.',
      '100% compliance with CBSE Class 11 and 12 optics practical syllabus.'
    ],
    fullArticle: `## Why Optical Rail Design Dictates Practical Success
When students calculate the refractive index of glass prisms or verify the lens maker formula, structural stability is paramount. Standard optical rails often deform over years of school storage, causing lenses to tilt out of the optical axis.

## 3 Critical Evaluation Checkpoints for School Labs
1. **Extruded Aluminum with Laser-Etched Rules:** Silk-screened ink wears off after a semester of student finger friction. Laser-etched millimeter scales remain crisp for decades.
2. **Dual-Contact Upright Clamps:** Ensure each carrier features lateral set-screws rather than single top friction pins, preventing lens holders from shifting when touched.
3. **Safe Diode Illumination:** Replace antiquated incandescent bulb housing (which overheats and burns young hands) with safe, battery/USB-powered 650nm Class 2 red diode laser sources.`,
    quote: {
      text: 'Having properly calibrated optical benches transformed our optics practicals from a frustrating chore into an inspiring visual revelation for our Class 12 students.',
      author: 'Prof. Harishankar Dixit',
      role: 'Head of Physics Department, Ambala Model Senior Secondary School'
    }
  },
  {
    id: 'guide-2',
    slug: 'benefits-of-3d-anatomical-models-in-biology-labs',
    title: 'Why 3D Anatomical Models Outperform 2D Diagrams in Secondary Biology Classrooms',
    subtitle: 'Spatial comprehension, tactile organ identification, and retention rates among Classes 6-10 students using medical PVC models.',
    category: 'School Case Study',
    clientOrCompany: 'Indian Biological Sciences Curriculum Consortium',
    location: 'Bengaluru Innovation Center',
    publishedDate: 'August 14, 2026',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80',
    productsUsed: [
      {
        id: 'prod-12',
        name: 'smart irrigation soil moisture sensor arduino water pump kit',
        sku: 'BALKI-EXP-12-SMARTIRR',
        category: 'biology-anatomy',
        image: '/products/smart_irrigation_flatlay.webp',
        price: 999
      },
      {
        id: 'prod-9',
        name: 'TESTIN ELECTRONICS Smart AIR Quality Monitoring System',
        sku: 'BALKI-EXP-09-ENVIROAIR',
        category: 'sensors',
        image: '/products/environmental_station_lcd.jpg',
        price: 1799
      }
    ],
    keyMetrics: [
      { label: 'Organ Spatial Recall', value: '+240%', detail: 'Compared to textbook cross-section illustrations' },
      { label: 'Student Engagement', value: '98%', detail: 'Active participation in dissection simulations' },
      { label: 'Model Durability', value: '10+ Years', detail: 'Washable unbreakable medical-grade PVC' }
    ],
    executiveSummary: 'Understanding the relative placement, circulatory pathways, and nested structures of human organs is notoriously difficult from flat 2D diagrams. Using 55cm dual-sex anatomical torso models with 19 removable pieces allows students to physically remove, examine, and reconstruct the human organ system.',
    challenge: 'Students consistently confused the anterior and posterior positioning of the trachea, esophagus, heart chambers, and liver lobes in CBSE board exams.',
    solution: 'Equipping biology labs with medical-grade PVC anatomical torso models and 1000x dual-LED microscopes for simultaneous macroscopic and microscopic specimen study.',
    outcomes: [
      'Anatomy question accuracy on term evaluations increased by 42 percentage points.',
      'Eliminated reliance on biological animal specimens in accordance with modern ethics guidelines.',
      'Enabled cooperative small-group peer quizzes where students timed each other reassembling the human thoracic cavity.'
    ],
    fullArticle: `## The Cognitive Power of Tactile Spatial Manipulation
Educational psychology shows that multi-sensory physical interaction cements long-term spatial memories far more effectively than passive screen viewing or diagram memorization.

## Anatomy Lab Integration Best Practices
- **Step 1: Macro-to-Micro Transition:** Start by removing the human lungs and heart from the 55cm torso model to trace coronary vessels.
- **Step 2: Cellular Corroboration:** Place prepared lung and cardiac muscle tissue slides under the 1000x compound microscope so students connect organ function to cellular morphology.
- **Step 3: Numbered Organ Challenges:** Have student teams identify numbered anatomical structures using the bilingual identification key chart without referencing textbooks.`,
    quote: {
      text: 'Our students finally understand how the circulatory and respiratory systems physically weave together. The tactile element is indispensable.',
      author: 'Dr. Meenakshi Sunderam',
      role: 'Senior Biology PGT, Army Public School'
    }
  }
];

export const BlogSection: React.FC<BlogSectionProps> = ({
  caseStudies = initialCaseStudyBlogs,
  products,
  onSelectProduct,
  onAddToCart,
  onExploreShop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticleModal, setActiveArticleModal] = useState<CaseStudyBlog | null>(null);

  // Combine initial case studies with scientific guides
  const allArticles = useMemo(() => {
    return [...scientificGuides, ...caseStudies];
  }, [caseStudies]);

  const categories = [
    'All',
    'NEP 2020 Research',
    'School Case Study',
    'Industrial Prototyping',
    'Clean Tech Pilot',
    'Corporate CSR'
  ];

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Category check
      if (selectedCategory !== 'All' && article.category !== selectedCategory) {
        return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchSubtitle = article.subtitle.toLowerCase().includes(q);
        const matchClient = article.clientOrCompany.toLowerCase().includes(q);
        const matchSummary = article.executiveSummary.toLowerCase().includes(q);
        if (!matchTitle && !matchSubtitle && !matchClient && !matchSummary) {
          return false;
        }
      }
      return true;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      
      {/* Blog Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Research Lab & Scientific Case Studies"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/40 pointer-events-none" />

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KNOWLEDGE HUB, LAB GUIDES & RESEARCH PAPERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Scientific Insights & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              ATL Tinkering Case Studies
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Curated practical articles, equipment selection guides, school implementation benchmarks, and longitudinal research on experiential STEM learning across India.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, optics guides, ATL setup..."
                className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:border-amber-400/60"
          >
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-900/85 text-amber-300 border border-amber-500/30 backdrop-blur-xs">
                  {article.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {article.readTimeMinutes} min read
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {article.publishedDate}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{article.clientOrCompany}</span>
                </div>

                <h3 
                  onClick={() => setActiveArticleModal(article)}
                  className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer"
                >
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

              {/* Key Metrics Chips */}
              {article.keyMetrics && article.keyMetrics.length > 0 && (
                <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100 text-center">
                  <div className="bg-amber-50/80 rounded-xl p-2 border border-amber-100">
                    <p className="text-xs font-black text-amber-700">{article.keyMetrics[0].value}</p>
                    <p className="text-[10px] text-slate-500 truncate">{article.keyMetrics[0].label}</p>
                  </div>
                  {article.keyMetrics[1] && (
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <p className="text-xs font-black text-slate-800">{article.keyMetrics[1].value}</p>
                      <p className="text-[10px] text-slate-500 truncate">{article.keyMetrics[1].label}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticleModal(article)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-all cursor-pointer"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400">
                  {article.productsUsed?.length || 1} Products Featured
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No articles matched your criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Full Modal Viewer */}
      {activeArticleModal && (
        <CaseStudyModal
          study={activeArticleModal}
          products={products}
          onClose={() => setActiveArticleModal(null)}
          onSelectProduct={(prod) => {
            setActiveArticleModal(null);
            onSelectProduct(prod);
          }}
        />
      )}

    </div>
  );
};
