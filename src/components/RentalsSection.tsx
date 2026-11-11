import React, { useState } from 'react';
import { RentalEquipment, RentalBooking } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Sparkles, 
  Wrench, 
  Package, 
  X,
  AlertCircle,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadRentalAgreement } from '../utils/downloadHelpers';

interface RentalsSectionProps {
  rentals: RentalEquipment[];
  onBookingSuccess: (booking: RentalBooking) => void;
}

export const RentalsSection: React.FC<RentalsSectionProps> = ({
  rentals,
  onBookingSuccess
}) => {
  const [selectedRental, setSelectedRental] = useState<RentalEquipment | null>(null);
  const [rentalDays, setRentalDays] = useState(7);
  
  // Booking Form State
  const [institutionName, setInstitutionName] = useState('St. Jude Higher Secondary Innovation Club');
  const [userName, setUserName] = useState('Meera Nambiar (Lab Coordinator)');
  const [userEmail, setUserEmail] = useState('meera.atl@stjude.edu.in');
  const [userPhone, setUserPhone] = useState('+91 94470 54321');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<RentalBooking | null>(null);

  const calculateFees = (equipment: RentalEquipment, days: number) => {
    // If multiple weeks, apply discounted weekly rate
    const weeks = Math.floor(days / 7);
    const extraDays = days % 7;
    const rentalFee = (weeks * equipment.weeklyRate) + (extraDays * equipment.dailyRate);
    const depositFee = equipment.securityDeposit;
    return { rentalFee, depositFee, totalAmount: rentalFee + depositFee };
  };

  const handleOpenBookingModal = (equipment: RentalEquipment) => {
    setSelectedRental(equipment);
    setRentalDays(equipment.minRentalDays || 3);
    setConfirmedBooking(null);
  };

  const handleConfirmRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRental) return;

    setIsSubmitting(true);
    const { rentalFee, depositFee } = calculateFees(selectedRental, rentalDays);

    const endDate = new Date(new Date(startDate).getTime() + rentalDays * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    try {
      const res = await fetch('/api/rentals/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedRental.id,
          userName,
          userEmail,
          userPhone,
          institutionName,
          startDate,
          endDate,
          totalDays: rentalDays,
          rentalFee,
          depositFee
        })
      });

      if (!res.ok) throw new Error('Failed to book rental equipment');
      const booking: RentalBooking = await res.json();
      
      setConfirmedBooking(booking);
      onBookingSuccess(booking);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error(err);
      alert('Unable to process rental booking. Please ensure units are available.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden shadow-xl">
        {/* Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Prototyping Laboratory"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/40 pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>School Hackathons • Science Fairs • ATL Exhibitions</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            High-Value STEM Equipment Rentals
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Equip your school or tinkering lab with industrial-grade 3D printers, precision desktop CNC rigs, digital oscilloscopes, and humanoid robots on flexible weekly or monthly rental terms. 100% calibrated hardware with full insurance and technical setup assistance.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              100% Refundable Security Deposit
            </span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-400" />
              Pre-Calibrated with NABL Certifications
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              Doorstep Shockproof Flight Case Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Equipment Rental Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rentals.map((item) => {
          const sampleFee = calculateFees(item, 7);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-amber-500/50 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {item.condition}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-lg">
                    {item.availableUnits} of {item.totalUnits} units available
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Daily Rate</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹{item.dailyRate}</span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Weekly Rate</span>
                      <span className="font-extrabold text-amber-700 text-sm">₹{item.weeklyRate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Refundable Deposit</span>
                      <span className="font-semibold text-slate-700 text-sm">₹{item.securityDeposit}</span>
                    </div>
                  </div>

                  {/* Specs Pill List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Hardware Specifications:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {item.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">
                  <span>Min. Rental: {item.minRentalDays} Days</span>
                </div>

                <button
                  onClick={() => handleOpenBookingModal(item)}
                  disabled={item.availableUnits <= 0}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Rent This Equipment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rental Booking Modal */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="relative px-6 py-4 bg-slate-900 text-white flex items-center justify-between overflow-hidden">
              <img
                src={selectedRental.image}
                alt={selectedRental.name}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-bold text-sm">Book Lab Equipment Rental</h3>
                <p className="text-[11px] text-amber-300 font-medium">{selectedRental.name}</p>
              </div>
              <button
                onClick={() => setSelectedRental(null)}
                className="relative z-10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {confirmedBooking ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Equipment Rental Confirmed!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Rental Booking ID: <strong className="font-mono text-amber-700">{confirmedBooking.id}</strong>. Our logistics team will inspect, calibrate, and dispatch the flight case to <strong className="text-slate-800">{confirmedBooking.institutionName}</strong>.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rental Duration:</span>
                      <span className="font-bold">{confirmedBooking.totalDays} Days ({confirmedBooking.startDate} to {confirmedBooking.endDate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rental Fee:</span>
                      <span className="font-bold">₹{confirmedBooking.rentalFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Refundable Deposit:</span>
                      <span className="font-bold text-emerald-700">₹{confirmedBooking.depositFee.toLocaleString('en-IN')} (Refunded post-return)</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                      <span>Total Authorized:</span>
                      <span className="text-amber-700">₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      id="btn-download-rental-agreement"
                      onClick={() => downloadRentalAgreement(confirmedBooking)}
                      className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Rental Agreement (PDF/HTML)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRental(null)}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmRental} className="space-y-4">
                  {/* Duration Slider */}
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-amber-900">
                        Rental Duration: {rentalDays} Days
                      </label>
                      <span className="text-xs font-bold text-amber-800">
                        ({Math.floor(rentalDays / 7)} Weeks {rentalDays % 7 > 0 ? `+ ${rentalDays % 7} Days` : ''})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={selectedRental.minRentalDays || 3}
                      max={60}
                      step={1}
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-amber-700 font-medium">
                      <span>Min: {selectedRental.minRentalDays} Days</span>
                      <span>15 Days</span>
                      <span>30 Days</span>
                      <span>60 Days</span>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">School / College / Lab Name *</label>
                      <input
                        type="text"
                        required
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Coordinator Name *</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Rental Start Date *</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Fee Summary */}
                  {(() => {
                    const { rentalFee, depositFee, totalAmount } = calculateFees(selectedRental, rentalDays);
                    return (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Rental Fee ({rentalDays} Days):</span>
                          <span className="font-bold text-slate-900">₹{rentalFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Refundable Security Deposit:</span>
                          <span className="font-bold text-emerald-700">₹{depositFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                          <span>Total Authorization:</span>
                          <span className="text-amber-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 pt-1">
                          * Security deposit is 100% refunded to the original account within 48 hours of return inspection.
                        </p>
                      </div>
                    );
                  })()}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming Booking...' : 'Authorize Rental & Reserve Hardware'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
