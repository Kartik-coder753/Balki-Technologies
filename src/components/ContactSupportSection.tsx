import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Search, 
  LifeBuoy, 
  FileText, 
  Headphones, 
  MessageSquare, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  Calendar,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportTicket } from '../types';
import { SUPPORT_FAQS, DIAGNOSTIC_GUIDES } from '../data/supportData';

interface ContactSupportSectionProps {
  tickets: SupportTicket[];
  onAddTicket: (ticket: SupportTicket) => void;
  openB2BModal: () => void;
}

export const ContactSupportSection: React.FC<ContactSupportSectionProps> = ({
  tickets,
  onAddTicket,
  openB2BModal
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'tracker' | 'diagnostics' | 'hubs'>('submit');
  
  // Ticket Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<SupportTicket['role']>('ATL Lab In-Charge');
  const [institutionName, setInstitutionName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Hardware Defect & 12-Month Replacement');
  const [orderIdOrSku, setOrderIdOrSku] = useState('');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Urgent (Classroom Paused)');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newlyCreatedTicket, setNewlyCreatedTicket] = useState<SupportTicket | null>(null);

  // Ticket Lookup State
  const [searchTicketQuery, setSearchTicketQuery] = useState('');
  const [selectedTrackedTicket, setSelectedTrackedTicket] = useState<SupportTicket | null>(tickets[0] || null);

  // FAQ Accordion State
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Diagnostics Expanded State
  const [expandedDiagId, setExpandedDiagId] = useState<string | null>('diag-1');

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description || !institutionName) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    const generatedTicketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: generatedTicketNumber,
      name,
      role,
      institutionName,
      email,
      phone: phone || '+91 9071199139',
      category,
      orderIdOrSku: orderIdOrSku || 'N/A',
      priority,
      subject: subject || `${category} - ${institutionName}`,
      description,
      status: 'Open',
      assignedEngineer: 'Balki National Support Desk (Field Tech Routing)',
      slaHours: priority === 'Urgent (Classroom Paused)' ? 4 : 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Send to server API
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });

      if (res.ok) {
        const saved = await res.json();
        onAddTicket(saved);
        setNewlyCreatedTicket(saved);
        setSelectedTrackedTicket(saved);
      } else {
        onAddTicket(newTicket);
        setNewlyCreatedTicket(newTicket);
        setSelectedTrackedTicket(newTicket);
      }

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      // Reset fields
      setName('');
      setInstitutionName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setDescription('');
      setOrderIdOrSku('');
    } catch {
      onAddTicket(newTicket);
      setNewlyCreatedTicket(newTicket);
      setSelectedTrackedTicket(newTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = searchTicketQuery.trim()
    ? tickets.filter(t => 
        (t?.ticketNumber?.toLowerCase() || '').includes(searchTicketQuery.toLowerCase()) ||
        (t?.institutionName?.toLowerCase() || '').includes(searchTicketQuery.toLowerCase()) ||
        (t?.name?.toLowerCase() || '').includes(searchTicketQuery.toLowerCase()) ||
        (t?.subject?.toLowerCase() || '').includes(searchTicketQuery.toLowerCase())
      )
    : tickets;

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Immersive Hero Banner with Background Image */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-white">
        {/* Background Photo with Low-Opacity Blend */}
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Lab Support Engineering Center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay"
        />
        {/* Deep Slate Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/40 pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold backdrop-blur-xs">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>24/7 Problem Resolvance & Pan-India Lab Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Contact Balki Technologies & School Support Helpdesk
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Uninterrupted tinkering is our solemn guarantee. Whether you need a doorstep component replacement under our 12-Month Warranty, urgent wiring troubleshooting for an ongoing class, on-site technician calibration, or GeM / School Net-30 purchase order assistance — our certified STEM engineers are at your service.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              12-Month Doorstep Replacement
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-700">
              <Wrench className="w-4 h-4 text-amber-400" />
              24–48 Hr Engineer Deployment
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400" />
              Toll-Free School Helpline (8am–8pm)
            </span>
          </div>
        </div>
      </section>

      {/* 2. Direct Instant Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Toll-Free Hotline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct School Hotline</span>
              <h3 className="text-base font-bold text-slate-900">+91-9071199139</h3>
              <p className="text-xs text-slate-500 mt-1">Toll-Free: 1800-202-STEM (7836)</p>
            </div>
          </div>
          <a
            href="tel:+919071199139"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            Call Support Now
          </a>
        </div>

        {/* WhatsApp Rapid Assistance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Lab Video Diagnostics</span>
              <h3 className="text-base font-bold text-slate-900">WhatsApp Helpdesk</h3>
              <p className="text-xs text-slate-500 mt-1">Send photos of circuits or errors for 5-min resolution.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919071199139?text=Hello%20Balki%20Technologies%20Support,%20I%20need%20help%20with%20our%20ATL%20Lab%20kit."
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Field Desk
          </a>
        </div>

        {/* Email Support Inboxes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Inboxes</span>
              <h3 className="text-sm font-bold text-slate-900 truncate">balki.technologies@gmail.com</h3>
              <p className="text-xs text-slate-500 mt-1">Institutional: schools@balkitechnologies.com</p>
            </div>
          </div>
          <a
            href="mailto:balki.technologies@gmail.com"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Write an Email
          </a>
        </div>

        {/* Institutional Quotations / GeM PO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">B2B & School Tenders</span>
              <h3 className="text-base font-bold text-slate-900">GeM & Net-30 PO</h3>
              <p className="text-xs text-slate-500 mt-1">Direct OEM supply, GST invoices, and school credit billing.</p>
            </div>
          </div>
          <button
            onClick={openB2BModal}
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Request Official Quote
          </button>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('submit')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'submit'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Log a Service / Replacement Ticket</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'tracker'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Track Ticket Status & SLA ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'diagnostics'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Self-Serve Diagnostic Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'hubs'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Regional Service Depots & Warehouses</span>
        </button>
      </div>

      {/* 4. Tab Content: Submit Ticket */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ticket Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Zero-Cost Doorstep Component Swap</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Problem Resolvance & Warranty Claim Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the details of the defective component, lab setup issue, or course inquiry. An engineer will be assigned immediately.
              </p>
            </div>

            {newlyCreatedTicket && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ticket Logged Successfully: #{newlyCreatedTicket.ticketNumber}</span>
                </div>
                <p className="text-emerald-700">
                  Assigned to: <strong className="font-semibold">{newlyCreatedTicket.assignedEngineer}</strong> • Target SLA: <strong className="font-semibold">{newlyCreatedTicket.slaHours} hours</strong>. You can track live updates in the Ticket Tracker tab.
                </p>
                <button
                  onClick={() => {
                    setSelectedTrackedTicket(newlyCreatedTicket);
                    setActiveTab('tracker');
                  }}
                  className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View in Ticket Tracker →
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as SupportTicket['role'])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  >
                    <option value="ATL Lab In-Charge">ATL Lab In-Charge</option>
                    <option value="STEM Teacher">STEM / Science Teacher</option>
                    <option value="Principal / Management">Principal / Management</option>
                    <option value="Institutional Procurement">Institutional Procurement Officer</option>
                    <option value="Student / Parent">Student / Parent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    School / Institution / Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kendriya Vidyalaya No. 2, Bengaluru"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. lab@kvs.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order ID or Product SKU (if known)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BALKI-ATL-5000 or ORD-2026-9901"
                    value={orderIdOrSku}
                    onChange={(e) => setOrderIdOrSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  >
                    <option value="Hardware Defect & 12-Month Replacement">Hardware Defect & 12-Month Replacement</option>
                    <option value="ATL Lab Installation & Setup Support">ATL Lab Installation & Setup Support</option>
                    <option value="Missing / Broken Parts in Kit">Missing / Broken Parts in Kit</option>
                    <option value="Course Platform & Certificate Query">Course Platform & Certificate Query</option>
                    <option value="Equipment Rental Support & Return">Equipment Rental Support & Return</option>
                    <option value="Order Delivery, Tracking & Invoicing">Order Delivery, Tracking & Invoicing</option>
                    <option value="B2B School Quotation & GeM Purchase Order">B2B School Quotation & GeM Purchase Order</option>
                    <option value="Technical Wiring & Code Troubleshooting">Technical Wiring & Code Troubleshooting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency / Impact on Classroom
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  >
                    <option value="Urgent (Classroom Paused)">Urgent (Classroom Paused - 4hr SLA)</option>
                    <option value="High (Upcoming Event)">High (Upcoming Science Fair/Event - 12hr SLA)</option>
                    <option value="Normal">Normal (Standard Query - 24hr SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Summary / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2x Ultrasonic sensors not emitting echo signals in Lab Batch B"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Description & Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what occurred, any error messages displayed on Arduino IDE or 3D printer screen, and the number of affected kits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-1">
                <FileText className="w-5 h-5 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">Attach Photo / Invoice / Error Log (Optional)</p>
                <p className="text-[11px] text-slate-400">Supported formats: JPG, PNG, PDF, TXT (Max 15MB)</p>
                <label className="inline-block mt-2 px-3 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                  Select File
                  <input type="file" className="hidden" />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Logging Support Ticket...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate Support Ticket & Notify Field Engineer</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Guarantees & SLAs Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800 shadow-lg">
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>The Balki Resolution SLA</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold uppercase text-[10px] tracking-wider block">
                    Urgent Classroom Tickets
                  </span>
                  <p className="font-bold text-white text-sm">4-Hour Engineering Callback</p>
                  <p className="text-slate-300 text-[11px]">
                    Immediate video debug call with a senior electronics specialist to unblock your ongoing class.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold uppercase text-[10px] tracking-wider block">
                    Defective Hardware Swaps
                  </span>
                  <p className="font-bold text-white text-sm">24–48 Hr Doorstep Dispatch</p>
                  <p className="text-slate-300 text-[11px]">
                    Pre-calibrated replacement parts shipped with zero return shipping charges for your school.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold uppercase text-[10px] tracking-wider block">
                    On-Site Lab Calibration
                  </span>
                  <p className="font-bold text-white text-sm">Certified Campus Technicians</p>
                  <p className="text-slate-300 text-[11px]">
                    Available across 28 states and union territories for ATL lab setup, 3D printer tuning, and educator workshops.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>📍 National Control Desk: Hitec City, Hyderabad</p>
                <p>📞 Emergency Desk: +91 9071199139</p>
              </div>
            </div>

            {/* Quick Testimonial on Support */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1 text-amber-700 font-bold">
                <span>★★★★★</span>
                <span className="text-slate-800 ml-1">"Replaced in 24 Hours!"</span>
              </div>
              <p className="text-slate-700 leading-relaxed italic text-[11px]">
                "When our 3D printer extruder clogged 2 days before the CBSE Regional Science Exhibition, Balki Technologies dispatched their technician with replacement nozzles the very next morning. Phenomenal service!"
              </p>
              <p className="text-[10px] font-bold text-slate-500">
                — Meenakshi Iyer, ATL In-Charge, DPS Gurgaon
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab Content: Live Ticket Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Live Service Ticket & SLA Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track real-time engineering assignment, dispatch courier AWB tracking, and resolution logs for your school.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Ticket # or School..."
                  value={searchTicketQuery}
                  onChange={(e) => setSearchTicketQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Ticket Selector Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrackedTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTrackedTicket?.id === t.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-slate-900">{t.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'Dispatched (Replacement)'
                        ? 'bg-blue-100 text-blue-800'
                        : t.status === 'Engineer Assigned'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs mt-1 truncate">{t.institutionName}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.subject}</p>
                </div>
              ))}
            </div>

            {/* Detailed Ticket Tracker View */}
            {selectedTrackedTicket ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-mono text-slate-900">
                        {selectedTrackedTicket.ticketNumber}
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        selectedTrackedTicket.status === 'Resolved'
                          ? 'bg-emerald-600 text-white'
                          : selectedTrackedTicket.status === 'Dispatched (Replacement)'
                          ? 'bg-blue-600 text-white'
                          : selectedTrackedTicket.status === 'Engineer Assigned'
                          ? 'bg-purple-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {selectedTrackedTicket.status}
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {selectedTrackedTicket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mt-1">
                      {selectedTrackedTicket.institutionName} • Contact: {selectedTrackedTicket.name} ({selectedTrackedTicket.role})
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-500">
                    <p>Logged: {new Date(selectedTrackedTicket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-amber-700 font-semibold">Target SLA: Within {selectedTrackedTicket.slaHours} Hours</p>
                  </div>
                </div>

                {/* Stepper Timeline */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Resolution Lifecycle Stepper
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      ✓ 1. Ticket Logged
                    </div>
                    <div className={`p-2.5 rounded-xl font-bold border ${
                      selectedTrackedTicket.status !== 'Open'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                    }`}>
                      2. Engineer Assigned
                    </div>
                    <div className={`p-2.5 rounded-xl font-bold border ${
                      selectedTrackedTicket.status === 'Dispatched (Replacement)' || selectedTrackedTicket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : selectedTrackedTicket.status === 'Engineer Assigned'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}>
                      3. Dispatched / On-Site
                    </div>
                    <div className={`p-2.5 rounded-xl font-bold border ${
                      selectedTrackedTicket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-200 text-slate-500 border-slate-300'
                    }`}>
                      4. Resolved & Verified
                    </div>
                  </div>
                </div>

                {/* Details Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Category</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{selectedTrackedTicket.category}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Engineer</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{selectedTrackedTicket.assignedEngineer || 'Field Routing'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Order SKU Reference</span>
                    <span className="font-mono font-bold text-slate-800 mt-0.5 block">{selectedTrackedTicket.orderIdOrSku || 'Classroom Kit'}</span>
                  </div>
                </div>

                {/* Description & Resolution Notes */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">Issue Subject & Description</h4>
                    <p className="text-slate-700 mt-1 leading-relaxed">{selectedTrackedTicket.description}</p>
                  </div>

                  {selectedTrackedTicket.resolutionNotes && (
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Engineer Resolution Notes & Action Taken</span>
                      </h4>
                      <p className="text-slate-700 mt-1 leading-relaxed bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                        {selectedTrackedTicket.resolutionNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select a ticket above to inspect its real-time lifecycle and engineer notes.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Tab Content: Self-Serve Diagnostic Wizard */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span>Immediate Classroom Self-Resolvance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Hardware & Circuit Interactive Troubleshooting Wizard
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Follow these verified step-by-step diagnostic workflows to resolve 85% of common classroom hardware and wiring hurdles immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIAGNOSTIC_GUIDES.map((diag) => {
              const isExpanded = expandedDiagId === diag.id;

              return (
                <div
                  key={diag.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {diag.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Guide #{diag.id}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {diag.title}
                    </h3>

                    <div className="p-2.5 bg-red-50/80 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Symptoms: </span>
                        <span>{diag.symptoms}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          Step-by-Step Resolution Procedure:
                        </span>
                        <ol className="space-y-1.5 text-xs text-slate-600">
                          {diag.solutionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>

                        <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                          <span className="font-semibold">Recommended Kit Tool: {diag.recommendedTool}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedDiagId(isExpanded ? null : diag.id)}
                    className="w-full py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border-t border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{isExpanded ? 'Collapse Guide' : 'View Full Resolution Steps'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Tab Content: Regional Depots & Warehouses */}
      {activeTab === 'hubs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Regional Support Depots & Rapid Fulfillment Centers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Balki Technologies maintains four regional hubs stocked with 50,000+ replacement parts and certified field engineers for immediate school dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Hyderabad Central */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Central Headquarters</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Hyderabad Central Tech Hub</h4>
                <p className="text-slate-500 mt-1">Hitec City Innovation Zone, Madhapur, Hyderabad - 500081</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p>📦 Inventory: 25,000+ Units</p>
                <p>👨‍🔧 Engineers: 18 On-Field</p>
                <p>⏱️ SLA: 12–24 Hours</p>
              </div>
            </div>

            {/* Delhi NCR */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">North Regional Depot</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Delhi NCR Service Center</h4>
                <p className="text-slate-500 mt-1">Okhla Industrial Area Phase III, New Delhi - 110020</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p>📦 Inventory: 15,000+ Units</p>
                <p>👨‍🔧 Engineers: 12 On-Field</p>
                <p>⏱️ SLA: 24 Hours</p>
              </div>
            </div>

            {/* Bengaluru */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">South Regional Depot</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Bengaluru Electronics Hub</h4>
                <p className="text-slate-500 mt-1">Electronic City Phase 1, Bengaluru, Karnataka - 560100</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p>📦 Inventory: 18,000+ Units</p>
                <p>👨‍🔧 Engineers: 15 On-Field</p>
                <p>⏱️ SLA: 24 Hours</p>
              </div>
            </div>

            {/* Mumbai */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">West Logistics Center</span>
                <h4 className="font-extrabold text-slate-900 text-sm">Mumbai Logistics Depot</h4>
                <p className="text-slate-500 mt-1">MIDC Andheri East, Mumbai, Maharashtra - 400093</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p>📦 Inventory: 12,000+ Units</p>
                <p>👨‍🔧 Engineers: 10 On-Field</p>
                <p>⏱️ SLA: 24–48 Hours</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Frequently Asked Questions on Support & Warranty */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
            School Support Guidelines
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Frequently Asked Questions on Problem Resolvance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Everything you need to know regarding component replacements, on-site setup, educator training, and warranty terms.
          </p>
        </div>

        <div className="space-y-3">
          {SUPPORT_FAQS.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  className="w-full p-4 sm:p-5 text-left bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
