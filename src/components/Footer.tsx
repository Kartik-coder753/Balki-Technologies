import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  GraduationCap, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { BalkiLogo } from './BalkiLogo';
import { NavTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  openB2BModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openB2BModal }) => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-28 sm:pb-16">
      {/* Subtle STEM Ambient Circuitry Background */}
      <img
        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
        alt="STEM Circuitry Texture"
        referrerPolicy="no-referrer"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-luminosity pointer-events-none"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Identity */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <BalkiLogo type="full" variant="dark" />
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] pl-15">PVT. LTD.</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Building India's most complete STEM education ecosystem — a single, grade-progressive robotics and electronics kit line (Classes 3–12) designed to meet ATL and NEP 2020 requirements across India's 50,000+ mandated ATL Labs.
            </p>
            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919071199139" className="hover:text-amber-400 transition-colors">
                  +91-9071199139
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:balki.technologies@gmail.com" className="hover:text-amber-400 transition-colors">
                  balki.technologies@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Hyderabad, Telangana & Pan-India Network</span>
              </div>
            </div>
          </div>

          {/* Solutions & Kits */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Grade-Progressive Kits
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('store')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Junior Experiment Kits (Classes 3–5)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('store')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Intermediate Robotics & Sensors (Classes 6–8)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('store')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Advanced AI, IoT & Edge ML (Classes 9–10)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('store')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Drone Programming & 3D Printing (Classes 11–12)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('hackathon');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-cyan-300 transition-colors text-left text-cyan-400 font-black flex items-center gap-1.5"
                >
                  <span>🏆 Balki RoboCup Hackathon 2027 Hub</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('quotations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-amber-400 transition-colors text-left text-amber-300 font-semibold"
                >
                  Official ATL Quotations (169-Product Dossier)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('rentals')} 
                  className="hover:text-amber-400 transition-colors text-left text-amber-400/90 font-medium"
                >
                  Lab Equipment Rentals (DSOs, 3D Printers)
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Framework & Institutional */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Schools & Implementation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={openB2BModal} 
                  className="hover:text-amber-400 transition-colors text-left font-medium text-amber-400"
                >
                  Request School ATL Quotation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('courses')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  NEP 2020 Interactive Course Modules
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('inventory')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Inventory & Restock Manager
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('careers')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Marketing Intern (B2B Outreach)
                </button>
              </li>
              <li>
                <button 
                  onClick={openB2BModal} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  ATL Partner Component Supply
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  About Balki Technologies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setActiveTab('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Science Lab & ATL Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Student Tinkering Passport
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="text-amber-400 font-bold hover:underline transition-colors text-left flex items-center gap-1.5"
                >
                  <span>24/7 Problem Resolvance & Support Desk</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Balki Guarantee */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              The Balki Advantage
            </h4>
            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setActiveTab('contact')}
                className="flex items-start gap-2 cursor-pointer group"
              >
                <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Free School Installation</p>
                  <p className="text-slate-400 text-[11px]">On-site assembly and calibration by certified engineers.</p>
                </div>
              </div>
              <div 
                onClick={() => setActiveTab('courses')}
                className="flex items-start gap-2 cursor-pointer group"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">Hands-on Teacher Training</p>
                  <p className="text-slate-400 text-[11px]">Empowering educators with step-by-step ATL lab manuals.</p>
                </div>
              </div>
              <div 
                onClick={() => setActiveTab('contact')}
                className="flex items-start gap-2 cursor-pointer group"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-white group-hover:text-amber-400 transition-colors">12-Month Doorstep Replacement</p>
                  <p className="text-slate-400 text-[11px]">Prompt component swaps for uninterrupted classroom tinkering.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Balki Technologies Pvt. Ltd. All rights reserved. Building India's STEM backbone, one school at a time.</p>
          <div className="flex items-center gap-6">
            <span>GST Registered</span>
            <span>Made in India 🇮🇳</span>
            <span>Atal Innovation Mission Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
