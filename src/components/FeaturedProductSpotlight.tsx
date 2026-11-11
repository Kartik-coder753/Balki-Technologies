import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Wrench, 
  Cpu, 
  ShoppingCart, 
  Zap, 
  Building2, 
  Star, 
  FileText,
  Clock,
  ArrowRight,
  PackageCheck,
  Download
} from 'lucide-react';
import { downloadCurriculumGuide, downloadProductDatasheet } from '../utils/downloadHelpers';

interface FeaturedProductSpotlightProps {
  flagshipProduct: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  openB2BModal: () => void;
}

export const FeaturedProductSpotlight: React.FC<FeaturedProductSpotlightProps> = ({
  flagshipProduct,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  openB2BModal
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'curriculum' | 'services' | 'specs'>('packages');

  const packagesInfo = [
    {
      pkg: 'Series 1: Pro-Range Autonomous Rovers',
      desc: 'Bluetooth smartphone car control, hand-glove gesture robotics, sonar obstacle avoiders, and optical line tracking rovers.',
      badge: 'Classes 6–10'
    },
    {
      pkg: 'Series 2: Clean Tech & Bio-Automation',
      desc: 'Active single-axis solar sun tracking, smart automated soil moisture irrigation pumps, and touchless sanitizers.',
      badge: 'Green Energy'
    },
    {
      pkg: 'Series 3: Advanced Mechatronics & Autonomous Robotics',
      desc: 'Inverted pendulum self-balancing robots, 4-DOF web-controlled robotic arms, and autonomous LiDAR navigation rovers.',
      badge: 'Classes 9–12'
    },
    {
      pkg: 'Series 4: Problem Solving & Smart City Sensors',
      desc: 'Algorithmic maze-solving competitive rovers, ENVIROSENSE OLED air quality monitors, and automatic smart dustbins.',
      badge: 'ATL Hackathon'
    }
  ];

  const curriculumHighlights = [
    '24 Structured Hands-on STEM Activity Modules mapped to CBSE & ICSE syllabus',
    'Grade-progression pathway: Visual block coding (Scratch) → Embedded C++ → MicroPython',
    'Aligned with NEP 2020 Section 4.25 mandates on mandatory design thinking in schools',
    'Includes 4 Teacher Master Guides + 40 Student Project Workbooks with QR video links'
  ];

  const turnkeyServices = [
    { title: 'Free Onsite Lab Installation', desc: 'Balki certified field engineers set up workbenches, calibrate instruments, and organize storage bins.' },
    { title: '30-Hour Certified Educator Training', desc: 'Comprehensive hybrid training for up to 5 school science faculty with accredited mentor certification.' },
    { title: '12-Month Onsite Doorstep Replacement', desc: 'Any defective module or burnt IC is swapped within 48 hours via our regional express depots.' },
    { title: 'School PO & Net-30 Billing Support', desc: 'Compliant with Government GeM norms, school management committees, and GST input tax credit.' }
  ];

  return (
    <section id="flagship-spotlight" className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-lg overflow-hidden my-6 sm:my-10">
      {/* Decorative Top Banner */}
      <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs font-semibold overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80"
          alt="Hardware Prototyping Showcase"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        />
        <div className="relative z-10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin-slow shrink-0" />
          <span className="tracking-wide uppercase font-extrabold text-[10px] sm:text-[11px]">Flagship Institutional Showcase</span>
          <span className="hidden sm:inline-block text-amber-200">•</span>
          <span className="hidden sm:inline-block text-amber-100">Official NITI Aayog ATL Package (P1–P4)</span>
        </div>
        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold">100% NEP 2020</span>
          <span className="bg-white text-slate-950 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold">340+ Labs Active</span>
        </div>
      </div>

      <div className="p-4 sm:p-8 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Visuals & Live Product Card */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group aspect-4/3">
              <img
                src={flagshipProduct.image}
                alt={flagshipProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              {/* Badges on Image */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  India's #1 ATL Setup Kit
                </span>
                <span className="bg-slate-900/90 text-white font-medium text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-slate-700 self-start">
                  SKU: {flagshipProduct.sku}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white z-10">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-white ml-1.5 font-extrabold text-[11px] sm:text-xs">4.9 / 5.0</span>
                  <span className="text-slate-300 font-normal text-[10px] sm:text-xs">(142 schools)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2">
                  Complete turnkey lab solution with over 350+ modular components, microcontrollers, mechanical chassis, and teacher training.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bento */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-3">
                <span className="block text-base sm:text-lg font-black text-slate-900">350+</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Components</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-3">
                <span className="block text-base sm:text-lg font-black text-slate-900">40+</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Sensors & ICs</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-3">
                <span className="block text-base sm:text-lg font-black text-amber-600">12 Mo.</span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Onsite Warranty</span>
              </div>
            </div>

            {/* Client Testimonial Snippet */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Principal's Review:</span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">KVS Delhi Cantt</span>
              </div>
              <p className="italic text-slate-600">
                "Standardized our entire school ATL in one go. Over 850 students actively building working IoT and robotics projects within two weeks."
              </p>
              <p className="text-[10px] text-slate-500 font-medium text-right">— Dr. Sunita Rao, Senior Physics PGT & ATL Lead</p>
            </div>
          </div>

          {/* Right Column: Detailed Description & Interactive Deep-Dive */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] tracking-wide uppercase">
                  Flagship Lab Architecture
                </span>
                <span className="text-xs text-slate-400 font-medium">Suitable for All Grades (Class 3–12)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {flagshipProduct.name}
              </h2>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                The definitive national standard for school Atal Tinkering Labs and university innovation incubators. 
                Engineered specifically to fulfill NITI Aayog ATL guidelines and NEP 2020 experiential learning mandates. 
                Delivered in durable, color-coded stackable industrial totes with verified bilingual educator curriculum.
              </p>
            </div>

            {/* Interactive Feature Tabs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'packages'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Packages P1–P4</span>
                </button>

                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'curriculum'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>NEP 2020 Curriculum</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'services'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Onsite Setup & Training</span>
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Full Hardware Specs</span>
                </button>
              </div>

              {/* Tab 1: Packages */}
              {activeTab === 'packages' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {packagesInfo.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{p.pkg}</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Curriculum */}
              {activeTab === 'curriculum' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Grade-Progressive Pedagogy Highlights:</span>
                    </span>
                    <button
                      id="btn-download-syllabus-tab"
                      onClick={() => downloadCurriculumGuide()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Syllabus (PDF)</span>
                    </button>
                  </div>
                  {curriculumHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <button
                      onClick={() => downloadCurriculumGuide()}
                      className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-600" />
                      <span>Download Complete NEP 2020 ATL 36-Week Lesson Plans & Syllabus (PDF/HTML)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Turnkey Services */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {turnkeyServices.map((s, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">{s.title}</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Specs */}
              {activeTab === 'specs' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Microcontrollers & ICs:</span>
                      <p className="text-[11px] text-slate-600">Uno R3 (ATmega328P), ESP32 Dual-Core Wi-Fi/BT, ATmega2560 Pro, Raspberry Pi interface header compatible.</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Sensors Included:</span>
                      <p className="text-[11px] text-slate-600">Ultrasonic HC-SR04, DHT11 Temp/Humidity, PIR Motion, IR Obstacle, Sound, LDR, Capacitive Touch, Gyro MPU6050.</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Storage & Packaging:</span>
                      <p className="text-[11px] text-slate-600">4 Heavy-duty modular interlocking stackable crates with anti-static foam cutouts and barcode tracking tags.</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Compliance & Warranty:</span>
                      <p className="text-[11px] text-slate-600">CE, RoHS, ESD Safe Certified. 12-Month no-questions-asked replacement warranty with doorstep technician dispatch.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price, Stock & Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      ₹{flagshipProduct.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through">
                      ₹{flagshipProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Save ₹{(flagshipProduct.originalPrice - flagshipProduct.price).toLocaleString('en-IN')} (23% Off)
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-1">
                    Inclusive of 18% GST (₹{(flagshipProduct.price * 0.18 / 1.18).toFixed(0)} ITC claimable) • Free Insured Pan-India Transit
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200">
                    <PackageCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>In Stock ({flagshipProduct.stock} Units)</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <button
                  onClick={() => onAddToCart(flagshipProduct, 1)}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Add Lab to Cart</span>
                </button>

                <button
                  onClick={() => onBuyNow(flagshipProduct, 1)}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Instant Buy Now</span>
                </button>

                <button
                  onClick={openB2BModal}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>School PO / Quote</span>
                </button>

                <button
                  id="btn-spotlight-download-datasheet"
                  onClick={() => downloadProductDatasheet(flagshipProduct)}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer"
                  title="Download Technical Datasheet"
                >
                  <Download className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Download Datasheet</span>
                </button>
              </div>

              {/* Trust badges footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] sm:text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>12-Month Replacement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Dispatched in 24 Hrs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>NITI Aayog Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>School PO Net-30</span>
                </div>
              </div>


            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
