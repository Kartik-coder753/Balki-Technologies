import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  PhoneCall, 
  Mail, 
  Award,
  HelpCircle,
  Sparkles,
  Boxes
} from 'lucide-react';
import { ATLPackagesSpecialSummary } from './ATLPackagesSpecialSummary';
import { Product, NavTab, ProductCategory } from '../types';
import { downloadCurriculumGuide } from '../utils/downloadHelpers';

interface QuotationsSectionProps {
  onAddToCart?: (product: Product, quantity?: number) => void;
  openB2BModal: () => void;
  setActiveTab: (tab: NavTab) => void;
  onExploreCategory?: (category: ProductCategory) => void;
}

export const QuotationsSection: React.FC<QuotationsSectionProps> = ({
  onAddToCart,
  openB2BModal,
  setActiveTab,
  onExploreCategory
}) => {
  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Return to Store Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
          <button 
            onClick={() => setActiveTab('home')}
            className="hover:text-amber-600 transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => setActiveTab('store')}
            className="hover:text-amber-600 transition-colors font-medium cursor-pointer"
          >
            Hardware Store
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">ATL Quotations Dossier</span>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
          <button
            onClick={() => setActiveTab('store')}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </button>

          <button
            onClick={openB2BModal}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs cursor-pointer min-h-[40px]"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Request School Quote</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
            <Boxes className="w-3.5 h-3.5" />
            <span>COMPREHENSIVE INSTITUTIONAL LAB PROCUREMENT</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Official Atal Tinkering Lab (ATL) <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
              169-Product Quotation Dossier
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Designed to give school administrators, trustees, Atal Tinkering Lab coordinators, and procurement officers 100% itemized transparency. Every component is rigorously aligned with NITI Aayog's Atal Innovation Mission (AIM) 2026 guidelines, with individual line-item specifications, quantities, verified unit rates, HSN codes, and statutory 18% GST schedules.
          </p>

          {/* Quick Institutional Stats Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-amber-400">169 Items</div>
              <div className="text-[11px] text-slate-400 font-medium">Verified Lab Hardware</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-white">5 Packages</div>
              <div className="text-[11px] text-slate-400 font-medium">Packages A, B, C, D & Turnkey E</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100% AIM</div>
              <div className="text-[11px] text-slate-400 font-medium">NITI Aayog Compliant</div>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-black text-blue-400">12 Months</div>
              <div className="text-[11px] text-slate-400 font-medium">Zero-Hassle Replacement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detailed Quotation Dossier & Interactive Package Selector */}
      <div id="full-quotation-dossier">
        <ATLPackagesSpecialSummary
          onAddToCart={onAddToCart}
          openB2BModal={openB2BModal}
          onExploreCategory={onExploreCategory}
        />
      </div>

      {/* Institutional FAQ & Procurement Support Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Procurement & Compliance Guidelines</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              School Laboratory Procurement FAQs
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => downloadCurriculumGuide()}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download AIM Guidelines PDF</span>
            </button>
            <button
              onClick={openB2BModal}
              className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center justify-center min-h-[40px] cursor-pointer"
            >
              Contact Lab Procurement Officer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Are quotations NITI Aayog compliant?</span>
            </div>
            <p className="leading-relaxed">
              Yes. Every single item code, specification, and quantity directly matches the equipment schedules prescribed under the Atal Innovation Mission (AIM) framework for 2026-27.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Can we buy individual packages?</span>
            </div>
            <p className="leading-relaxed">
              Absolutely. Schools can procure Package A (Electronics & IoT), Package B (Robotics), Package C (AI/ML & VR), or Package D (3D Printing) individually, or the Turnkey Package E which includes all 169 items with bundled onsite educator training.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>What is the delivery timeline?</span>
            </div>
            <p className="leading-relaxed">
              Consignments are securely crated and dispatched from our primary regional logistics hubs within 7–14 working days of receiving an official School Purchase Order (PO).
            </p>
          </div>
        </div>

        {/* Institutional Contact Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Have Questions Regarding Lab Tender or GeM PO?</h4>
              <p className="text-xs text-slate-600">Our senior educational lab engineers assist principals and ATL in-charges directly.</p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 shrink-0">
            <a
              href="tel:+919071199139"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center min-h-[40px] flex items-center justify-center cursor-pointer"
            >
              Call +91-9071199139
            </a>
            <button
              onClick={openB2BModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-2xs text-center min-h-[40px] flex items-center justify-center cursor-pointer"
            >
              Request Custom PO
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
