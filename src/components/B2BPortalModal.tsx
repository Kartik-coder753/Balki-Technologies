import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  Download, 
  Send, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Calculator
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadCurriculumGuide } from '../utils/downloadHelpers';

interface B2BPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const B2BPortalModal: React.FC<B2BPortalModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'quote' | 'partner'>('quote');
  const [schoolName, setSchoolName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityState, setCityState] = useState('');
  const [studentStrength, setStudentStrength] = useState(150);
  const [packageType, setPackageType] = useState<'Basic Starter' | 'Comprehensive ATL Lab' | 'Advanced AI & Robotics'>('Comprehensive ATL Lab');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  if (!isOpen) return null;

  // Estimated budget based on students and package
  const calculateEstimatedBudget = () => {
    if (packageType === 'Basic Starter') return '₹1,50,000 - ₹2,50,000';
    if (packageType === 'Comprehensive ATL Lab') return '₹4,00,000 - ₹6,50,000';
    return '₹7,50,000 - ₹12,00,000';
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/b2b/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName,
          contactPerson,
          email,
          phone,
          cityState,
          studentStrength,
          packageType,
          estimatedBudget: calculateEstimatedBudget(),
          notes
        })
      });

      if (!res.ok) throw new Error('Failed to submit quote request');
      setQuoteSubmitted(true);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      alert('Unable to submit request. Please reach out to balki.technologies@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-slate-950 text-white px-6 py-5 flex items-center justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
            alt="School ATL & Partner Solutions"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/30 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">School ATL & Partner Solutions Portal</h3>
              <p className="text-[10px] text-slate-300">Atal Innovation Mission (AIM) & NEP 2020 Standardized</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setTab('quote')}
            className={`flex-1 py-3 px-4 text-center font-bold border-r border-slate-200 transition-colors ${
              tab === 'quote' ? 'bg-white text-amber-700 border-b-2 border-b-amber-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Request ATL Lab Quotation
          </button>
          <button
            onClick={() => setTab('partner')}
            className={`flex-1 py-3 px-4 text-center font-bold transition-colors ${
              tab === 'partner' ? 'bg-white text-amber-700 border-b-2 border-b-amber-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tinkering Lab Partner Supply
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {quoteSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Quotation Request Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-800">{contactPerson || 'Educator'}</strong>. Our B2B Lab Implementation Lead will reach out within 4 business hours with an official itemized quotation and complete curriculum guide for <strong className="text-slate-800">{schoolName}</strong>.
              </p>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 max-w-sm mx-auto text-xs text-amber-900 space-y-1 text-left">
                <p><strong>Direct Helpline:</strong> +91-9071199139</p>
                <p><strong>Official Email:</strong> balki.technologies@gmail.com</p>
                <p><strong>Includes:</strong> Free On-site Setup, Teacher Training & 12M Warranty</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  id="btn-download-b2b-specs"
                  onClick={() => downloadCurriculumGuide()}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ATL Specs & Curriculum (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setQuoteSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : tab === 'quote' ? (
            <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">School / Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad Public School, Begumpet"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Principal / Lab Coordinator Name *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Direct Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City & State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Package Tier */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Lab Package Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Basic Starter', desc: 'Classes 3–8 Starter Kits & Sensors' },
                    { id: 'Comprehensive ATL Lab', desc: 'Full NITI Aayog AIM Standard Package' },
                    { id: 'Advanced AI & Robotics', desc: 'AI Edge, 3D Printers & IoT' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPackageType(tier.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        packageType === tier.id
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold">{tier.id}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{tier.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Strength Slider */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Student Strength: {studentStrength} Students</span>
                  <span className="font-bold text-amber-700 font-mono">Estimated: {calculateEstimatedBudget()}</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={studentStrength}
                  onChange={(e) => setStudentStrength(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Quotation Request...' : 'Submit Official ATL Quotation Request'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2 text-amber-950">
                <h4 className="font-bold text-sm">For Tinkering Lab Implementation Partners</h4>
                <p className="leading-relaxed">
                  Companies that specialize in setting up ATL/STEM labs in schools and running educational programs inside them: Balki Technologies offers bulk supply of pre-tested electronic components, sensors, Arduino/ESP32 boards, and experiment kits at wholesale B2B pricing with zero supply bottleneck.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider">Partner Benefits:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reference solution tested across 50,000+ ATL Labs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct founder mentorship and priority warehouse stock reservation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sample requests fulfilled within 48 hours for client pitches</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                <div>
                  <span className="font-bold block">Speak with our B2B Channel Head:</span>
                  <p className="text-slate-300">Call <strong>+91-9071199139</strong> or email <strong>balki.technologies@gmail.com</strong> for bulk partner price cards.</p>
                </div>
                <button
                  type="button"
                  id="btn-download-partner-specs"
                  onClick={() => downloadCurriculumGuide()}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete ATL Hardware & Lab Guide (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
