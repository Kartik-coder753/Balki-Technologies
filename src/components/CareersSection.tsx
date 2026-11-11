import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Send, 
  FileText, 
  Sparkles, 
  Phone, 
  Mail, 
  Building2, 
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CareersSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Hyderabad, Telangana');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech / BBA / MBA');
  const [languages, setLanguages] = useState('English, Hindi, Telugu');
  const [whyBalki, setWhyBalki] = useState('');
  const [resumeFileName, setResumeFileName] = useState('My_Resume.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/internship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          location,
          college,
          degree,
          languages,
          whyBalki,
          resumeFileName
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setApplicationSuccess(true);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      alert('Unable to send application. Please email balki.technologies@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Immersive Team Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
          alt="Balki Technologies STEM Team"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/30 pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Join Our Mission • Building India's STEM Backbone</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Careers at Balki Technologies
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            We are scaling nationwide to empower 50,000+ Atal Tinkering Labs with grade-progressive robotics, electronics kits, and teacher enablement. Come build the partner network that powers Indian school innovation.
          </p>
        </div>
      </section>

      {/* Featured Opening: Marketing Intern */}
      <div className="bg-white rounded-3xl border-2 border-amber-500/60 shadow-xl overflow-hidden">
        {/* Role Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 md:p-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
            alt="B2B Channel Marketing Strategy Session"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                Featured Career Opportunity
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-1">
                Marketing Intern (B2B Outreach & Channel Sales)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Balki Technologies Pvt. Ltd. • School Lab Implementation Partner Strategy
              </p>
            </div>

            <a
              href="#apply-form"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg self-start md:self-auto transition-all"
            >
              Apply Online Now
            </a>
          </div>

          {/* Quick Metrics Bar from Document */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Remote / WFH
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                3–6 Months
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Type</span>
              <span className="font-extrabold text-white flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                Full-Time Intern
              </span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Stipend</span>
              <span className="font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3.5 h-3.5" />
                Fixed + Incentives
              </span>
            </div>
          </div>
        </div>

        {/* Role Content Details */}
        <div className="p-6 md:p-8 space-y-8">
          {/* About & The Opportunity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider text-amber-700">
                About Balki Technologies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Balki Technologies is building India's most complete STEM education ecosystem — a single, grade-progressive robotics and electronics kit line (Classes 3–12) designed to meet ATL (Atal Tinkering Lab) and NEP 2020 requirements across India's 50,000+ mandated ATL Labs. Our kits span Junior Experiment Kits through Advanced Robotics, AI, Smart Sensors, and 3D Printing & Design — bundled with free installation, teacher training, and warranty support.
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider text-amber-700">
                The Opportunity
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Balki Technologies doesn't just sell directly to schools — we also work through Tinkering Lab implementation partners: companies that specialize in setting up ATL/STEM labs in schools and running educational programs inside them. As a Marketing Intern, you'll be on the front line of our B2B channel-sales strategy — working fully remotely — identifying and reaching out to lab-setup and STEM-education companies across India, opening conversations, and building recurring supply relationships.
              </p>
            </div>
          </div>

          {/* What You'll Do & Who You Are */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                What You'll Do
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {[
                  'Identify targets: Research and build a database of companies that install Tinkering/ATL Labs in schools and run STEM programs across Indian states.',
                  'Outreach & prospecting: Reach out via calls, email, and LinkedIn to introduce Balki Technologies as a reliable, cost-effective component supplier.',
                  'Pitch & qualify: Communicate product range, pricing, and quality advantages; qualify sourcing scale.',
                  'Pipeline management: Track every contact, conversation, and follow-up in a CRM/spreadsheet.',
                  'Relationship building: Nurture early conversations into meetings, sample requests, and purchase orders closely with the founder.',
                  'Market feedback: Bring back insights on partner needs, competitor offerings, and product opportunities.',
                  'Marketing collateral: Tailor pitch decks, one-pagers, and outreach messaging.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Who You Are
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {[
                  'A student or recent graduate (Business, Marketing, Engineering, or related field) with strong communication skills in English and Hindi/Telugu (regional language skills are a plus).',
                  'Comfortable making cold calls and sending cold emails — not afraid of hearing "no" and resilient.',
                  'Organized and detail-oriented; proactive in timely follow-ups.',
                  'Curious about EdTech, robotics, or hardware — excited to learn fast in a startup environment.',
                  'Confident using tools like Excel/Google Sheets, LinkedIn, and email; CRM experience is a bonus.',
                  'Self-starter disciplined and productive working remotely.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What You'll Gain (4 Cards) */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              What You'll Gain
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-amber-900 text-sm">Real B2B Sales Experience</h4>
                <p className="text-slate-600">Own a live pipeline and turn outreach into actual revenue conversations.</p>
              </div>
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-amber-900 text-sm">Direct Founder Mentorship</h4>
                <p className="text-slate-600">Work closely with the founder inside a fast-scaling STEM startup.</p>
              </div>
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-amber-900 text-sm">Front-Row Industry Access</h4>
                <p className="text-slate-600">In active talks to standardize our kit across 50,000+ ATL Labs nationwide.</p>
              </div>
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-amber-900 text-sm">Certificate + Incentives</h4>
                <p className="text-slate-600">Certificate, LOR, and performance-based incentives, with path to full-time.</p>
              </div>
            </div>
          </div>

          {/* Interactive Application Form */}
          <div id="apply-form" className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6 scroll-mt-24">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Online Application Form
                </h3>
                <p className="text-xs text-slate-500">
                  Apply directly for Marketing Intern (B2B Outreach & Channel Sales)
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 hidden sm:block">
                <span>Or email resume to:</span>
                <p className="font-mono text-amber-700 font-bold">balki.technologies@gmail.com</p>
              </div>
            </div>

            {applicationSuccess ? (
              <div className="text-center py-8 space-y-3 bg-white p-6 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Application Submitted Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{fullName}</strong>. Our founder and hiring team will review your credentials and contact you at <strong>{phone}</strong> / <strong>{email}</strong> within 48 hours for an introductory call.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setApplicationSuccess(false)}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul.sharma@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Current City / State *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">College / University Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Osmania University / NIT / BITS"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Languages Spoken *</label>
                    <input
                      type="text"
                      required
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Why are you excited about STEM education or B2B sales at Balki Technologies? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us briefly about your interests, past experiences, or drive to connect schools with robotics kits..."
                    value={whyBalki}
                    onChange={(e) => setWhyBalki(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Resume Upload Simulation */}
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white text-center space-y-1">
                  <UploadCloud className="w-6 h-6 text-amber-600 mx-auto" />
                  <p className="font-bold text-slate-700">Attach Resume / CV (PDF or DOC)</p>
                  <p className="text-[11px] text-slate-400">Attached: {resumeFileName}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Direct Founder Contact: <strong>+91-9071199139</strong>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting Application...' : 'Submit Application to Founder'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
