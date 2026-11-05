import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  FileText,
  Zap,
  ExternalLink,
  Download,
  Eye,
  Check,
  Smartphone,
  Copy,
  X,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  Lock,
  Phone,
  Mail,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { NavTab, ProductCategory } from '../types';

interface RobocupSpecialMentionSectionProps {
  setActiveTab?: (tab: NavTab) => void;
  onExploreCategory?: (category: ProductCategory) => void;
  openB2BModal?: () => void;
}

export const RobocupSpecialMentionSection: React.FC<RobocupSpecialMentionSectionProps> = ({
  setActiveTab,
  onExploreCategory,
  openB2BModal
}) => {
  const [activeBrochurePage, setActiveBrochurePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('single');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdv2Mh2YzK6T3qTbY4cSkwVLS4JM4QMODy4QwxSLpdDKTi7LA/viewform?usp=dialog";
  const qrCodeImg = "/hackathon/hackathon_registration_qr.jpeg";
  const brochurePdf = "/hackathon/RoboCup_Hackathon_2027_Official_Brochure.pdf";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleFormUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenHackathonHub = () => {
    if (setActiveTab) {
      setActiveTab('hackathon');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const brochurePages = [
    { num: 1, title: 'Cover & Theme', tag: '01 · Cover', highlight: 'Build it. Code it. Win it!' },
    { num: 2, title: 'What is RoboCup?', tag: '02 · What is it?', highlight: 'Format, Skills & Parents' },
    { num: 3, title: '10 Robots Compendium', tag: '03 · Pick Your Robot', highlight: '4 Revealed + 6 Top Secret' },
    { num: 4, title: 'Journey to the Finals', tag: '04 · Your Journey', highlight: '5 Stops from Sign-Up' },
    { num: 5, title: 'Prizes & Judges', tag: '05 · Prizes & Judges', highlight: '₹10,000 + Drone & Secret Judges' },
    { num: 6, title: 'Join Now & Fees', tag: '06 · Join Now', highlight: 'Early Bird ends 25 Nov 2026' },
    { num: 7, title: 'About Balki Technologies', tag: '07 · About Us', highlight: 'Startup India & Founder' },
    { num: 8, title: 'For Schools & ATL', tag: '08 · For Schools', highlight: '3–12 Labs & Demo Booking' },
  ];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 75));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <section 
      id="robocup-special-mention" 
      className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-cyan-500/40 shadow-2xl overflow-hidden p-4 sm:p-8 lg:p-12 space-y-8"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-28 -mb-28" />

      {/* Top Banner Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>ROBOCUP HACKATHON 2027 · BY BALKI TECHNOLOGIES</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10 Robots • 1 Sealed Box • 60 Mins</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] sm:text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Live Online · All India (Grades 8–12)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Build it. Code it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">Win it!</span>
          </h2>

          <div className="text-base sm:text-xl font-bold text-amber-400 tracking-wide">
            India's at-home robotics hackathon. 10 robots. 1 sealed box. 60 minutes. Are you in?
          </div>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A national robotics hackathon by Balki Technologies for students in Grades 8–12. Pick a robot, receive your sealed kit delivered to your door, build it live against the clock, beat 3 tasks on camera, and take on students from across India!
          </p>

          {/* Key Facts directly from Brochure */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
              <strong className="text-white font-extrabold text-xs sm:text-sm">1 Nov – 15 Dec</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Finals</span>
              <strong className="text-cyan-300 font-extrabold text-xs sm:text-sm">9–10 Jan 2027</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">1st Prize</span>
              <strong className="text-amber-400 font-extrabold text-xs sm:text-sm">₹10,000 + drone kit</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-amber-300 block text-[10px] uppercase font-bold">Early Bird (Ends 25 Nov)</span>
              <strong className="text-amber-300 font-extrabold text-xs sm:text-sm">From ₹1,800</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Register on Google Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={brochurePdf}
            download="RoboCup_Hackathon_2027_Official_Brochure.pdf"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Brochure PDF</span>
          </a>

          <button
            onClick={handleOpenHackathonHub}
            className="px-4 py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span>Hackathon Hub</span>
          </button>
        </div>
      </div>

      {/* CORE SHOWCASE: INTERACTIVE BROCHURE VIEWER & REGISTRATION CARD */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Official High-Resolution Brochure Viewer */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-cyan-500/40 p-4 sm:p-6 flex flex-col space-y-4 shadow-2xl">
          
          {/* Reader Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <span>Official RoboCup Hackathon Brochure</span>
                  <span className="text-[10px] font-black uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                    Official Document
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {viewMode === 'single' ? `Page ${activeBrochurePage} of 8: ${brochurePages[activeBrochurePage - 1].title}` : 'Continuous 8-Page View'}
                </p>
              </div>
            </div>

            {/* View Mode & Zoom Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Single vs Continuous Toggle */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'single' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Single page view with navigation"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Single Page</span>
                </button>
                <button
                  onClick={() => setViewMode('continuous')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'continuous' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Continuous vertical scroll of all 8 pages"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All 8 Pages</span>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1 text-slate-300">
                <button 
                  onClick={handleZoomOut} 
                  disabled={zoomLevel <= 75}
                  className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-slate-400">{zoomLevel}%</span>
                <button 
                  onClick={handleZoomIn} 
                  disabled={zoomLevel >= 175}
                  className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsBrochureModalOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Open Fullscreen Reader"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Direct PDF Link */}
              <a
                href={brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Open PDF file directly in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* READER DISPLAY AREA (Guaranteed No Chrome Iframe Blocks) */}
          {viewMode === 'single' ? (
            <div className="space-y-4">
              {/* Single Page Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[460px] sm:min-h-[620px] p-2">
                <div 
                  className="transition-transform duration-200 flex items-center justify-center max-w-full"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <img
                    src={`/hackathon/brochure_page_${activeBrochurePage}.png`}
                    alt={`RoboCup Hackathon Brochure Page ${activeBrochurePage}`}
                    className="w-full h-auto max-h-[660px] object-contain rounded-lg shadow-xl"
                  />
                </div>

                {/* Left/Right Flip Controls */}
                <button
                  onClick={() => setActiveBrochurePage(p => Math.max(1, p - 1))}
                  disabled={activeBrochurePage === 1}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-cyan-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 hover:border-cyan-400 cursor-pointer ${
                    activeBrochurePage === 1 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'opacity-85 shadow-2xl hover:scale-105'
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setActiveBrochurePage(p => Math.min(8, p + 1))}
                  disabled={activeBrochurePage === 8}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-cyan-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 hover:border-cyan-400 cursor-pointer ${
                    activeBrochurePage === 8 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'opacity-85 shadow-2xl hover:scale-105'
                  }`}
                  title="Next Page"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Floating Page Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-white shadow-lg flex items-center gap-2">
                  <span>Page {activeBrochurePage} of 8</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-300 font-mono">{brochurePages[activeBrochurePage - 1].tag}</span>
                </div>
              </div>

              {/* 8-Page Navigation Tabs */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {brochurePages.map((pg) => (
                  <button
                    key={pg.num}
                    onClick={() => setActiveBrochurePage(pg.num)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                      activeBrochurePage === pg.num
                        ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md scale-[1.02]'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-black">p.{pg.num}</div>
                    <div className="text-[10px] truncate max-w-full font-medium opacity-90 hidden sm:block">
                      {pg.title.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Continuous Vertical Scroll of All 8 Pages */
            <div className="space-y-6 max-h-[750px] overflow-y-auto pr-2 rounded-2xl bg-slate-950 p-4 border border-slate-800 scrollbar-thin">
              {brochurePages.map((pg) => (
                <div key={pg.num} className="space-y-2 border-b border-slate-800/80 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="font-bold text-cyan-400">{pg.tag}</span>
                    <span className="text-white font-semibold">{pg.title}</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg">
                    <img
                      src={`/hackathon/brochure_page_${pg.num}.png`}
                      alt={`Brochure Page ${pg.num}`}
                      loading="lazy"
                      className="w-full h-auto object-contain mx-auto"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Viewer Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official 8-Page Publication · All India Remote Edition</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={brochurePdf}
                download="RoboCup_Hackathon_2027_Official_Brochure.pdf"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Document (986 KB)</span>
              </a>
              <span>•</span>
              <button
                onClick={() => setIsBrochureModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Fullscreen</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Official Registration Card & Google Form */}
        <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 rounded-3xl border-2 border-amber-500/50 p-6 flex flex-col justify-between space-y-6 shadow-2xl relative">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Official Google Form Entry
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Closes 15 Dec 2026
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Scan to Register
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Scan the official registration QR code below or tap to register via the Google Form portal.
            </p>
          </div>

          {/* QR Code Presentation Box */}
          <div className="p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-xl flex flex-col items-center justify-center space-y-3">
            <div className="relative bg-white p-2 rounded-xl">
              <img
                src={qrCodeImg}
                alt="Balki RoboCup 2027 Google Form Registration QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
              />
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xs font-black text-slate-900 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                <span>SCAN WITH CAMERA / UPI / LENS</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Directly opens the official registration Google Form
              </p>
            </div>
          </div>

          {/* Registration Links and Actions */}
          <div className="space-y-2.5">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Tap Here to Register (Google Form)</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Form Link'}</span>
              </button>

              <button
                onClick={handleOpenHackathonHub}
                className="py-2 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-bold border border-cyan-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Hackathon Hub</span>
              </button>
            </div>
          </div>

          {/* Pricing Box directly from Brochure Page 6 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold border-b border-slate-800 pb-1.5">
              <span>EARLY-BIRD PRICES END 25 NOV 2026</span>
              <span className="text-emerald-400 font-mono">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">SOLO (1 Student)</span>
                <strong className="text-white text-sm font-black">₹1,800</strong>
                <span className="text-[10px] text-slate-500 line-through ml-1.5">₹2,500</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">DUO (Team of 2)</span>
                <strong className="text-amber-400 text-sm font-black">₹2,500</strong>
                <span className="text-[10px] text-slate-500 line-through ml-1.5">₹3,000</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight pt-1">
              Every entry includes your robot kit (yours to keep forever!), a live slot and a certificate.
            </p>
          </div>

        </div>

      </div>

      {/* EXACT BROCHURE CONTENT BREAKDOWN (Page-by-Page Ground Truth) */}
      <div className="relative z-10 pt-4 space-y-6 border-t border-slate-800">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Verified Brochure Content
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              What's Inside The 8-Page Brochure
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Carefully analyzed from the official Balki Technologies publication
          </span>
        </div>

        {/* 4 Feature Columns mirroring the brochure structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Section 1: How It Works & Skills (Page 2) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[11px]">02</span>
              <span>What is RoboCup?</span>
            </div>
            <h4 className="font-bold text-white text-sm">3 Steps & Core Skills</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">1.</span>
                <span><strong>Pick your robot:</strong> Choose 1 of 10 robots at sign-up.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">2.</span>
                <span><strong>Get the sealed kit:</strong> Every part delivered to door.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">3.</span>
                <span><strong>Build it live:</strong> Open, build and beat 3 tasks in 1 hour on camera.</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <strong>Level up:</strong> Wire circuits, play with sensors, tune real code, build against the clock.
            </div>
          </div>

          {/* Section 2: 10 Robots (Page 3) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-[11px]">03</span>
              <span>10 Robots Compendium</span>
            </div>
            <h4 className="font-bold text-white text-sm">4 Revealed + 6 Top Secret</h4>
            <div className="space-y-1 text-xs text-slate-300">
              <p><strong>1. Line-Follower & Obstacle Bot</strong> (Follows line & steers around obstacles)</p>
              <p><strong>2. RC Bluetooth Smart Car</strong> (Speedy phone-driven car)</p>
              <p><strong>3. DIY Robotic Arm</strong> (Desktop arm that grips, lifts & stacks)</p>
              <p><strong>4. Gesture Controlled Robot</strong> (Tilt hand and it moves)</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span><strong>6 Secret Robots:</strong> Revealed on Instagram @balki.technologies</span>
            </div>
          </div>

          {/* Section 3: Journey to Finals (Page 4) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-[11px]">04</span>
              <span>Your Journey</span>
            </div>
            <h4 className="font-bold text-white text-sm">Five Stops from Sign-Up</h4>
            <ol className="space-y-1.5 text-xs text-slate-300">
              <li><strong className="text-white">1. 1 Nov – 15 Dec:</strong> Register solo or duo.</li>
              <li><strong className="text-white">2. After Sign-Up:</strong> Kit ships to your door.</li>
              <li><strong className="text-white">3. Nov – Jan:</strong> Get ready and plan build.</li>
              <li><strong className="text-white">4. 9–10 Jan 2027:</strong> Compete live on Google Meet.</li>
              <li><strong className="text-white">5. 16–17 Jan 2027:</strong> Results & winners announced!</li>
            </ol>
          </div>

          {/* Section 4: Prizes & Judges (Page 5) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-[11px]">05</span>
              <span>Prizes & Judges</span>
            </div>
            <h4 className="font-bold text-white text-sm">Every Team Takes Something Home</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><strong>1st Place:</strong> ₹10,000 cash + drone kit</li>
              <li><strong>Top 5 Teams:</strong> 1-month mentorship with founder</li>
              <li><strong>Top 20 Teams:</strong> 1-month R&D internship with lab</li>
              <li><strong>Everyone:</strong> Participation certificate & keep robot</li>
            </ul>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <strong>Judged by Industry Experts:</strong> Mentors judge live on camera. Names stay secret for fair judging.
            </div>
          </div>

        </div>

        {/* Footer Bar: Who can join, Policy & Contact (Pages 6, 7 & 8) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white">Who Can Join:</span>
              <span>Students in Grades 8–12</span>
              <span>•</span>
              <span>Solo or Team of 2</span>
              <span>•</span>
              <span>From any school in India (duo can be from different schools)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Please note: All registrations are non-refundable. Passes can be transferred to another student with prior approval from Balki Technologies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs shrink-0">
            <a href="tel:+919071199139" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 90711 99139</span>
            </a>
            <a href="mailto:balki.technologies@gmail.com" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300">
              <Mail className="w-3.5 h-3.5" />
              <span>balki.technologies@gmail.com</span>
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Kavadiguda, Hyderabad</span>
          </div>
        </div>

      </div>

      {/* FULLSCREEN BROCHURE MODAL (Crystal Clear Image Reader, Zero Chrome Blocks) */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col border border-cyan-500/40 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-black text-white text-sm sm:text-base">
                    RoboCup Hackathon 2027 · Page {activeBrochurePage} of 8: {brochurePages[activeBrochurePage - 1].title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Balki Technologies · Early Bird Ends 25 Nov 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={brochurePdf}
                  download="RoboCup_Hackathon_2027_Official_Brochure.pdf"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF (986 KB)</span>
                </a>
                <button
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Active Page Image */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 flex items-center justify-center relative min-h-[500px]">
              <img
                src={`/hackathon/brochure_page_${activeBrochurePage}.png`}
                alt={`Balki RoboCup Hackathon Official Brochure Page ${activeBrochurePage}`}
                className="max-h-[75vh] w-auto object-contain mx-auto rounded-lg shadow-2xl"
              />

              {/* Modal Navigation Buttons */}
              <button
                onClick={() => setActiveBrochurePage(p => Math.max(1, p - 1))}
                disabled={activeBrochurePage === 1}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-cyan-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 cursor-pointer ${
                  activeBrochurePage === 1 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'opacity-90 shadow-2xl hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setActiveBrochurePage(p => Math.min(8, p + 1))}
                disabled={activeBrochurePage === 8}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-cyan-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 cursor-pointer ${
                  activeBrochurePage === 8 ? 'opacity-20 cursor-not-allowed pointer-events-none' : 'opacity-90 shadow-2xl hover:scale-105'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer Strip */}
            <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {brochurePages.map((pg) => (
                  <button
                    key={pg.num}
                    onClick={() => setActiveBrochurePage(pg.num)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeBrochurePage === pg.num
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Page {pg.num}
                  </button>
                ))}
              </div>

              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Register on Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
