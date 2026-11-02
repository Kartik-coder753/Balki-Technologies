import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Play, 
  Code2, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  Radio, 
  Zap, 
  Compass, 
  Cpu, 
  RotateCw, 
  Printer, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, CourseLesson, UserProgress } from '../types';

interface InteractiveCoursePlayerProps {
  course: Course;
  onClose: () => void;
  userProgress: UserProgress;
  onCompleteLesson: (lessonId: string, quizScore: number, courseId: string, courseTitle: string) => void;
}

export const InteractiveCoursePlayer: React.FC<InteractiveCoursePlayerProps> = ({
  course,
  onClose,
  userProgress,
  onCompleteLesson
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const currentLesson: CourseLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  // Simulator states
  // 1. LED Circuit
  const [switchClosed, setSwitchClosed] = useState(false);
  const [batteryVoltage, setBatteryVoltage] = useState(3.3);

  // 2. Ultrasonic Radar
  const [obstacleDistance, setObstacleDistance] = useState(24); // cm
  const [radarPingActive, setRadarPingActive] = useState(false);

  // 3. Servo / Motor
  const [servoAngle, setServoAngle] = useState(90);

  // 4. Drone PID
  const [targetAltitude, setTargetAltitude] = useState(5.0);
  const [currentAltitude, setCurrentAltitude] = useState(4.2);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Code editor simulated state
  const [userCode, setUserCode] = useState(currentLesson.codeSnippet || '');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const isCurrentLessonDone = userProgress.completedLessonIds.includes(currentLesson.id);
  const allLessonsDone = course.lessons.every(l => userProgress.completedLessonIds.includes(l.id));

  // Switch lesson
  const handleSelectLesson = (idx: number) => {
    setActiveLessonIndex(idx);
    const nextLesson = course.lessons[idx];
    setUserCode(nextLesson.codeSnippet || '');
    setSelectedOption(null);
    setQuizSubmitted(false);
    setConsoleLogs([]);
  };

  // Run Code / Simulation
  const handleRunSimulation = () => {
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Initializing Balki Virtual Runtime v2.4...`);

    if (currentLesson.simulationType === 'led_blink') {
      if (switchClosed) {
        logs.push(`⚡ Circuit Status: CLOSED (Loop Verified)`);
        logs.push(`VCC = ${batteryVoltage}V -> Forward Bias across LED -> Current = ${(batteryVoltage / 220 * 1000).toFixed(1)} mA`);
        logs.push(`💡 High-intensity Amber LED illuminated successfully!`);
      } else {
        logs.push(`⭕ Circuit Status: OPEN (Air Gap in Switch)`);
        logs.push(`Current = 0.00 mA. LED is OFF.`);
      }
    } else if (currentLesson.simulationType === 'ultrasonic_radar') {
      setRadarPingActive(true);
      setTimeout(() => setRadarPingActive(false), 1200);
      const pingDurationUs = Math.round((obstacleDistance * 2) / 0.034);
      logs.push(`📡 Emitting 40kHz Ultrasonic Burst from HC-SR04 Trigger...`);
      logs.push(`Echo bounce received after ${pingDurationUs} microseconds.`);
      logs.push(`Formula: Distance = (${pingDurationUs} × 0.034) / 2 = ${obstacleDistance} cm`);
      if (obstacleDistance < 20) {
        logs.push(`⚠️ COLLISION PROXIMITY ALERT! Rover Command: STOP MOTORS -> REVERSE -> ROTATE 90°`);
      } else {
        logs.push(`✅ Path Clear: Rover Proceeding Forward at 100% Speed.`);
      }
    } else if (currentLesson.simulationType === 'servo_sweep') {
      const pulseWidthUs = Math.round(1000 + (servoAngle / 180) * 1000);
      logs.push(`⚙️ PWM Signal Pulse Width: ${pulseWidthUs} µs`);
      logs.push(`H-Bridge Channel A & B: Activated`);
      logs.push(`Steering angle locked at: ${servoAngle}° relative to center`);
    } else if (currentLesson.simulationType === 'drone_telemetry') {
      const error = targetAltitude - currentAltitude;
      const throttleAdjustment = (error * 1.2).toFixed(2);
      logs.push(`🛸 IMU Accelerometer + Barometer Altitude: ${currentAltitude.toFixed(1)}m`);
      logs.push(`Target Altitude: ${targetAltitude.toFixed(1)}m | Error: ${error.toFixed(2)}m`);
      logs.push(`PID Throttle Correction: ${throttleAdjustment}% thrust vector applied to ESCs.`);
      logs.push(`Flight Status: HOVER STABILIZED`);
    } else {
      logs.push(`Execution completed with exit code 0.`);
    }

    setConsoleLogs(logs);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);

    const isCorrect = selectedOption === currentLesson.quiz.correctIndex;
    const score = isCorrect ? 100 : 50;

    onCompleteLesson(currentLesson.id, score, course.id, course.title);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-in fade-in">
      {/* Top Bar */}
      <div className="relative bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between text-white shrink-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
          alt="Circuit Telemetry Simulation"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/70 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{course.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {course.gradeLevel}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Lesson {activeLessonIndex + 1} of {course.lessons.length}: {currentLesson.title}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          {allLessonsDone && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>View Official Certificate</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Learning Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Lessons Navigation */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Modules
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              NEP 2020 Hands-On Tinkering
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
              const isActive = idx === activeLessonIndex;

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate text-slate-200">{lesson.title}</p>
                    <span className="text-[10px] text-slate-500">{lesson.durationMinutes} mins</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400">
            <span className="block font-semibold text-slate-300">Tinkering Log:</span>
            <span>+1.5 ATL Hours recorded per lesson completion.</span>
          </div>
        </div>

        {/* Center / Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-950 text-slate-200">
          {/* Lesson Header */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <span>Class: {course.gradeLevel}</span>
              <span>•</span>
              <span>Module {activeLessonIndex + 1}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white">
              {currentLesson.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {currentLesson.theoryContent}
            </p>

            {/* INTERACTIVE SIMULATOR WORKBENCH */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Balki STEM Interactive Lab Simulator</span>
                </div>
                <button
                  onClick={handleRunSimulation}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Circuit & Test</span>
                </button>
              </div>

              {/* Visual Simulated Canvas */}
              <div className="p-6 bg-slate-950/80 border-b border-slate-800/80">
                {/* 1. LED Circuit Simulator */}
                {currentLesson.simulationType === 'led_blink' && (
                  <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
                    {/* Switch Control */}
                    <div className="text-center space-y-3">
                      <span className="text-xs font-semibold text-slate-400 block">SPST Toggle Switch</span>
                      <button
                        onClick={() => setSwitchClosed(!switchClosed)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                          switchClosed
                            ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {switchClosed ? 'SWITCH: CLOSED (ON)' : 'SWITCH: OPEN (OFF)'}
                      </button>
                      <p className="text-[10px] text-slate-500">Click to connect/disconnect circuit</p>
                    </div>

                    {/* Circuit Wiring Wire Animation */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span>3.3V</span>
                      <div className={`h-1 w-20 rounded transition-all duration-300 ${switchClosed ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-slate-700'}`} />
                      <span>220Ω</span>
                      <div className={`h-1 w-20 rounded transition-all duration-300 ${switchClosed ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'bg-slate-700'}`} />
                      <span>GND</span>
                    </div>

                    {/* Virtual High Brightness LED */}
                    <div className="text-center space-y-2">
                      <span className="text-xs font-semibold text-slate-400 block">Virtual 5mm LED</span>
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center ${
                            switchClosed
                              ? 'bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,1)] text-amber-950 scale-110'
                              : 'bg-slate-800 border-2 border-slate-700 text-slate-600'
                          }`}
                        >
                          <Zap className={`w-8 h-8 ${switchClosed ? 'fill-amber-950' : ''}`} />
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${switchClosed ? 'text-amber-400' : 'text-slate-500'}`}>
                        {switchClosed ? 'LED ILLUMINATED' : 'CIRCUIT BROKEN'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Ultrasonic Radar Simulator */}
                {currentLesson.simulationType === 'ultrasonic_radar' && (
                  <div className="space-y-4 py-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-300">Target Obstacle Distance</span>
                        <p className="text-[11px] text-slate-500">Slide distance to test rover reaction threshold</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={5}
                          max={100}
                          value={obstacleDistance}
                          onChange={(e) => setObstacleDistance(Number(e.target.value))}
                          className="w-48 accent-amber-500"
                        />
                        <span className="text-sm font-mono font-bold text-amber-400 w-16 text-right">
                          {obstacleDistance} cm
                        </span>
                      </div>
                    </div>

                    {/* Visual Ultrasonic Echo Wave */}
                    <div className="relative h-28 bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between overflow-hidden">
                      {/* HC-SR04 Sensor Box */}
                      <div className="flex items-center gap-2 bg-blue-950 border border-blue-800 p-2 rounded-lg text-blue-200 text-xs shrink-0">
                        <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
                        <div>
                          <span className="font-bold block">HC-SR04</span>
                          <span className="text-[9px] text-blue-400">Trig & Echo</span>
                        </div>
                      </div>

                      {/* Echo Beam Waves */}
                      <div className="flex-1 px-4 relative flex items-center justify-center">
                        <div className={`h-0.5 w-full bg-slate-800 ${radarPingActive ? 'animate-ping bg-amber-400' : ''}`} />
                        <span className="absolute text-[10px] font-mono text-amber-400/80 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          ~{Math.round((obstacleDistance * 2) / 0.034)} µs return trip
                        </span>
                      </div>

                      {/* Obstacle Box */}
                      <div
                        className={`p-3 rounded-lg border text-xs font-bold shrink-0 transition-all ${
                          obstacleDistance < 20
                            ? 'bg-red-950 border-red-600 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {obstacleDistance < 20 ? '⚠️ Obstacle Hazard (<20cm)' : 'Obstacle Ahead'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Servo Motor Simulator */}
                {currentLesson.simulationType === 'servo_sweep' && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Servo Motor Steering Angle: {servoAngle}°</span>
                      <input
                        type="range"
                        min={0}
                        max={180}
                        value={servoAngle}
                        onChange={(e) => setServoAngle(Number(e.target.value))}
                        className="w-48 accent-amber-500"
                      />
                    </div>
                    <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                      <div
                        style={{ transform: `rotate(${servoAngle - 90}deg)` }}
                        className="w-32 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-transform duration-200 relative origin-left flex items-center justify-end pr-1 shadow-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Drone Telemetry Simulator */}
                {currentLesson.simulationType === 'drone_telemetry' && (
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Target Flight Altitude: {targetAltitude}m</span>
                        <input
                          type="range"
                          min={1}
                          max={15}
                          step={0.5}
                          value={targetAltitude}
                          onChange={(e) => setTargetAltitude(Number(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Barometer Real Altitude: {currentAltitude}m</span>
                        <input
                          type="range"
                          min={1}
                          max={15}
                          step={0.1}
                          value={currentAltitude}
                          onChange={(e) => setCurrentAltitude(Number(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                      PID Output: Throttle adjust = {((targetAltitude - currentAltitude) * 1.2).toFixed(2)}% • Gyro Roll: 0.0° • Pitch: 0.0°
                    </div>
                  </div>
                )}
              </div>

              {/* Code Snippet & Console */}
              <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-950">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Embedded Code ({currentLesson.codeLanguage?.toUpperCase() || 'C++'})</span>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={7}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-200 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>Virtual Serial Output Monitor</span>
                  </div>
                  <div className="h-44 p-3 bg-slate-900/90 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1">
                    {consoleLogs.length === 0 ? (
                      <p className="text-slate-600 italic">Click "Run Circuit & Test" to execute code simulation...</p>
                    ) : (
                      consoleLogs.map((log, i) => (
                        <p key={i} className="text-amber-300/90">{log}</p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* KNOWLEDGE CHECK QUIZ */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  Knowledge Check & ATL Verification Quiz
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {currentLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {currentLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentLesson.quiz.correctIndex;

                  let style = 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      style = 'border-red-500 bg-red-950/40 text-red-200';
                    }
                  } else if (isSelected) {
                    style = 'border-amber-500 bg-amber-950/30 text-amber-200 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-amber-400 block">Explanation:</span>
                  <p className="text-slate-300">{currentLesson.quiz.explanation}</p>
                </div>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedOption === null}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Submit Answer & Complete Lesson
                </button>
              )}
            </div>

            {/* Bottom Lesson Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={activeLessonIndex === 0}
                onClick={() => handleSelectLesson(activeLessonIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Lesson</span>
              </button>

              <button
                disabled={activeLessonIndex === course.lessons.length - 1}
                onClick={() => handleSelectLesson(activeLessonIndex + 1)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OFFICIAL COMPLETION CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-500 relative animate-in zoom-in-95">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-4 border-2 border-slate-200 p-6 rounded-2xl bg-amber-50/20">
              <div className="flex items-center justify-center gap-2">
                <Cpu className="w-8 h-8 text-amber-600" />
                <h3 className="text-xl font-black tracking-tight text-slate-900">
                  BALKI TECHNOLOGIES PVT. LTD.
                </h3>
              </div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                National STEM & Atal Tinkering Innovation Certificate
              </p>

              <div className="py-4 space-y-2">
                <p className="text-xs text-slate-500">This is to officially certify that</p>
                <h2 className="text-2xl font-extrabold text-slate-900 border-b-2 border-amber-400 inline-block px-8 pb-1">
                  {userProgress.studentName}
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  of <strong className="text-slate-800">{userProgress.schoolName}</strong> has successfully mastered
                </p>
                <h4 className="text-base font-bold text-amber-800">
                  {course.title}
                </h4>
                <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                  Demonstrating verified proficiency in circuit fundamentals, algorithmic coding, sensor calibration, and hands-on ATL tinkering hours under NEP 2020 guidelines.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                <div className="text-left">
                  <p className="font-mono text-[10px] text-slate-400">ID: BALKI-CERT-{Date.now().toString().slice(-6)}</p>
                  <p className="text-slate-600 text-[11px]">Issued: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 px-4 font-serif italic text-sm text-slate-800">
                    Balki Technologies
                  </div>
                  <p className="text-[10px] text-slate-500">Authorized Signatory & Founder</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
              >
                Return to Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
