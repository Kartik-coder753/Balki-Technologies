import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Download, 
  Printer, 
  Search, 
  Layers, 
  Cpu, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  X, 
  Eye, 
  ExternalLink,
  ShoppingCart,
  Check,
  Percent,
  Boxes
} from 'lucide-react';
import { 
  ATL_QUOTATION_PACKAGES, 
  ATL_TERMS_AND_CONDITIONS, 
  ALL_ATL_LINE_ITEMS, 
  ATLQuotationPackage,
  ATLLineItem
} from '../data/atlQuotationPackagesData';
import { Product } from '../types';

interface ATLPackagesSpecialSummaryProps {
  onAddToCart?: (product: Product, quantity?: number) => void;
  openB2BModal?: () => void;
  onExploreCategory?: (category: string) => void;
}

export const ATLPackagesSpecialSummary: React.FC<ATLPackagesSpecialSummaryProps> = ({
  onAddToCart,
  openB2BModal,
  onExploreCategory
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-e');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Consumable' | 'Non-Consumable'>('All');
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [schoolNameInput, setSchoolNameInput] = useState('');
  const [addedPackageId, setAddedPackageId] = useState<string | null>(null);

  const activePackage = useMemo(() => {
    return ATL_QUOTATION_PACKAGES.find(p => p.id === selectedPackageId) || ATL_QUOTATION_PACKAGES[4];
  }, [selectedPackageId]);

  // Filtered line items for the active package
  const filteredLineItems = useMemo(() => {
    return activePackage.lineItems.filter(item => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.atlItemName.toLowerCase().includes(q);
        const matchModel = item.offeredMakeModel.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchModel && !matchCat) return false;
      }
      return true;
    });
  }, [activePackage, typeFilter, searchQuery]);

  const handleAddPackageToCart = (pkg: ATLQuotationPackage) => {
    if (!onAddToCart) return;
    const pkgProduct: Product = {
      id: pkg.id,
      name: `${pkg.code} – ${pkg.title} (${pkg.lineItemsCount} Items Complete Lab Solution)`,
      category: 'atl-packages',
      gradeLevel: 'All Grades',
      price: Math.round(pkg.subTotal),
      originalPrice: Math.round(pkg.grandTotal),
      rating: 4.95,
      reviewsCount: 160,
      stock: 25,
      minStockAlert: 2,
      sku: `BALKI-ATL-${pkg.code.replace(' ', '-')}`,
      warehouseLocation: 'Hyderabad Central Logistics Hub',
      image: pkg.id === 'pkg-d' 
        ? '/src/assets/images/printer_prototyping_kit_1792018815179.jpg'
        : pkg.id === 'pkg-c'
        ? '/src/assets/images/ai_vision_kit_1792018815040.jpg'
        : pkg.id === 'pkg-b'
        ? '/src/assets/images/robotics_automation_kit_1792018814223.jpg'
        : pkg.id === 'pkg-a'
        ? '/src/assets/images/iot_electronics_kit_1792018814258.jpg'
        : '/src/assets/images/atl_turnkey_lab_1792018813842.jpg',
      shortDesc: `${pkg.scope} Official AIM ATL Equipment Guidelines (2026) verified package. Includes all ${pkg.lineItemsCount} items with 18% GST and 12-month warranty.`,
      description: `${pkg.title} comprises ${pkg.lineItemsCount} strictly conforming items approved for Atal Tinkering Laboratories across India under NITI Aayog guidelines. Net institutional subtotal: ₹${pkg.subTotal.toLocaleString('en-IN')}, GST @ 18%: ₹${pkg.gstAmount.toLocaleString('en-IN')}, Grand Total: ₹${pkg.grandTotal.toLocaleString('en-IN')}.`,
      features: pkg.highlights,
      whatsInBox: pkg.lineItems.slice(0, 10).map(it => `${it.qty}x ${it.offeredMakeModel}`),
      nepAligned: true,
      atlCertified: true,
      warrantyMonths: 12
    };

    onAddToCart(pkgProduct, 1);
    setAddedPackageId(pkg.id);
    setTimeout(() => setAddedPackageId(null), 2500);
  };

  return (
    <section id="atl-packages-summary" className="relative rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl overflow-hidden p-6 md:p-10 space-y-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Banner */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SPECIAL MENTION · OFFICIAL ATL LAB QUOTATION SUMMARY (2026-27)</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Balki Technologies – Atal Tinkering Lab <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
              169-Item Turnkey Equipment Packages
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Strictly formulated as per NITI Aayog's <strong className="text-white">Atal Innovation Mission (AIM) ATL Equipment Guidelines (2026)</strong>. Explore all four specialized domain packages (Package A, B, C, D) and the comprehensive turnkey <strong className="text-amber-300">Package E</strong> with full bill of materials, statutory 18% GST calculations, and institution-ready quotations.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Official Quotation PDF View</span>
          </button>

          <button
            onClick={openB2BModal}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs md:text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Request School PO / Stamp</span>
          </button>
        </div>
      </div>

      {/* High-level Package Cards Grid (Executive Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {ATL_QUOTATION_PACKAGES.map((pkg) => {
          const isSelected = pkg.id === selectedPackageId;
          const isMaster = pkg.id === 'pkg-e';

          return (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`text-left p-4 rounded-2xl transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${
                    isMaster 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {pkg.code}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {pkg.lineItemsCount} Items
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {pkg.title.replace(' Equipment Package', '')}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {pkg.scope}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Grand Total (incl. 18% GST)
                </div>
                <div className="text-base font-black text-amber-300">
                  ₹{pkg.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-slate-400">
                  Sub-total: ₹{pkg.subTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Package Detailed Dossier */}
      <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 md:p-7 space-y-6">
        {/* Header of Active Package */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                {activePackage.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Quotation No: {activePackage.quotationNo}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid: 30 Days (AIM Guidelines 2026)
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white">
              {activePackage.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              {activePackage.scope}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleAddPackageToCart(activePackage)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {addedPackageId === activePackage.id ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Added {activePackage.code} to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {activePackage.code} to Cart (₹{activePackage.subTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })})</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Inspect Quotation Table</span>
            </button>
          </div>
        </div>

        {/* Financial Highlights & Package Specifications Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Sub-total (excl. GST):</span>
            <div className="text-base font-bold text-white">
              ₹{activePackage.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500">Source cost + 20% margin as per sheet</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">GST @ 18%:</span>
            <div className="text-base font-bold text-amber-400">
              ₹{activePackage.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500">Statutory input tax credit invoice</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Net Grand Total:</span>
            <div className="text-lg font-black text-emerald-400">
              ₹{activePackage.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400">Round-off: {activePackage.roundOff >= 0 ? `+₹${activePackage.roundOff.toFixed(2)}` : `-₹${Math.abs(activePackage.roundOff).toFixed(2)}`}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Line Items Scope:</span>
            <div className="text-base font-bold text-white">
              {activePackage.lineItemsCount} Materials Listed
            </div>
            <span className="text-[10px] text-slate-400 line-clamp-1">{activePackage.grandTotalWords}</span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
          {activePackage.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Search & Filter Toolbar for Package Materials */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              {activePackage.code} Bill of Materials ({filteredLineItems.length} of {activePackage.lineItemsCount}):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search component or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
              {(['All', 'Consumable', 'Non-Consumable'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    typeFilter === t
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Bill of Materials Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold sticky top-0 border-b border-slate-800 z-10">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                <th className="py-2.5 px-3">Item (as per ATL list)</th>
                <th className="py-2.5 px-3">Offered Make / Model</th>
                <th className="py-2.5 px-2.5 text-center">Type</th>
                <th className="py-2.5 px-2.5 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredLineItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No components found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredLineItems.map((item) => (
                  <tr key={`${item.packageCode}-${item.sNo}`} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {item.sNo}
                    </td>
                    <td className="py-2 px-3 font-medium text-white max-w-xs">
                      {item.atlItemName}
                    </td>
                    <td className="py-2 px-3 text-slate-300 max-w-md text-[11px]">
                      {item.offeredMakeModel}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'Non-Consumable' 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-right font-bold text-amber-400">
                      {item.qty}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-[11px]">
                      ₹{item.unitRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white text-[11px]">
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Terms */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              12-Month Onsite Warranty Included
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Pan-India Safe Dispatch: 2–3 Weeks
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Net-30 School Purchase Orders Accepted
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Auth: Balki Technologies Pvt. Ltd. | Quotation Reference: {activePackage.quotationNo}
          </div>
        </div>
      </div>

      {/* Official Quotation Modal (Print & Letterhead Format) */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header Actions */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Official ATL Lab Quotation Letterhead</h3>
                <p className="text-xs text-slate-400 font-mono">Ref: {activePackage.quotationNo} · Date: {activePackage.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Quotation</span>
                </button>
                <button
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-xs text-slate-800 print:p-0">
              {/* Header Letterhead */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">BALKI TECHNOLOGIES PVT. LTD.</h2>
                <p className="text-[11px] text-slate-600 font-medium">STEM & Robotics Education Solutions | Hyderabad, Telangana | balki.technologies@gmail.com</p>
                <div className="pt-2">
                  <span className="font-bold text-sm tracking-wide uppercase px-3 py-0.5 bg-slate-100 rounded">
                    QUOTATION – {activePackage.code.toUpperCase()} ({activePackage.title.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Institution & Reference Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-700">To:</div>
                  <div className="font-semibold text-slate-900">The Principal / Head of Institution</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500">School Name:</span>
                    <input
                      type="text"
                      placeholder="e.g. Kendriya Vidyalaya No. 1"
                      value={schoolNameInput}
                      onChange={(e) => setSchoolNameInput(e.target.value)}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium flex-1 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div className="text-slate-500">AIM ATL Lab Grant Consignment</div>
                </div>

                <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-right">
                  <div><span className="text-slate-500">Quotation No.:</span> <strong className="font-mono">{activePackage.quotationNo}</strong></div>
                  <div><span className="text-slate-500">Date:</span> <strong>{activePackage.date}</strong></div>
                  <div><span className="text-slate-500">Valid until:</span> <strong>{activePackage.validUntil}</strong></div>
                  <div><span className="text-slate-500">Reference:</span> <strong>{activePackage.reference}</strong></div>
                </div>
              </div>

              {/* Scope */}
              <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-lg border border-amber-200/80">
                <strong className="text-amber-900">Scope of Supply:</strong> {activePackage.scope}
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-2.5 text-center w-10">S.No</th>
                      <th className="py-2 px-2.5">Item (as per ATL list)</th>
                      <th className="py-2 px-2.5">Offered Make / Model</th>
                      <th className="py-2 px-2 text-center w-24">Type</th>
                      <th className="py-2 px-2 text-right w-12">Qty</th>
                      <th className="py-2 px-2.5 text-right w-24">Unit Rate (₹)</th>
                      <th className="py-2 px-2.5 text-right w-28">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activePackage.lineItems.map((item) => (
                      <tr key={`modal-${item.sNo}`} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2.5 text-center font-mono text-slate-500">{item.sNo}</td>
                        <td className="py-1.5 px-2.5 font-semibold text-slate-900">{item.atlItemName}</td>
                        <td className="py-1.5 px-2.5 text-slate-600">{item.offeredMakeModel}</td>
                        <td className="py-1.5 px-2 text-center text-slate-600">{item.type}</td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-900">{item.qty}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono">₹{item.unitRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Box */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-300">
                  <div className="flex justify-between text-slate-600">
                    <span>Sub-total (excl. GST):</span>
                    <span className="font-mono font-semibold">₹{activePackage.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST @ 18%:</span>
                    <span className="font-mono font-semibold text-amber-700">₹{activePackage.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Round-off:</span>
                    <span className="font-mono">{activePackage.roundOff >= 0 ? `+₹${activePackage.roundOff.toFixed(2)}` : `-₹${Math.abs(activePackage.roundOff).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm font-black text-slate-950">
                    <span>GRAND TOTAL (incl. GST):</span>
                    <span className="font-mono">₹{activePackage.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="bg-slate-100 p-2.5 rounded-lg text-xs font-semibold text-slate-800">
                Amount in words: <span className="font-bold text-slate-900">{activePackage.grandTotalWords}</span>
              </div>

              {/* Official Terms & Conditions */}
              <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-900 text-xs">Terms & Conditions</div>
                <ol className="list-decimal pl-4 space-y-1">
                  {ATL_TERMS_AND_CONDITIONS.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ol>
              </div>

              {/* Signature block */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Place: Hyderabad, Telangana | Date: {activePackage.date}
                </div>

                <div className="text-right space-y-6">
                  <div className="font-bold text-xs text-slate-900">For Balki Technologies Pvt. Ltd.</div>
                  <div className="text-xs text-slate-600 font-medium">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
