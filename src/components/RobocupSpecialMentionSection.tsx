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
  Target
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
  const [emailInput, setEmailInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [roleInput, setRoleInput] = useState<'student' | 'teacher' | 'mentor'>('student');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) return;
    setIsSubscribed(true);
  };

  const handleRoboticsClick = () => {
    if (onExploreCategory) {
      onExploreCategory('robotics-mechanics');
    }
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuotationsClick = () => {
    if (setActiveTab) {
      setActiveTab('quotations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="robocup-special-mention" 
      className="relative rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12 space-y-8"
    >
      {/* Dynamic ambient gradient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

      {/* Top Banner Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider uppercase">
            <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>SPECIAL MENTION · NATIONAL CHAMPIONSHIP 2026-27</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            National <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">ROBOCUP</span> Hackathon
          </h2>

          {/* Big Eye-Catching Teaser Tagline */}
          <div className="inline-block px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-lg shadow-amber-500/20 transform hover:scale-[1.01] transition-transform">
            ⚡ COMING SOON — BE READY FOR UPDATES!
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
            Balki Technologies is proud to announce that the <strong className="text-white">National ROBOCUP STEM Hackathon 2026-27</strong> is actively being organized! India's most thrilling school and collegiate robotics championship designed for Atal Tinkering Labs, STEM innovation clubs, and young engineers (Classes 6 to 12 & Polytechnic).
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleQuotationsClick}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>View ATL 169-Product Quotations</span>
          </button>

          <button
            onClick={handleRoboticsClick}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Explore Hackathon Prep Hardware</span>
          </button>
        </div>
      </div>

      {/* 4 Core Competition Tracks */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Featured Competition Arenas & Hardware Tracks</span>
          </div>
          <span className="text-xs font-mono text-amber-400/90">Classes 6–12 & Polytechnic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Track 1: Maze & Line Follower */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-3 border border-amber-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Track 01 · Autonomous
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Maze Solver & Line Tracker
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Design autonomous wheeled rovers equipped with PID algorithms, ultrasonic distance arrays, and reflectance IR sensors to map and navigate timed labyrinths.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Hardware: Arduino Uno R3 / Nano + Dual H-Bridge Motor Shields
            </div>
          </div>

          {/* Track 2: AI Computer Vision */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Track 02 · Computer Vision
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                AI Vision Robotic Arm Sorter
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Harness ESP32-CAM or Raspberry Pi edge vision to recognize colored objects, detect geometrical flaws, and sort items with 4-DOF robotic grippers.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Hardware: 4-DOF Acrylic Arm + ESP32-CAM / OpenCV Web Interface
            </div>
          </div>

          {/* Track 3: Robo-Soccer Arena */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Track 03 · Arena Duel
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Robo-Soccer Championship
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-speed 2v2 and 3v3 team soccer showdown. Telemetry via Bluetooth or RF transceivers, testing motor torque, chassis balance, and defensive strategies.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Hardware: 4WD Robot Chassis + High-RPM Metal Gear DC Motors
            </div>
          </div>

          {/* Track 4: Drone Waypoint Mission */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all group flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-3 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Track 04 · Aerial Avionics
              </span>
              <h3 className="font-bold text-white text-base mt-2">
                Autonomous Drone Mission
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Program ArduPilot flight controllers for precision GPS waypoint fly-throughs, obstacle hovering, and payload delivery simulations for Classes 11–12.
              </p>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-medium">
              Hardware: Autonomous AI Edge Drone Lab Kit + Mission Planner
            </div>
          </div>

        </div>
      </div>

      {/* Hackathon Roadmap & What To Expect */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left Column: Roadmap Steps */}
        <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Event Roadmap: How Schools & Students Can Prepare</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              Status: Organizing Phase
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5">
              <div className="font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-mono">1</span>
                <span>Rulebook & Challenge Reveal</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Detailed arena schematics, scoring criteria, and team eligibility guidelines releasing shortly for ATL schools across India.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5">
              <div className="font-bold text-blue-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px] font-mono">2</span>
                <span>Free Mentor Masterclasses</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Complimentary 4-week virtual masterclasses covering PID control tuning, computer vision pipelines, and kit calibration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px] font-mono">3</span>
                <span>Zonal Qualifiers (Online/Hybrid)</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Submit video demonstrations, code repositories, and participate in regional telemetry trials to qualify for the national stage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5">
              <div className="font-bold text-purple-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-mono">4</span>
                <span>Grand National Finale in Hyderabad</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Over ₹10,00,000+ in school lab upgrade grants, student scholarships, and national trophies awarded by industry and academia experts.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Register & Be Ready for Updates */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Priority Notification Portal</span>
            </div>
            <h3 className="font-black text-white text-base">
              Be Ready For Updates!
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Sign up below to be the first to receive the official ROBOCUP rulebook, registration links, and early-bird school squad slots.
            </p>
          </div>

          {isSubscribed ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You're on the priority notification list!</span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                We'll email you the complete ROBOCUP 2026-27 schedule, challenge rulebook, and team registration forms the moment they launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="School / College / Club Name"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/90 text-white rounded-xl border border-slate-700 focus:border-amber-500 text-xs outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address (Principal / Coordinator / Student)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/90 text-white rounded-xl border border-slate-700 focus:border-amber-500 text-xs outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">I am a:</span>
                <button
                  type="button"
                  onClick={() => setRoleInput('student')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                    roleInput === 'student' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRoleInput('teacher')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                    roleInput === 'teacher' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  ATL Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRoleInput('mentor')}
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                    roleInput === 'mentor' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Club Mentor
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Me When Registrations Open</span>
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Organized by Balki Technologies</span>
            <span className="text-amber-400 font-semibold">Tinkering Passport Certified</span>
          </div>
        </div>

      </div>

    </section>
  );
};
