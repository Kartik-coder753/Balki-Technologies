import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Bot, 
  Compass, 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight, 
  Bell, 
  CheckCircle2, 
  Share2, 
  Layers, 
  Flame, 
  FileText,
  Boxes,
  Zap,
  Target,
  QrCode,
  ExternalLink,
  Download,
  Eye,
  Check,
  Smartphone,
  Copy,
  X,
  ChevronRight
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
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdv2Mh2YzK6T3qTbY4cSkwVLS4JM4QMODy4QwxSLpdDKTi7LA/viewform?usp=dialog";
  const qrCodeImg = "/hackathon/hackathon_registration_qr.jpeg";
  const brochurePdf = "/hackathon/RoboCup_Hackathon_2027_Brochure__1__2f828f38.pdf";

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

  return (
    <section 
      id="robocup-special-mention" 
      className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-cyan-500/40 shadow-2xl overflow-hidden p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-10"
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
              <span>SPECIAL MENTION · NATIONAL CHAMPIONSHIP 2027</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10 Robots • 1 Sealed Box • 60 Mins</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Balki <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">RoboCup</span> Hackathon 2027
          </h2>

          <div className="text-base sm:text-xl font-bold text-amber-400 tracking-wide">
            "Build it. Code it. Win it!"
          </div>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            India's most thrilling at-home STEM robotics championship for <strong className="text-white">Grades 8 to 12</strong> (Solo or Duo). Receive a tamper-evident sealed kit with parts for 10 possible robots, unbox live on Google Meet, build under 35 minutes, code, and execute on the 2400x1200mm arena mat!
          </p>
        </div>

        {/* Header Action Buttons */}
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

          <button
            onClick={handleOpenHackathonHub}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Open Hackathon Hub (10 Robots & Rules)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CORE SHOWCASE: Official Brochure Preview & QR Code Registration Card */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column (7 cols): Official Brochure Visual & Page Viewer */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-5 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-white text-base sm:text-lg">
                  Official RoboCup Hackathon Brochure
                </h3>
              </div>
              <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                Page {activeBrochurePage} of 8
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Browse the official brochure below detailing the competition format, sealed mystery box, 10 robots, cash awards, and national recognition:
            </p>
          </div>

          {/* Interactive Brochure Image Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-2xl">
            <img
              src={`/hackathon/brochure_page_${activeBrochurePage}.png`}
              alt={`RoboCup Hackathon 2027 Brochure Page ${activeBrochurePage}`}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[460px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Floating Zoom & Action Badges */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setIsBrochureModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-600 text-white text-xs font-bold backdrop-blur-md border border-slate-700 hover:border-cyan-400 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Expand Fullscreen</span>
              </button>

              <a
                href={brochurePdf}
                download="RoboCup_Hackathon_2027_Brochure.pdf"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Page Selector Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-bold shrink-0">Pages:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((pg) => (
              <button
                key={pg}
                onClick={() => setActiveBrochurePage(pg)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeBrochurePage === pg
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Page {pg}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column (5 cols): Official QR Code & Google Form Registration */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 rounded-3xl border-2 border-amber-500/50 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xl relative">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Instant Google Form Entry
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Early Bird Active
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Scan QR or Register Via Google Form
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Use your phone camera or Google Lens to scan the official QR code below, or click the direct button to complete your registration in seconds.
            </p>
          </div>

          {/* QR Code Presentation Box */}
          <div className="p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-xl flex flex-col items-center justify-center space-y-3">
            <div className="relative bg-white p-2 rounded-xl">
              <img
                src={qrCodeImg}
                alt="Balki RoboCup 2027 Google Form Registration QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
              />
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-xs font-black text-slate-900 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                <span>SCAN WITH ANY CAMERA / UPI / LENS</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Directly opens the official Google Form registration portal
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
              <span>Click to Register (Google Form)</span>
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
                <span>Full Details Hub</span>
              </button>
            </div>
          </div>

          {/* Pricing reminder */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Solo Innovator:</span>
              <strong className="text-white font-black">₹1,800 Early Bird</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Duo Team:</span>
              <strong className="text-amber-400 font-black">₹2,500 Early Bird</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Quick 4 Track Cards (Autonomous, Computer Vision, Soccer, Drone) */}
      <div className="relative z-10 space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Featured Robots Included In The 10-Robot Compendium</span>
          </div>
          <button
            onClick={handleOpenHackathonHub}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All 10 Experiments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold mb-3 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Robot 01 · Autonomous
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Line-Follower & Obstacle Bot
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Precision dual-TCRT5000 IR line tracking with ultrasonic HC-SR04 sonar detour around dynamic obstacles.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Tasks: 90° bends, detour & stop box (60 pts)
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Robot 03 · Video Telemetry
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                ESP32 Wi-Fi Surveillance Bot
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Live video camera streaming, remote web browser driving, blind maze navigation, and optical ArUco marker identification.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Tasks: Stream, maze & ArUco reading (60 pts)
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-3 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Robot 05 · Robo-Soccer
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Keeper Penalty Deflection Bot
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rapid lateral strafe parrying incoming rolled penalty shots at high speed within 0.8s reaction windows.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Tasks: Boundary hold, 5-shot save & sweep (60 pts)
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-3 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Robot 08 · Motion Control
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Gesture Controlled Rover
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hand-worn MPU-6050 accelerometer & gyroscope glove transmitting 2.4GHz RF commands for natural driving and instant emergency stop.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Tasks: 4-way tilt, slalom & palm brake (60 pts)
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN BROCHURE MODAL */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-cyan-500/40 shadow-2xl relative p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-white text-base sm:text-lg">
                  RoboCup Hackathon 2027 Brochure · Page {activeBrochurePage} of 8
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={brochurePdf}
                  download="RoboCup_Hackathon_2027_Brochure.pdf"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-2 flex items-center justify-center">
              <img
                src={`/hackathon/brochure_page_${activeBrochurePage}.png`}
                alt={`RoboCup Hackathon 2027 Brochure Page ${activeBrochurePage}`}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setActiveBrochurePage(pg)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeBrochurePage === pg
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Page {pg}
                  </button>
                ))}
              </div>

              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-1.5"
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
