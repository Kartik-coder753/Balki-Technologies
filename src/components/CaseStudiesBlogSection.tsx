import React, { useState } from 'react';
import { CaseStudyBlog, Product } from '../types';
import { 
  BookOpen, 
  Clock, 
  Building2, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  ExternalLink,
  Cpu
} from 'lucide-react';

interface CaseStudiesBlogSectionProps {
  caseStudies: CaseStudyBlog[];
  products: Product[];
  onOpenStudy: (study: CaseStudyBlog) => void;
  onSelectProduct: (product: Product) => void;
}

export const CaseStudiesBlogSection: React.FC<CaseStudiesBlogSectionProps> = ({
  caseStudies,
  products,
  onOpenStudy,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'NEP 2020 Research',
    'Industrial Prototyping',
    'Clean Tech Pilot',
    'Corporate CSR',
    'School Case Study'
  ];

  const filteredStudies = caseStudies.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <section id="case-studies-blogs" className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 md:p-10 my-10 space-y-8">
      
      {/* Section Header Banner with Content-Related Background */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Content-Related Background Image */}
        <img
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Research Lab & Corporate Innovation Field Whitepapers"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research & Industry Field Whitepapers</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            STEM Studies & Corporate Innovation Blogs
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Detailed empirical studies, corporate CSR deployments, and industrial automation prototypes demonstrating how schools and companies leverage Balki STEM hardware.
          </p>
        </div>

        <div className="relative z-10 text-xs text-amber-300 font-bold bg-slate-900/80 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto">
          Showing <span className="font-black text-white">{filteredStudies.length}</span> Field Studies
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3 h-3 text-slate-400" />
          Focus:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Lead Study (First item) */}
      {filteredStudies.length > 0 && (
        <div 
          onClick={() => onOpenStudy(filteredStudies[0])}
          className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-900">
            <img
              src={filteredStudies[0].coverImage}
              alt={filteredStudies[0].title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg shadow-md">
                Featured Case Study
              </span>
              <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                {filteredStudies[0].category}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {filteredStudies[0].clientOrCompany}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {filteredStudies[0].readTimeMinutes} min read
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
                {filteredStudies[0].title}
              </h3>

              <p className="text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {filteredStudies[0].subtitle}
              </p>

              {/* Key Metrics Mini Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {filteredStudies[0].keyMetrics.slice(0, 2).map((km, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-lg font-black text-slate-900">{km.value}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{km.label}</span>
                  </div>
                ))}
              </div>

              {/* Products Deployed preview */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Products Deployed by Client:
                </span>
                <div className="flex flex-wrap gap-2">
                  {filteredStudies[0].productsUsed.map((prod) => (
                    <span
                      key={prod.id}
                      className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg font-medium"
                    >
                      <Cpu className="w-3 h-3 text-amber-600" />
                      {prod.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-600">
              <span className="flex items-center gap-1 group-hover:underline">
                <span>Read Full Research Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-slate-400 font-normal">{filteredStudies[0].publishedDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-2">
        {filteredStudies.slice(1).map((study) => (
          <div
            key={study.id}
            onClick={() => onOpenStudy(study)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                <img
                  src={study.coverImage}
                  alt={study.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {study.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {study.readTimeMinutes} min
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    {study.clientOrCompany}
                  </span>
                  <span>{study.publishedDate}</span>
                </div>

                <h4 className="text-base font-bold text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
                  {study.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {study.subtitle}
                </p>

                {/* Products Used badge tags */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Products Used:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {study.productsUsed.map((p) => (
                      <span
                        key={p.id}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md line-clamp-1 font-medium"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-amber-600 border-t border-slate-100 mt-2">
              <span className="flex items-center gap-1 group-hover:underline pt-3">
                <span>View Full Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] text-slate-400 font-normal pt-3">{study.location}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
