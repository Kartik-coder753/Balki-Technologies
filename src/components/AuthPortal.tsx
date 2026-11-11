import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Cpu,
  GraduationCap,
  Award,
  ExternalLink,
  Copy,
  Check,
  Globe,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseAuthError } from '../lib/firebase';
import { BalkiLogo } from './BalkiLogo';

export interface AuthPortalProps {
  initialMode?: 'login' | 'register';
  contextMessage?: string;
  onClose?: () => void;
  onSuccess?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  initialMode = 'login',
  contextMessage,
  onClose,
  onSuccess,
  isModal = false,
  isOpen = true
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Sync mode with prop changes
  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regInstitution, setRegInstitution] = useState('');
  const [regInstitutionType, setRegInstitutionType] = useState('Kendriya Vidyalaya');
  const [regRole, setRegRole] = useState('ATL In-Charge');
  const [regPhone, setRegPhone] = useState('');

  // Status & error state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState<boolean>(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authAction, setAuthAction] = useState<string>('');

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'balki-technologies.vercel.app';

  const copyHostname = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentHost);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2500);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsUnauthorizedDomain(false);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter both your registered email and password.');
      return;
    }

    setIsLoading(true);
    setAuthAction('login');

    try {
      await signInWithEmail(loginEmail.trim(), loginPassword);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      const parsed = parseAuthError(err);
      setErrorMsg(parsed.message);
      setIsUnauthorizedDomain(parsed.isUnauthorizedDomain);
    } finally {
      setIsLoading(false);
      setAuthAction('');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsUnauthorizedDomain(false);

    if (!regEmail.trim()) {
      setErrorMsg('Please provide a valid institutional or personal email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setAuthAction('register');

    try {
      await signUpWithEmail(regEmail.trim(), regPassword, {
        displayName: regName.trim() || 'Client Partner',
        institution: regInstitution.trim() || 'Atal Tinkering Lab Partner',
        institutionType: regInstitutionType,
        role: regRole,
        phone: regPhone.trim()
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Registration error:', err);
      const parsed = parseAuthError(err);
      setErrorMsg(parsed.message);
      setIsUnauthorizedDomain(parsed.isUnauthorizedDomain);
    } finally {
      setIsLoading(false);
      setAuthAction('');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsUnauthorizedDomain(false);
    setIsLoading(true);
    setAuthAction('google');

    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      const parsed = parseAuthError(err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(parsed.message);
        setIsUnauthorizedDomain(parsed.isUnauthorizedDomain);
      }
    } finally {
      setIsLoading(false);
      setAuthAction('');
    }
  };

  if (isModal && !isOpen) return null;

  const cardContent = (
    <div className="w-full max-w-xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-8 backdrop-blur-xl relative my-auto">
      {/* Modal Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Context Message Banner (from protected action access like Checkout or Dashboard) */}
      {contextMessage && (
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-inner animate-in fade-in">
          <div className="p-1.5 rounded-lg bg-amber-500/25 text-amber-400 shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 flex-1">
            <span className="font-bold text-amber-300 block text-xs">
              Account Authentication Required
            </span>
            <p className="text-amber-100/90 leading-relaxed text-xs">
              {contextMessage}
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Authorized Client & Institutional Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Sign In to Your Account' : 'Register Institutional Client Account'}
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {mode === 'login' 
                ? 'Access official Atal Tinkering Lab equipment packages, track consignments, manage quotations, and submit verified reviews.' 
                : 'Create your account to unlock full equipment catalogs, institutional Net-30 purchase orders, and direct lab procurement.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); setIsUnauthorizedDomain(false); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In (Existing Client)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); setIsUnauthorizedDomain(false); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account (New Client)
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex flex-col gap-2.5 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>

              {/* Special Diagnostic Guide for auth/unauthorized-domain */}
              {isUnauthorizedDomain && (
                <div className="mt-2 pt-2.5 border-t border-rose-500/20 bg-slate-950/60 p-3 rounded-lg text-slate-300 text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      Domain Authorization Fix Required
                    </span>
                    <button
                      type="button"
                      onClick={copyHostname}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] cursor-pointer transition-colors"
                    >
                      {copiedHost ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHost ? 'Copied!' : 'Copy Domain'}</span>
                    </button>
                  </div>
                  <p className="text-slate-400 leading-normal">
                    Firebase blocks authentication requests from domains that are not explicitly authorized in the Firebase Console.
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded p-2 text-amber-200/90 font-mono text-[10px] break-all">
                    Current Domain: <span className="text-white font-bold">{currentHost}</span>
                  </div>
                  <div className="space-y-1 text-slate-400 text-[10.5px]">
                    <div className="font-semibold text-slate-200">Quick 30-Second Solution in Firebase Console:</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                      <li>Go to <strong>Firebase Console</strong> → Select project <code className="text-amber-400">gen-lang-client-0184886612</code></li>
                      <li>Navigate to <strong>Authentication</strong> → <strong>Settings</strong> tab → <strong>Authorized domains</strong></li>
                      <li>Click <strong>Add domain</strong> and paste <code className="text-amber-400">{currentHost}</code> (also add <code className="text-amber-400">localhost</code> for dev)</li>
                      <li>Click <strong>Save</strong> and reload this page to sign in immediately.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. principal@school.edu.in or your email"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading && authAction === 'login' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Log In to Client Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Dr. Sunita Rao"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      disabled={isLoading}
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. educator@school.edu.in or your email"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Set Account Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    School / Institution Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      placeholder="e.g. Kendriya Vidyalaya No. 1"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institution Category
                  </label>
                  <select
                    disabled={isLoading}
                    value={regInstitutionType}
                    onChange={(e) => setRegInstitutionType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none disabled:opacity-60"
                  >
                    <option value="Kendriya Vidyalaya">Kendriya Vidyalaya (KVS)</option>
                    <option value="Navodaya Vidyalaya">Jawahar Navodaya (JNV)</option>
                    <option value="Private CBSE/ICSE">Private CBSE / ICSE / IB</option>
                    <option value="Govt Model School">State Govt Model School</option>
                    <option value="University/College">University / Engineering College</option>
                    <option value="Corporate/Industrial">Corporate / Industrial CSR</option>
                    <option value="Individual Tinkerer">Individual Student / Tinkerer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Designation / Role in Lab
                </label>
                <select
                  disabled={isLoading}
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none disabled:opacity-60"
                >
                  <option value="ATL In-Charge">ATL In-Charge & Tinkering Mentor</option>
                  <option value="Principal / Director">Principal / School Director</option>
                  <option value="STEM Educator">Physics / Computer Science Educator</option>
                  <option value="Student Innovator">Student Innovator (Classes 6-12)</option>
                  <option value="Procurement Officer">Institutional Procurement Officer</option>
                  <option value="Lab Coordinator">Robotics Lab Coordinator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading && authAction === 'register' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Registering Account in Database...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Registered Account</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social / Google Sign In Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Or Instant Verification
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading && authAction === 'google' ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <span>Connecting with Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Verified Google Account</span>
              </>
            )}
          </button>

          {/* Institutional Trust Badges */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
            <div className="flex flex-col items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>NITI Aayog Standard</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>100% Tested Hardware</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>NEP 2020 Aligned</span>
            </div>
          </div>

          {/* Return to website link if modal or onClose is provided */}
          {onClose && (
            <div className="mt-5 pt-3.5 border-t border-slate-800/60 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Continue browsing BALKI TECHNOLOGIES as guest</span>
              </button>
            </div>
          )}
        </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-150"
        aria-modal="true"
        role="dialog"
      >
        <div className="fixed inset-0 -z-10" onClick={onClose} />
        {cardContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.06),transparent_50%)] pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <BalkiLogo type="full" variant="dark" className="h-8 sm:h-10 w-auto max-w-[160px] sm:max-w-[240px]" />
            <div className="hidden sm:block">
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                Official AIM ATL & NEP 2020 Hardware Partner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="hidden min-[380px]:inline">Encrypted Client Database</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Content */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 my-2 sm:my-6">
        {cardContent}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950">
        © 2026 Balki Technologies Pvt. Ltd. All rights reserved. Secure Cloud SQL & Firestore Database.
      </footer>
    </div>
  );
};
