import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Package, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  ArrowRight,
  Sparkles,
  KeyRound,
  RotateCw,
  Ban,
  UserCheck
} from 'lucide-react';
import { Order, OrderStatus, TrackingCheckpoint } from '../types';
import { downloadTaxInvoice } from '../utils/downloadHelpers';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderIdOrTracking?: string;
  recentOrders?: Order[];
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderIdOrTracking = '',
  recentOrders = [],
  onOrderUpdated
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderIdOrTracking);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Auto-search when opened or when initialOrderIdOrTracking changes
  useEffect(() => {
    if (isOpen) {
      const targetQuery = initialOrderIdOrTracking.trim() || (recentOrders.length > 0 ? recentOrders[0].id : 'ORD-2026-9081');
      setSearchInput(targetQuery);
      fetchOrderTracking(targetQuery);
    }
  }, [isOpen, initialOrderIdOrTracking]);

  if (!isOpen) return null;

  const fetchOrderTracking = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    setActionSuccessMsg('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.found && data.order) {
        setCurrentOrder(data.order);
      } else {
        // Fallback to checking local recentOrders
        const local = recentOrders.find(o => 
          o.id.toLowerCase() === query.trim().toLowerCase() ||
          o.trackingNumber.toLowerCase() === query.trim().toLowerCase()
        );
        if (local) {
          setCurrentOrder(local);
        } else {
          setErrorMsg(data.message || `No active consignment found matching "${query}". Try one of the quick suggestions below.`);
          setCurrentOrder(null);
        }
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to connect to tracking server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchOrderTracking(searchInput.trim());
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAdvanceMilestone = async () => {
    if (!currentOrder) return;
    setIsAdvancing(true);
    setActionSuccessMsg('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(currentOrder.id)}/track/advance`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setCurrentOrder(data.order);
        if (onOrderUpdated) onOrderUpdated(data.order);
        setActionSuccessMsg(data.message || 'Tracking milestone advanced successfully!');
      } else {
        setErrorMsg(data.error || 'Could not advance milestone.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to update tracking status.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    if (!confirm('Are you sure you want to cancel this order? This will release reserved inventory back to lab stock.')) {
      return;
    }

    setIsCancelling(true);
    setActionSuccessMsg('');

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(currentOrder.id)}/cancel`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setCurrentOrder(data.order);
        if (onOrderUpdated) onOrderUpdated(data.order);
        setActionSuccessMsg('Order cancelled and full refund initiated. Inventory restocked.');
      } else {
        alert(data.error || 'Failed to cancel order.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while processing cancellation.');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status?: OrderStatus, paymentStatus?: string) => {
    if (status === 'cancelled' || paymentStatus === 'Refunded') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
          <Ban className="w-3.5 h-3.5" />
          Cancelled & Refunded
        </span>
      );
    }
    if (status === 'delivered') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Delivered & Installed
        </span>
      );
    }
    if (status === 'out_for_delivery') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 animate-pulse">
          <Truck className="w-3.5 h-3.5" />
          Out for Lab Delivery Today
        </span>
      );
    }
    if (status === 'in_transit') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" />
          In Transit (Line-haul)
        </span>
      );
    }
    if (status === 'dispatched') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          Dispatched from Hub
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        BOM Assembly & Quality Check
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                Balki Real-Time Consignment Tracker
              </h3>
              <p className="text-xs text-slate-300">
                Live B2B & School Logistics • Delhivery Priority STEM Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Picks */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 shrink-0 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (ORD-2026-...) or AWB Tracking Number (BALKI-EXP-...)"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 placeholder:font-sans placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track</span>
            </button>
          </form>

          {/* Quick Selection Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Sample Consignments:</span>
            {['ORD-2026-9081', 'BALKI-EXP-940212IN'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchInput(id);
                  fetchOrderTracking(id);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  currentOrder?.id === id || currentOrder?.trackingNumber === id
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {id}
              </button>
            ))}
            {recentOrders.length > 0 && !recentOrders.some(r => r.id === 'ORD-2026-9081') && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput(recentOrders[0].id);
                  fetchOrderTracking(recentOrders[0].id);
                }}
                className="px-2.5 py-1 rounded-lg border bg-white hover:bg-slate-200 text-slate-700 border-slate-300 font-mono"
              >
                Latest Order ({recentOrders[0].id})
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Tracking Look-up Notice</p>
                <p className="mt-0.5 text-rose-700">{errorMsg}</p>
              </div>
            </div>
          )}

          {actionSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {currentOrder && (
            <div className="space-y-6">
              {/* Order Status Hero Bar */}
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span className="font-mono text-sm font-bold text-amber-400">
                      {currentOrder.id}
                    </span>
                    {getStatusBadge(currentOrder.orderStatus, currentOrder.paymentStatus)}
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {currentOrder.schoolName || currentOrder.customerName}
                  </h4>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
                    </span>
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl text-right sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Estimated School Delivery
                  </span>
                  <span className="text-sm font-black text-amber-300">
                    {currentOrder.trackingDetails?.expectedDeliveryDate
                      ? new Date(currentOrder.trackingDetails.expectedDeliveryDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : '3-4 Business Days'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    100% Insured Transit
                  </span>
                </div>
              </div>

              {/* Waybill, Security OTP, and Courier Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* AWB Card */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Logistics Partner & AWB
                  </span>
                  <p className="font-semibold text-slate-900 truncate">
                    {currentOrder.trackingDetails?.courierPartner || 'Delhivery B2B Logistics'}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs font-bold text-amber-700 truncate">
                      {currentOrder.trackingDetails?.awbNumber || currentOrder.trackingNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(currentOrder.trackingDetails?.awbNumber || currentOrder.trackingNumber, 'awb')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Waybill Number"
                    >
                      {copiedField === 'awb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Delivery Security OTP */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-600" />
                    School Handover OTP
                  </span>
                  <p className="text-[11px] text-slate-600">Provide to driver at school gate:</p>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-mono text-base font-black tracking-widest text-slate-900 bg-white px-2.5 py-0.5 rounded border border-amber-300">
                      {currentOrder.deliveryOtp || currentOrder.trackingDetails?.deliverySecurityOtp || '4829'}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">Secure PIN</span>
                  </div>
                </div>

                {/* Assigned Field Engineer */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-slate-500" />
                    Field Robotics Engineer
                  </span>
                  <p className="font-semibold text-slate-900">
                    {currentOrder.trackingDetails?.assignedFieldEngineer?.name || 'Ramesh Verma'}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 truncate">
                      {currentOrder.trackingDetails?.assignedFieldEngineer?.badge || 'ATL Certified Specialist'}
                    </span>
                    <a
                      href={`tel:${currentOrder.trackingDetails?.assignedFieldEngineer?.phone || '+919071199139'}`}
                      className="p-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md transition-colors"
                      title="Call Engineer"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Interactive Milestones Timeline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Consignment Journey & Milestones
                  </h4>
                  <span className="text-xs text-slate-500">
                    Origin: Hyderabad Hub → Destination: {currentOrder.shippingAddress.city}
                  </span>
                </div>

                {/* Vertical Checkpoints List */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {currentOrder.trackingDetails?.checkpoints && currentOrder.trackingDetails.checkpoints.length > 0 ? (
                    currentOrder.trackingDetails.checkpoints.map((chk, idx) => (
                      <div key={chk.id || idx} className="relative flex items-start gap-3.5">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white ring-4 ring-white ${
                          chk.completed 
                            ? 'bg-emerald-600' 
                            : chk.current 
                              ? 'bg-amber-500 animate-pulse' 
                              : 'bg-slate-300'
                        }`}>
                          {chk.completed ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <h5 className={`text-xs font-bold ${
                              chk.current ? 'text-amber-700' : chk.completed ? 'text-slate-900' : 'text-slate-400'
                            }`}>
                              {chk.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {chk.timestamp ? new Date(chk.timestamp).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {chk.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{chk.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Milestone records being synchronized with national freight network.</div>
                  )}
                </div>
              </div>

              {/* Items in Consignment */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <span>Packages / STEM Materials Included ({currentOrder.items.length})</span>
                  <span>Invoice Total: ₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-9 h-9 object-cover rounded-lg border border-slate-200"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{it.product.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {it.product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">Qty: {it.quantity}</span>
                        <p className="text-[10px] text-slate-500">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Simulate next milestone button */}
                  {currentOrder.orderStatus !== 'delivered' && currentOrder.orderStatus !== 'cancelled' && (
                    <button
                      type="button"
                      disabled={isAdvancing}
                      onClick={handleAdvanceMilestone}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      title="Advance to next logistic status for testing/demo"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isAdvancing ? 'animate-spin' : ''}`} />
                      <span>{isAdvancing ? 'Advancing Milestone...' : 'Simulate Next Milestone'}</span>
                    </button>
                  )}

                  {/* Download Invoice Button */}
                  <button
                    type="button"
                    onClick={() => downloadTaxInvoice(currentOrder)}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>
                </div>

                {/* Cancel button if applicable */}
                {currentOrder.orderStatus !== 'delivered' && currentOrder.orderStatus !== 'cancelled' && (
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={handleCancelOrder}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Cancel Consignment</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
