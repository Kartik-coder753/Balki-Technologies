import React, { useState } from 'react';
import { CaseStudyBlog, Product } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Download, 
  CheckCircle2, 
  Share2, 
  ArrowRight, 
  ShoppingCart, 
  Zap, 
  Quote, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { downloadCaseStudyPdf } from '../utils/downloadHelpers';

interface CaseStudyModalProps {
  study: CaseStudyBlog | null;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  products,
  onAddToCart,
  onBuyNow,
  onSelectProduct
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!study) return null;

  const handleDownload = () => {
    downloadCaseStudyPdf(study);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {study.category}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">•</span>
            <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {study.readTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{shareSuccess ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{downloadSuccess ? 'PDF Prepared!' : 'Download Case Study'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          
          {/* Title & Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                {study.clientOrCompany}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {study.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {study.publishedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              {study.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              {study.subtitle}
            </p>
          </div>

          {/* Cover Visual */}
          <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-slate-900 shadow-md">
            <img
              src={study.coverImage}
              alt={study.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl p-5 shadow-sm">
            {study.keyMetrics.map((m, idx) => (
              <div key={idx} className="space-y-0.5 border-r border-slate-800/80 last:border-none pr-3">
                <span className="block text-2xl font-black text-amber-400">{m.value}</span>
                <span className="block text-xs font-bold text-slate-200">{m.label}</span>
                <span className="block text-[11px] text-slate-400 leading-snug">{m.detail}</span>
              </div>
            ))}
          </div>

          {/* Executive Summary */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
              Executive Summary
            </span>
            <p className="text-sm text-slate-800 leading-relaxed">
              {study.executiveSummary}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                The Core Challenge
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {study.challenge}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 block">
                The Balki STEM Solution
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {study.solution}
              </p>
            </div>
          </div>

          {/* Measured Outcomes */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Key Measurable Outcomes & Field Results
            </h3>
            <div className="space-y-2">
              {study.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200/80 p-3.5 rounded-xl text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Markdown-style Article Body */}
          <div className="space-y-4 pt-4 border-t border-slate-200 text-slate-700 text-sm leading-relaxed">
            {study.fullArticle.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-slate-900 pt-3">
                    {paragraph.replace('## ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                    {listItems.map((li, i) => (
                      <li key={i}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Quote Block */}
          {study.quote && (
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-5 space-y-2">
              <Quote className="w-6 h-6 text-amber-500/40 absolute top-3 right-4" />
              <p className="text-sm font-medium italic text-slate-800">
                "{study.quote.text}"
              </p>
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">{study.quote.author}</span> — {study.quote.role}
              </div>
            </div>
          )}

          {/* Products Utilized Showcase */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 block">
                Products Deployed in this Study
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Official Hardware Utilized by {study.clientOrCompany}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.productsUsed.map((pUsed) => {
                const fullProd = products.find((p) => p.id === pUsed.id || p.sku === pUsed.sku);

                return (
                  <div
                    key={pUsed.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 p-4 bg-slate-50 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={pUsed.image}
                        alt={pUsed.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400">SKU: {pUsed.sku}</span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {pUsed.name}
                        </h4>
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{pUsed.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-200/80">
                      {fullProd && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProduct(fullProd);
                          }}
                          className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-lg text-center"
                        >
                          Specs
                        </button>
                      )}

                      {fullProd && (
                        <button
                          onClick={() => onAddToCart(fullProd, 1)}
                          className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}

                      {fullProd && (
                        <button
                          onClick={() => onBuyNow(fullProd, 1)}
                          className="py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Buy</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-medium">
            Interested in deploying a similar STEM setup at your institution?
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-slate-300 hover:bg-white text-slate-700 font-semibold rounded-xl"
            >
              Download PDF Summary
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
            >
              Continue Exploring
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
