import React from 'react';
import { 
  Building2, 
  Target, 
  Eye, 
  Award, 
  ShieldCheck, 
  Users, 
  Wrench, 
  GraduationCap, 
  Truck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BalkiLogo } from './BalkiLogo';

interface AboutUsSectionProps {
  onExploreShop: () => void;
  openB2BModal: () => void;
  onContactUs: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onExploreShop,
  openB2BModal,
  onContactUs
}) => {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Banner with Content-Related Laboratory & Workshop Background */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800">
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
          alt="Scientific Instrument Fabrication & Electronics Testing"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 px-6 py-14 sm:px-12 sm:py-20 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTABLISHED SCIENTIFIC APPARATUS & STEM EDUCATION HERITAGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Pioneering Precision Science & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Future-Ready ATL Laboratories
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Born out of three decades of scientific laboratory manufacturing heritage in Ambala and modernized with state-of-the-art robotics engineering in Bengaluru, Balki Technologies delivers India's most comprehensive ecosystem of certified laboratory instruments, 3D anatomical models, and NEP 2020 grade-progressive ATL tinkering kits.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreShop}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore 1,000+ Lab Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={openB2BModal}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Institutional ATL Lab Quotation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Numerical Impact Milestones */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-amber-600">1,000+</p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Instruments & STEM Kits</p>
          <p className="text-[11px] text-slate-500">From optical benches to AI robotics</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-blue-600">500+</p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Partner Schools & ATLs</p>
          <p className="text-[11px] text-slate-500">KVs, DPS, Army Schools & State Hubs</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-emerald-600">100%</p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">NEP 2020 Aligned</p>
          <p className="text-[11px] text-slate-500">Grade 3 to 12 competency mapped</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-purple-600">12 Mo</p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Doorstep Replacement</p>
          <p className="text-[11px] text-slate-500">Prompt component swaps for uninterrupted labs</p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between group">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
            alt="Young Indian Innovators Lab"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-8 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be India’s and the global educational community's most trusted partner for high-precision scientific instruments, durable laboratory apparatus, and next-generation STEM prototyping solutions. We envision an India where every classroom has an active, buzzing innovation laboratory where curiosity is met with real tactile engineering.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-700">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Inspiring 1,000,000+ Young Indian Innovators by 2030</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between group">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
            alt="Laboratory Precision Apparatus"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-8 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To supply high-grade, reliable, and student-proof hardware to schools, researchers, educators, and makers. We eliminate vendor fragmentation by offering a standardized end-to-end catalogue—from borosilicate chemistry glassware and optical benches to autonomous smart rovers and cloud-connected IoT microcontrollers—supported by on-site teacher training and rapid component replacement.
            </p>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Standardizing Quality, Safety & Educational Rigor</span>
          </div>
        </div>
      </section>

      {/* The 4 Core Pillars of Excellence */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Why Institutions Trust Us</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Built for Rigorous School & Laboratory Operations
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every component in our catalog undergoes multi-point quality assurance to survive heavy classroom usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Industrial Precision & Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Medical PVC models, Class-A borosilicate 3.3 glassware, and microcontrollers with reverse-polarity protection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">NITI Aayog & GeM Compliance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official Atal Innovation Mission packages P1 through P4 with direct GeM Portal PO processing and Net-30 billing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Teacher Enablement & Manuals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free 2-day on-site educator workshops, bilingual Hindi/English lab guides, and student project challenge workbooks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pan-India Dual Depots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Express dispatch from Ambala Cantt (North India) and Bengaluru Tech Depot (South India) with shockproof crating.
            </p>
          </div>
        </div>
      </section>

      {/* Dual Infrastructure Facilities */}
      <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>National Operations Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Our Manufacturing & Technology Centers</h2>
          </div>
          <button
            onClick={onContactUs}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors self-start md:self-auto cursor-pointer"
          >
            Visit or Schedule Lab Audit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 group">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
              alt="Ambala Cantt Scientific Glassblowing & Precision Optical Manufacturing"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Ambala Cantt Scientific Hub</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                ESTD. 1992
              </span>
            </div>
            <p className="relative z-10 text-xs text-slate-300 leading-relaxed">
              The heart of scientific glassblowing, optical lens fabrication, biological dissection apparatus, and precision mechanics. Our Ambala facility produces standard and custom apparatus tested to international standards.
            </p>
            <div className="relative z-10 pt-2 text-xs text-slate-400 space-y-1">
              <p>📍 Om Lab Products Complex, Industrial Area, Ambala Cantt, Haryana - 133001</p>
              <p>📞 Phone: +91-9071199139 / +91-87080-31532</p>
            </div>
          </div>

          <div className="relative overflow-hidden p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 group">
            <img
              src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
              alt="Robotics & Electronics Firmware Engineering Depot"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Bengaluru & Hyderabad Tech Depots</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                ROBOTICS & IoT
              </span>
            </div>
            <p className="relative z-10 text-xs text-slate-300 leading-relaxed">
              Dedicated to microcontroller firmware flashing, autonomous robotics testing, 3D printing filament validation, and South India express logistics for institutional orders and rental equipment calibrations.
            </p>
            <div className="relative z-10 pt-2 text-xs text-slate-400 space-y-1">
              <p>📍 Tech Park Hub, Electronic City & Hitec City Innovation Depot</p>
              <p>✉️ Email: balki.technologies@gmail.com / support@scientifickart.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Brand Identity Statement */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80"
          alt="STEM Innovation Leadership Background"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-8 mix-blend-multiply pointer-events-none"
        />
        <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white rounded-3xl shadow-md border border-amber-200 flex items-center justify-center p-3">
          <BalkiLogo type="icon" className="w-full h-full" />
        </div>
        <div className="relative z-10 space-y-3 flex-1 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Empowering the Next Generation of Indian Scientists & Engineers
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            "Education is not just about reading principles from a textbook—it's about holding an optical prism in sunlight, watching a microcontroller respond to your code, and feeling the satisfaction of assembling an autonomous robot with your own hands. We are committed to making top-tier laboratory hardware accessible to every Indian school."
          </p>
          <p className="text-xs font-bold text-amber-800 tracking-wider uppercase">
            — BALKI TECHNOLOGIES & SCIENTIFIC INSTRUMENTS DIVISION
          </p>
        </div>
      </section>

    </div>
  );
};
