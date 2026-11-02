import React, { useState } from 'react';
import { UserProgress, Order, RentalBooking, Course, NavTab } from '../types';
import { 
  Award, 
  Clock, 
  BookOpen, 
  ShoppingBag, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  Zap, 
  Radio, 
  Cpu, 
  FileText, 
  ExternalLink,
  School,
  X,
  Heart,
  Play,
  ArrowRight,
  Sparkles,
  Download,
  Truck
} from 'lucide-react';
import { InteractiveCoursePlayer } from './InteractiveCoursePlayer';
import { downloadCertificateDocument, downloadTaxInvoice } from '../utils/downloadHelpers';

interface StudentDashboardProps {
  userProgress: UserProgress;
  orders: Order[];
  rentals: RentalBooking[];
  courses: Course[];
  setActiveTab: (tab: NavTab) => void;
  onToggleLikeCourse?: (courseId: string) => void;
  onCompleteLesson?: (lessonId: string, quizScore: number, courseId: string, courseTitle: string) => void;
  onTrackOrder?: (order: Order) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  userProgress,
  orders,
  rentals,
  courses,
  setActiveTab,
  onToggleLikeCourse,
  onCompleteLesson,
  onTrackOrder
}) => {
  const [selectedCert, setSelectedCert] = useState<{
    courseTitle: string;
    issueDate: string;
    certificateId: string;
  } | null>(null);

  const [activePlayCourse, setActivePlayCourse] = useState<Course | null>(null);

  const maxGoalHours = 50;
  const hoursPct = Math.min(100, Math.round((userProgress.tinkeringHours / maxGoalHours) * 100));

  const likedIds = userProgress.likedCourseIds || [];
  const likedCourses = courses.filter(c => likedIds.includes(c.id) || c.isLiked);

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Student Innovation Laboratory"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0 border border-amber-400/30">
            {userProgress.studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white">
                {userProgress.studentName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {userProgress.grade}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <School className="w-3.5 h-3.5 text-amber-400" />
              <span>{userProgress.schoolName}</span>
            </p>
          </div>
        </div>

        {/* Tinkering Hours Goal Tracker */}
        <div className="relative z-10 w-full md:w-80 bg-slate-900/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              ATL Tinkering Hours Log
            </span>
            <span className="font-extrabold text-amber-400">
              {userProgress.tinkeringHours} / {maxGoalHours} hrs
            </span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              style={{ width: `${hoursPct}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {maxGoalHours - userProgress.tinkeringHours} hours to National ATL Tinkering Gold Badge
          </p>
        </div>
      </section>

      {/* Badges Earned */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Verified STEM Badges Earned
          </h3>
          <span className="text-xs text-slate-400">{userProgress.badges.length} Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {userProgress.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                {badge.icon === 'Zap' && <Zap className="w-5 h-5" />}
                {badge.icon === 'Radio' && <Radio className="w-5 h-5" />}
                {badge.icon === 'Award' && <Award className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{badge.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{badge.description}</p>
                <span className="text-[10px] text-amber-700 font-medium block mt-1.5">
                  Unlocked: {badge.unlockedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Certificates */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" />
          Official STEM Certificates ({userProgress.earnedCertificates.length})
        </h3>

        {userProgress.earnedCertificates.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            Complete all modules & quizzes in any course to unlock your verified certificate.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProgress.earnedCertificates.map((cert) => (
              <div
                key={cert.certificateId}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="font-bold text-xs text-slate-900">{cert.courseTitle}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    ID: {cert.certificateId} • Issued: {cert.issueDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                >
                  View & Print
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders and Rentals History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              School Orders & Purchases
            </h3>
            <button
              onClick={() => setActiveTab('store')}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold"
            >
              + New Order
            </button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No orders placed yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Your registered purchase orders and tracking records will appear here.</p>
                <button
                  onClick={() => setActiveTab('store')}
                  className="mt-3 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Browse Hardware Catalog
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{order.id}</span>
                      <p className="text-[10px] text-slate-500 font-mono">Tracking: {order.trackingNumber}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    {order.items.map((it, i) => (
                      <p key={i}>• {it.quantity}x {it.product.name}</p>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold">
                    <span className="text-slate-500">Total Invoice:</span>
                    <span className="text-slate-900 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {onTrackOrder && (
                      <button
                        id={`btn-track-order-${order.id}`}
                        onClick={() => onTrackOrder(order)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Open Live Consignment Tracker"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Track Consignment</span>
                      </button>
                    )}
                    <button
                      id={`btn-download-order-invoice-${order.id}`}
                      onClick={() => downloadTaxInvoice(order)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download GST Compliant Tax Invoice"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Tax Invoice (PDF)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Active Hardware Rentals
            </h3>
            <button
              onClick={() => setActiveTab('rentals')}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold"
            >
              + Rent Gear
            </button>
          </div>

          <div className="space-y-3">
            {rentals.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No active hardware rentals</p>
                <p className="text-[11px] text-slate-400 mt-1">Rent 3D printers, oscilloscopes, or CNC PCB millers for your lab.</p>
                <button
                  onClick={() => setActiveTab('rentals')}
                  className="mt-3 px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  Explore Rental Catalog
                </button>
              </div>
            ) : (
              rentals.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{r.equipmentName}</span>
                      <p className="text-[10px] text-slate-500">Booking ID: {r.id}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {r.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Period: {r.startDate} to {r.endDate}</span>
                    <span className="font-bold">Total: ₹{r.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="text-[10px] text-emerald-700 font-medium">
                    ✓ Refundable Security Deposit: ₹{r.depositFee.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-500 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative overflow-hidden text-center space-y-4 border-2 border-slate-200 p-6 rounded-2xl bg-amber-50/20">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
                alt="Certificate Guilloche Pattern"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-5 mix-blend-multiply pointer-events-none"
              />
              <div className="relative z-10 flex items-center justify-center gap-2">
                <Cpu className="w-8 h-8 text-amber-600" />
                <h3 className="text-xl font-black tracking-tight text-slate-900">
                  BALKI TECHNOLOGIES PVT. LTD.
                </h3>
              </div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                National STEM & Atal Tinkering Innovation Certificate
              </p>

              <div className="py-4 space-y-2">
                <p className="text-xs text-slate-500">This is to certify that</p>
                <h2 className="text-2xl font-extrabold text-slate-900 border-b-2 border-amber-400 inline-block px-8 pb-1">
                  {userProgress.studentName}
                </h2>
                <p className="text-xs text-slate-500 pt-1">
                  of <strong>{userProgress.schoolName}</strong> has completed
                </p>
                <h4 className="text-base font-bold text-amber-800">
                  {selectedCert.courseTitle}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                <div className="text-left">
                  <p className="font-mono text-[10px] text-slate-400">Certificate ID: {selectedCert.certificateId}</p>
                  <p className="text-slate-600 text-[11px]">Issued: {selectedCert.issueDate}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 px-4 font-serif italic text-sm text-slate-800">
                    Balki Technologies
                  </div>
                  <p className="text-[10px] text-slate-500">Authorized Signatory</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
              <div className="flex items-center gap-2">
                <button
                  id="btn-print-certificate"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print</span>
                </button>
                <button
                  id="btn-download-official-cert"
                  onClick={() => downloadCertificateDocument({
                    studentName: userProgress.studentName,
                    courseTitle: selectedCert.courseTitle,
                    certificateId: selectedCert.certificateId,
                    issueDate: selectedCert.issueDate
                  })}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Verified Certificate (PDF)</span>
                </button>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
