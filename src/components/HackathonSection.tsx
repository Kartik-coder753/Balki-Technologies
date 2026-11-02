import React, { useState } from 'react';
import { 
  Trophy, 
  Cpu, 
  Bot, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Video, 
  Layers, 
  ShieldCheck, 
  Target, 
  Boxes, 
  Compass, 
  Smartphone, 
  Laptop, 
  Wifi, 
  Flame, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  Users, 
  MapPin, 
  ArrowRight,
  Eye,
  Zap,
  HelpCircle,
  Truck,
  Copy,
  QrCode,
  Briefcase
} from 'lucide-react';
import { 
  HACKATHON_METADATA, 
  HACKATHON_DOCUMENTS, 
  HACKATHON_EXPERIMENTS, 
  HACKATHON_TIMELINE, 
  HACKATHON_FAQS,
  HackathonExperiment,
  HackathonDoc
} from '../data/hackathonData';
import { NavTab, ProductCategory } from '../types';

interface HackathonSectionProps {
  setActiveTab?: (tab: NavTab) => void;
  openB2BModal?: () => void;
  onExploreCategory?: (category: ProductCategory) => void;
}

export const HackathonSection: React.FC<HackathonSectionProps> = ({
  setActiveTab,
  openB2BModal,
  onExploreCategory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'experiments' | 'rules' | 'arena' | 'timeline' | 'downloads' | 'register'>('overview');
  const [selectedExperiment, setSelectedExperiment] = useState<HackathonExperiment | null>(null);
  const [previewDoc, setPreviewDoc] = useState<HackathonDoc | null>(null);
  const [regType, setRegType] = useState<'solo' | 'duo'>('solo');
  const [studentName, setStudentName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 10');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');

  const meta = HACKATHON_METADATA;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !email || !phone) return;
    setRegSuccess(true);
  };

  const filteredExperiments = filterDifficulty === 'all' 
    ? HACKATHON_EXPERIMENTS 
    : HACKATHON_EXPERIMENTS.filter(exp => exp.difficulty === filterDifficulty);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Banner matching Brochure Theme */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-cyan-500/30 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-wider uppercase shadow-inner">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{meta.edition}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10 Robots • 1 Sealed Box • 60 Mins</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>Live on Google Meet</span>
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Balki <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">RoboCup</span> Hackathon 2027
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-amber-400 tracking-wide">
              "{meta.tagline}"
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              India's premier at-home remote STEM robotics championship for <strong className="text-white">Grades 8 to 12</strong>. Receive a tamper-evident sealed mystery hardware kit delivered to your doorstep. Unbox live during your 1-on-1 proctored Google Meet slot, assemble the designated challenge robot, flash your code, and conquer the 2400x1200mm arena mat!
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Champion Cash</div>
              <div className="text-lg sm:text-xl font-black text-amber-400">₹10,000 + Drone</div>
              <div className="text-[11px] text-slate-400">Q250 Quadcopter Kit</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Founder Access</div>
              <div className="text-lg sm:text-xl font-black text-cyan-400">Top 5 Teams</div>
              <div className="text-[11px] text-slate-400">1-Mo Mentorship with Founder</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">R&D Lab Placement</div>
              <div className="text-lg sm:text-xl font-black text-blue-400">Top 20 Teams</div>
              <div className="text-[11px] text-slate-400">1-Mo Remote R&D Internship</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Hardware Retained</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400">Keep Your Kit</div>
              <div className="text-[11px] text-slate-400">100% Retained Permanently</div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveSubTab('register')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>Register Now · Early Bird ₹1,800</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('experiments')}
              className="px-5 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Explore All 10 Robots</span>
            </button>

            <button
              onClick={() => setActiveSubTab('downloads')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Rulebook & Brochure</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Overview & Concept
        </button>

        <button
          onClick={() => setActiveSubTab('experiments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'experiments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-600" />
          <span>The 10 Robots & Experiments</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black">10</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'rules'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Rules & 100-Pt Scorecard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('arena')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'arena'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Remote Arena & Mat Spec</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'timeline'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>Timeline & Dates</span>
        </button>

        <button
          onClick={() => setActiveSubTab('downloads')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'downloads'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Official Documents (PDF)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('register')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Register Solo/Duo</span>
        </button>
      </div>

      {/* 3. SUB-TAB: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-10">
          
          {/* How It Works - 4 Steps */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  Competition Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  How The Remote Hackathon Works
                </h2>
              </div>
              <div className="text-xs text-slate-500 max-w-sm">
                Built to test pure spontaneous engineering, real circuit intuition, and rapid debugging under pressure.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-base">Register & Choose Slot</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign up Solo or as a Duo (Grades 8–12). Select your preferred 1-hour competition window on 9th or 10th January 2027.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-base">Doorstep Sealed Kit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive a sealed mystery box containing parts for 10 possible robots, arena mat, and tools. Keep the tamper seal intact!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-base">Unbox Live & 60m Build</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Join Google Meet with your judge. Break seal live, receive your assigned mystery robot, build mechanical & electrical circuits in 35 mins!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-base">Execute & Win Prizes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deploy your robot across the 3 official tasks on the 2400x1200mm mat. Compete for ₹10,000 cash, drones, internships & keep your kit!
                </p>
              </div>
            </div>
          </div>

          {/* Grand Prizes & Career Opportunities - 1st Prize, Top 5 & Top 20 */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-slate-800 text-white space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Trophy className="w-3.5 h-3.5" />
                <span>National Honors & Career Acceleration</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Grand 1st Prize, Founder Mentorship & R&D Internships
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Beyond certificates: a national platform designed to accelerate student engineering careers through real cash rewards, industrial UAV hardware, direct founder incubation, and verified R&D laboratory internships.
              </p>
            </div>

            {/* 3 Highlighted Feature Cards: 1st Prize, Top 5 Teams, Top 20 Teams */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card 1: 1st Place National Champion */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10 flex flex-col justify-between space-y-6 relative group hover:border-amber-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                      <span>1st Place Champion</span>
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">Grand Winner</span>
                  </div>

                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">₹10,000</div>
                    <div className="text-sm font-black text-amber-400 mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>+ Balki Q250 DIY Quadcopter Drone Kit</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    The highest national honor. Complete cash award combined with an advanced quadcopter avionics kit and national gold trophy.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Champion Benefits & Rewards:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>₹10,000 Direct Cash Transfer</strong> to the winning student or team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Balki Q250 DIY Drone Kit</strong> with flight controller, brushless motors & ESCs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>National Gold Trophy & Gold Medals</strong> with institutional accreditation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Featured Founder Spotlight</strong> across Balki STEM nationwide network</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold text-center">
                  Recognized by Atal Tinkering Labs & AIM Guidelines
                </div>
              </div>

              {/* Card 2: Top 5 Finalist Teams - Executive Founder Mentorship */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-cyan-500/20 via-slate-900 to-slate-950 border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between space-y-6 relative group hover:border-cyan-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-400 text-slate-950 shadow-sm flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Top 5 Finalist Teams</span>
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">Executive Access</span>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">1-Month Direct Mentorship</div>
                    <div className="text-sm font-black text-cyan-300 mt-1 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Direct with Founder Phanindra Balki</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Exclusive weekly 1-on-1 private strategy sessions with Balki Technologies Chief of Engineering to transform school prototypes into industrial hardware.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                      Executive Mentorship Perks:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Weekly 1-on-1 Video Strategy Sessions</strong> directly with founder Phanindra Balki</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Startup & Patent Incubation</strong> to transition robotics models into commercial tech</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Portfolio & College Admissions Guidance</strong> for top global engineering schools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Senior Engineering Advisory Hotline</strong> for hardware design and PCB debugging</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold text-center">
                  Direct Founder 1-on-1 Access & Mentorship
                </div>
              </div>

              {/* Card 3: Top 20 Teams - R&D Remote Internship */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-blue-600/20 via-slate-900 to-slate-950 border-2 border-blue-500/80 shadow-2xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative group hover:border-blue-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500 text-white shadow-sm flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 fill-white" />
                      <span>Top 20 Innovative Teams</span>
                    </span>
                    <span className="text-xs font-mono text-blue-300 font-bold">R&D Lab Placement</span>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">1-Month R&D Internship</div>
                    <div className="text-sm font-black text-blue-300 mt-1 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>Balki Technologies Engineering Lab</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Real industry research & development experience. Contribute to genuine robotics firmware, IoT edge devices, and embedded computer vision pipelines.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                      Internship Deliverables & Badges:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span><strong>Official Remote R&D Internship</strong> inside Balki Technologies Lab</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span><strong>Hands-On Engineering Practice</strong> building real-world robotics & IoT software</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span><strong>Verified Internship Certificate</strong> & Official Letter of Recommendation (LOR)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span><strong>Priority Fast-Track</strong> for future national grants and ATL lab ambassadors</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-semibold text-center">
                  Verified Industry Certificate & Letter of Recommendation
                </div>
              </div>

            </div>

            {/* Participation Banner */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">For All Participating Teams:</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every participant retains 100% of their robotics hardware kit, sensors, tools & arena mat permanently, plus receives Government/AIM-recognized Participation Certificates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('register')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer"
              >
                Register Team Today
              </button>
            </div>
          </div>

          {/* Pricing & What's In The Kit */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Solo Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Solo Registration
                </span>
                <h3 className="text-xl font-black text-slate-900">Solo Innovator</h3>
                <p className="text-xs text-slate-500">
                  Ideal for independent coders and tinkers who want to build their individual robotics credentials.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">₹{meta.pricing.solo.earlyBird.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹{meta.pricing.solo.regular.toLocaleString('en-IN')}</span>
                  <div className="text-xs font-bold text-emerald-600 mt-1">Early Bird Price until 30th Nov</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setRegType('solo');
                  setActiveSubTab('register');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Choose Solo Track
              </button>
            </div>

            {/* Duo Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white border-2 border-amber-500/80 shadow-md flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Duo Registration
                </span>
                <h3 className="text-xl font-black text-slate-900">Duo Team (2 Students)</h3>
                <p className="text-xs text-slate-500">
                  Pair with your best lab partner or classmate to divide assembly and code flashing for maximum speed.
                </p>
                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">₹{meta.pricing.duo.earlyBird.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹{meta.pricing.duo.regular.toLocaleString('en-IN')}</span>
                  <div className="text-xs font-bold text-emerald-600 mt-1">₹1,250 per student (Early Bird)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setRegType('duo');
                  setActiveSubTab('register');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-sm"
              >
                Choose Duo Track
              </button>
            </div>

            {/* Kit Inclusions */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Boxes className="w-4 h-4" />
                  <span>Everything Included In Box</span>
                </div>
                <h3 className="text-lg font-black text-white">Delivered To Your Doorstep</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {meta.pricing.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero extra courier charges across all pin codes in India.</span>
              </div>
            </div>

          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xl">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Frequently Asked Questions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HACKATHON_FAQS.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{faq.q}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. SUB-TAB: THE 10 ROBOTS & EXPERIMENTS */}
      {activeSubTab === 'experiments' && (
        <div className="space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                Official Curriculum Compendium
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                The 10 RoboCup Hackathon Robots
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your sealed mystery kit includes components to build ANY of these 10 championship robots. Learn them all before competition day!
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 shrink-0">
              {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterDifficulty === diff
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff === 'all' ? 'All 10' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <div 
                key={exp.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image Infographic header */}
                <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-black text-xs shadow-md">
                      {exp.number}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-slate-700">
                      {exp.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      exp.difficulty === 'Beginner' ? 'bg-emerald-500/90 text-white' :
                      exp.difficulty === 'Intermediate' ? 'bg-amber-500/90 text-slate-950 font-black' :
                      'bg-rose-500/90 text-white'
                    }`}>
                      {exp.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-cyan-700 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {exp.tagline}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tasks Rubric (60 Pts Total)
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {exp.tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between text-[11px]">
                          <span className="truncate pr-2 font-medium text-slate-600">{task.title.split(':')[0]}</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold shrink-0">{task.points} pts</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.skillsGained.slice(0, 3).map((sk, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => setSelectedExperiment(exp)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Complete Tasks & Hardware</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 5. SUB-TAB: RULES & 100-POINT SCORECARD */}
      {activeSubTab === 'rules' && (
        <div className="space-y-8">
          
          {/* Dual-Camera Setup Guidance */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                Official Proctoring Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Dual-Camera Google Meet Setup
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To guarantee 100% integrity across India, all participants must join their certified proctoring Google Meet slot using two active cameras at the same time:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Smartphone className="w-5 h-5" />
                  <span>Camera 1: Overhead Arena Mat View (Phone)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mount a smartphone on a tripod, table clamp, or elevated shelf facing downward to display the entire 2400x1200mm arena mat continuously. The robot’s movement, line tracking, and task completion must be in frame without obstruction.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Laptop className="w-5 h-5" />
                  <span>Camera 2: Student & Workbench View (Laptop)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your laptop webcam must face you and your work surface, capturing your hands, screwdrivers, components, and screen during assembly and flashing. The tamper-evident seal is inspected live on this camera.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Hour Schedule Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Match Timeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                The 60-Minute Competition Slot
              </h2>
            </div>

            <div className="space-y-4">
              {meta.slotStructure.map((slot, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shrink-0">
                      {slot.time}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{slot.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{slot.desc}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>

          {/* 100-Point Scorecard Detailed Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Official Evaluation Rubric
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  The Official 100-Point Scorecard
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Assembly</div>
                  <div className="text-lg font-black text-slate-900">40 Points</div>
                </div>
                <div className="text-slate-300 font-bold text-xl">+</div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Tasks</div>
                  <div className="text-lg font-black text-slate-900">60 Points</div>
                </div>
                <div className="text-slate-300 font-bold text-xl">=</div>
                <div className="text-right">
                  <div className="text-xs text-amber-600 font-bold uppercase">Total</div>
                  <div className="text-lg font-black text-amber-600">100 Points</div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {meta.scorecard.breakdown.map((row, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{row.category}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{row.criteria}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-black text-xs">
                      Max {row.maxPoints} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Penalties Notice */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Score Deductions & Fouls</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {meta.scorecard.penalties.map((pen, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-rose-200">
                    <span className="font-bold text-rose-700 block">{pen.penalty}</span>
                    <span className="text-slate-600 text-[11px]">{pen.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 6. SUB-TAB: ARENA & MAT SPEC */}
      {activeSubTab === 'arena' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Field of Play Dimensions
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Official 2400 mm × 1200 mm Arena Mat
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Shipped rolled up inside your sealed kit. Unroll on flat floor or large table prior to competition day.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-white font-mono text-xs font-bold shrink-0">
                Material: Anti-Glare Flex Matte Vinyl
              </div>
            </div>

            {/* Arena Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {meta.arenaSpecs.keyFeatures.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-600" />
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{feat.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ArUco Vision Markers Info */}
          <div className="bg-gradient-to-r from-slate-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
                Optical Localization
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Dictionary 4x4_50 ArUco Vision Markers
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The arena mat includes 8 distinct high-contrast ArUco fiducial markers placed along walls and junctions. Used by the ESP32-CAM and vision algorithms to detect location coordinates, compute homography matrices, and recognize targets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center space-y-1 shrink-0">
              <div className="text-xs text-slate-400">Marker ID Space</div>
              <div className="text-2xl font-black text-cyan-400">ID 01 – 08</div>
              <div className="text-[11px] text-slate-500">50mm × 50mm Square</div>
            </div>
          </div>

        </div>
      )}

      {/* 7. SUB-TAB: TIMELINE & DATES */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Season 2026-27 Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              National Championship Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mark your calendars. Ensure early registration to guarantee kit dispatch before postal cutoffs.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 ml-2">
            {HACKATHON_TIMELINE.map((step, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Dot */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-white ${
                  step.status === 'active' ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-slate-300'
                }`} />

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    step.status === 'active' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {step.date}
                  </span>
                  {step.status === 'active' && (
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider animate-pulse">
                      ● Active Window
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">{step.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. SUB-TAB: OFFICIAL DOCUMENTS (PDF DOWNLOADS) */}
      {activeSubTab === 'downloads' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Official Rulebooks & Dossiers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Download Official Hackathon Documents
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Access the untouched official PDF documents provided by Balki Technologies. Read on-screen or download directly to your device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {HACKATHON_DOCUMENTS.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {doc.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{doc.size}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <a
                      href={doc.path}
                      download={doc.filename}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>

                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. SUB-TAB: REGISTRATION FORM */}
      {activeSubTab === 'register' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              National Registration Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Reserve Your Sealed Robotics Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Entries are strictly capped to 500 teams nationally to maintain 1-on-1 proctoring quality.
            </p>
          </div>

          {/* Official Google Form & QR Code Fast Registration Card */}
          <div className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/60 p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Direct Google Form Registration
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Official Registration Form & QR Code
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 shrink-0">
                1 Nov – 15 Dec 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* QR Image */}
              <div className="bg-white p-3 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center space-y-2">
                <img
                  src="/hackathon/hackathon_registration_qr.jpeg"
                  alt="RoboCup Hackathon 2027 Registration QR Code"
                  className="w-44 h-44 object-contain rounded-lg"
                />
                <span className="text-[10px] font-bold text-slate-600 text-center">
                  Scan with Camera / Google Lens
                </span>
              </div>

              {/* Form Link & Actions */}
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  You can register directly through Google Forms. It collects your team members, school details, and shipping address for your sealed kit.
                </p>

                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdv2Mh2YzK6T3qTbY4cSkwVLS4JM4QMODy4QwxSLpdDKTi7LA/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Open Google Form Registration</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="text-[10px] text-slate-400 font-mono break-all p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  https://docs.google.com/forms/d/e/1FAIpQLSdv2Mh2YzK6T3qTbY4cSkwVLS4JM4QMODy4QwxSLpdDKTi7LA/viewform?usp=dialog
                </div>
              </div>
            </div>
          </div>

          <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400">
            — Or Fill Fast Pre-Reservation Form Below —
          </div>

          {regSuccess ? (
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-emerald-950">Pre-Registration Reserved!</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Thank you <strong className="font-bold">{studentName}</strong>! Your {regType === 'solo' ? 'Solo' : 'Duo'} slot reservation for the <strong className="font-bold">Balki RoboCup Hackathon 2027</strong> has been initiated. A confirmation email with competition slot choices, setup guides, and your kit dispatch tracking has been queued to <strong className="font-bold">{email}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs text-slate-700 space-y-1 text-left">
                <div><strong>Category:</strong> {regType === 'solo' ? 'Solo Innovator (₹1,800 Early Bird)' : `Duo Team (₹2,500 Early Bird with ${partnerName || 'Partner'})`}</div>
                <div><strong>School / Institution:</strong> {schoolName || 'Not specified'}</div>
                <div><strong>City:</strong> {city || 'India'}</div>
              </div>
              <button
                onClick={() => setRegSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Register Another Team
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="max-w-2xl mx-auto space-y-6">
              
              {/* Solo / Duo Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRegType('solo')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    regType === 'solo'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider opacity-80">Track 01</div>
                  <div className="text-base font-black mt-1">Solo Innovator</div>
                  <div className="text-xs font-bold text-amber-400 mt-2">₹1,800 Early Bird</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegType('duo')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    regType === 'duo'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-black uppercase tracking-wider opacity-80">Track 02</div>
                  <div className="text-base font-black mt-1">Duo Team (2 Students)</div>
                  <div className="text-xs font-black text-slate-900 mt-2">₹2,500 Early Bird Total</div>
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lead Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                    />
                  </div>

                  {regType === 'duo' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Second Team Member Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diya Patel"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Grade / Class *
                      </label>
                      <select
                        value={studentGrade}
                        onChange={(e) => setStudentGrade(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900 bg-white"
                      >
                        <option value="Grade 8">Grade 8 (Class 8)</option>
                        <option value="Grade 9">Grade 9 (Class 9)</option>
                        <option value="Grade 10">Grade 10 (Class 10)</option>
                        <option value="Grade 11">Grade 11 (Class 11)</option>
                        <option value="Grade 12">Grade 12 (Class 12)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Student or Parent) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School / Atal Tinkering Lab Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Public School, R.K. Puram"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery City & State (For Sealed Kit) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru, Karnataka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Reservation & Proceed to Dispatch Queue</span>
              </button>

              <div className="text-center text-[11px] text-slate-500">
                🔒 Tamper-evident sealed kits dispatched starting 16th Dec 2026. Zero kit return required — keep the robot forever!
              </div>
            </form>
          )}
        </div>
      )}

      {/* 10. MODAL: DETAILED EXPERIMENT VIEW */}
      {selectedExperiment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedExperiment(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Experiment Infographic */}
            <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
              <img
                src={selectedExperiment.image}
                alt={selectedExperiment.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 font-bold text-xs border border-cyan-500/40">
                  Experiment #{selectedExperiment.number}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                  {selectedExperiment.difficulty} Level
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                  {selectedExperiment.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {selectedExperiment.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {selectedExperiment.tagline}
                </p>
              </div>

              {/* What You'll Do */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>What You'll Do & Build:</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedExperiment.whatYouWillDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tasks Breakdown */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 text-base flex items-center justify-between">
                  <span>Official Task Rubric (60 Points)</span>
                  <span className="text-xs text-amber-600 font-bold">3 Tasks @ 20 Pts Each</span>
                </div>
                <div className="space-y-3">
                  {selectedExperiment.tasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-xs">
                          {task.points} Pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{task.description}</p>
                      <div className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-100">
                        <strong>Judge Metric:</strong> {task.criteria}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware List */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-slate-700" />
                  <span>Components Inside The Sealed Kit:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedExperiment.hardware.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Gained */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Skills & Concepts Mastered:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedExperiment.skillsGained.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold text-xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedExperiment(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Window
                </button>
                <button
                  onClick={() => {
                    setSelectedExperiment(null);
                    setActiveSubTab('register');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Register to Build This Robot
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: PREVIEW DOCUMENT */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col border border-slate-200 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{previewDoc.title}</h3>
                  <p className="text-[11px] text-slate-500">{previewDoc.filename} • {previewDoc.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.path}
                  download={previewDoc.filename}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="flex-1 bg-slate-100">
              <iframe
                src={`${previewDoc.path}#toolbar=0`}
                title={previewDoc.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
