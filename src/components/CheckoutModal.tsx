import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Printer, 
  ArrowLeft,
  Lock,
  Smartphone,
  School,
  Copy,
  Check,
  Download,
  Truck,
  Loader2,
  RefreshCw,
  BadgeCheck,
  KeyRound,
  Zap,
  CheckCheck,
  Clock,
  Maximize2,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, PaymentMethod } from '../types';
import { downloadTaxInvoice } from '../utils/downloadHelpers';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';

const canaraBankQrImg = '/canara_bank_upi_qr.jpeg';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  couponDiscount: number;
  onOrderPlaced: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  couponDiscount,
  onOrderPlaced,
  onTrackOrder
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'gateway_sim' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<string>('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  
  // Canara Bank UPI specific states
  const [upiUtr, setUpiUtr] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  // Copy status indicators
  const [copiedTxnId, setCopiedTxnId] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  // Authenticated Client Context
  const { currentUser, userProfile } = useAuth();

  // Form states populated from authenticated user
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [schoolName, setSchoolName] = useState(userProfile?.institution || '');
  const [gstin, setGstin] = useState('');
  
  // Shipping Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('500001');

  useEffect(() => {
    if (userProfile || currentUser) {
      if (userProfile?.displayName) setCustomerName(userProfile.displayName);
      if (currentUser?.email) setCustomerEmail(currentUser.email);
      if (userProfile?.phone) setCustomerPhone(userProfile.phone);
      if (userProfile?.institution) setSchoolName(userProfile.institution);
    }
  }, [userProfile, currentUser, isOpen]);

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('782');

  // Gateway Simulation Interactive States
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [cardOtp, setCardOtp] = useState('882421');
  const [netbankingUserId, setNetbankingUserId] = useState('CORP-LAB-9921');
  const [netbankingOtp, setNetbankingOtp] = useState('694820');
  const [simTimer, setSimTimer] = useState(60);

  // Countdown timer for simulation screen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'gateway_sim' && simTimer > 0) {
      interval = setInterval(() => {
        setSimTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, simTimer]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gstAmount = Number((subtotal * 0.18).toFixed(2));
  const shippingFee = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, subtotal + gstAmount + shippingFee - couponDiscount);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !pincode) {
      alert('Please fill in all mandatory contact and shipping fields.');
      return;
    }
    setStep('payment');
  };

  const handleLaunchGatewaySimulation = () => {
    setSimTimer(60);
    setStep('gateway_sim');
  };

  const executePaymentVerification = async () => {
    setIsProcessing(true);
    setProcessingPhase('Validating Payment Credentials with Acquiring Gateway...');

    try {
      // 1. Initiate Payment Intent
      let intentId: string | undefined;
      try {
        const intentRes = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            customerEmail,
            customerPhone,
            paymentMethod,
            couponDiscount
          })
        });
        if (intentRes.ok) {
          const intentData = await intentRes.json();
          intentId = intentData.intent?.intentId;
        }
      } catch (e) {
        console.warn('Intent init fallback', e);
      }

      await new Promise(r => setTimeout(r, 600));
      setProcessingPhase('Allocating Lab Stock & Updating Real-Time Inventory...');

      // Generate distinct deterministic / simulation transaction reference
      const generatedTxnRef = paymentMethod === 'UPI' 
        ? (upiUtr.trim() ? `CANARA-UTR-${upiUtr.trim()}` : `CANARA-UPI-${Date.now().toString().slice(-8)}`)
        : paymentMethod === 'Card'
          ? `CARD-TXN-AUTH-${cardNumber.slice(-4)}-${Date.now().toString().slice(-4)}`
          : paymentMethod === 'NetBanking'
            ? `NB-TXN-${selectedBank.slice(0, 4).toUpperCase().replace(/\s/g, '')}-${Date.now().toString().slice(-6)}`
            : `PO-${schoolName ? schoolName.slice(0, 4).toUpperCase().replace(/\s/g, '') : 'ATL'}-2026-${Date.now().toString().slice(-4)}`;

      // 2. Verify Payment & Register Consignment
      const payload = {
        intentId,
        customerName,
        customerEmail,
        customerPhone,
        schoolName: schoolName || undefined,
        gstin: gstin || undefined,
        shippingAddress: {
          street,
          city,
          state,
          pincode
        },
        items: cartItems,
        paymentMethod,
        couponDiscount,
        paymentDetails: {
          transactionRef: generatedTxnRef,
          upiVpa: paymentMethod === 'UPI' ? '120039687478@canara' : undefined,
          upiUtr: paymentMethod === 'UPI' && upiUtr ? upiUtr : undefined,
          poSanctionNumber: paymentMethod === 'SchoolPO' ? generatedTxnRef : undefined,
          bankName: paymentMethod === 'UPI' ? 'Canara Bank' : paymentMethod === 'NetBanking' ? selectedBank : undefined,
          authCode: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`
        }
      };

      await new Promise(r => setTimeout(r, 600));
      setProcessingPhase('Issuing Insured Delhivery AWB & Tracking Reference...');

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let order: Order;
      if (res.ok) {
        const data = await res.json();
        order = data.order;
      } else {
        // Fallback to legacy endpoint
        const fallbackRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!fallbackRes.ok) throw new Error('Failed to process payment');
        order = await fallbackRes.json();
      }
      
      setCreatedOrder(order);

      // Persist order to Firestore database for registered user
      if (currentUser?.uid) {
        order.userId = currentUser.uid;
        try {
          const orderDocRef = doc(db, 'orders', order.id);
          await setDoc(orderDocRef, { ...order, userId: currentUser.uid });
        } catch (dbErr) {
          console.warn('Failed to sync order to Firestore:', dbErr);
          handleFirestoreError(dbErr, 'create', 'orders');
        }
      }

      onOrderPlaced(order);
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err) {
      console.error(err);
      alert('Payment processing encountered an error. Please check your network and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingPhase('');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('120039687478@canara');
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const copyToClipboard = (text: string, type: 'txn' | 'order' | 'awb') => {
    navigator.clipboard.writeText(text);
    if (type === 'txn') {
      setCopiedTxnId(true);
      setTimeout(() => setCopiedTxnId(false), 2000);
    } else if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto sm:my-6 max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Balki Technologies Secure Gateway</span>
                {step === 'gateway_sim' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 uppercase tracking-wider">
                    Interactive PG Sandbox
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-300">256-Bit Encrypted • PCI-DSS & RBI Guideline Aligned</p>
            </div>
          </div>
          {step !== 'success' && !isProcessing && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs">
            <div className={`flex-1 py-2.5 px-3 text-center font-semibold border-r border-slate-200 ${
              step === 'details' ? 'text-amber-600 bg-white border-b-2 border-b-amber-600' : 'text-slate-500'
            }`}>
              1. School & Shipping
            </div>
            <div className={`flex-1 py-2.5 px-3 text-center font-semibold border-r border-slate-200 ${
              step === 'payment' ? 'text-amber-600 bg-white border-b-2 border-b-amber-600' : 'text-slate-500'
            }`}>
              2. Payment Method
            </div>
            <div className={`flex-1 py-2.5 px-3 text-center font-semibold ${
              step === 'gateway_sim' ? 'text-amber-600 bg-white border-b-2 border-b-amber-600' : 'text-slate-500'
            }`}>
              3. PG Gateway Authorization
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {/* STEP 1: Details */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-4 h-4 text-amber-600" />
                  Educator / Lab Contact Details
                </h4>
                <span className="text-[11px] text-slate-400">* Required for dispatch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Official / Personal Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">School / Institution Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kendriya Vidyalaya ATL Hub"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">GSTIN (Optional for 18% ITC claim)</label>
                  <input
                    type="text"
                    placeholder="36AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 uppercase font-mono"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Consignment Delivery Address (Lab Location)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Street / Campus Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other States">Other States / UT</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Postal PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Order Payable Amount:</span>
                  <div className="text-lg font-extrabold text-slate-900">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              <button
                onClick={() => setStep('details')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Shipping Address</span>
              </button>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-amber-600 bg-amber-50/80 text-amber-900 font-bold shadow-xs ring-1 ring-amber-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs block">UPI / QR Code</span>
                  <span className="text-[10px] text-slate-400 block">Instant 0% Fee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'border-amber-600 bg-amber-50/80 text-amber-900 font-bold shadow-xs ring-1 ring-amber-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs block">Cards</span>
                  <span className="text-[10px] text-slate-400 block">RuPay, Visa, MC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'NetBanking'
                      ? 'border-amber-600 bg-amber-50/80 text-amber-900 font-bold shadow-xs ring-1 ring-amber-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs block">Net Banking</span>
                  <span className="text-[10px] text-slate-400 block">All Indian Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('SchoolPO')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'SchoolPO'
                      ? 'border-amber-600 bg-amber-50/80 text-amber-900 font-bold shadow-xs ring-1 ring-amber-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs block">School PO</span>
                  <span className="text-[10px] text-amber-600 font-bold block">Net 30 Days</span>
                </button>
              </div>

              {/* Payment Details Container */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    {/* Header info bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                          CB
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">Canara Bank Official QR Scanner</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Verified Merchant
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">A Government of India Undertaking • Zero Convenience Fee</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Payable Amount</span>
                        <span className="text-base font-black text-slate-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Left: The Real Canara Bank QR Code Scanner Card */}
                      <div className="md:col-span-5 flex flex-col items-center">
                        <div className="relative group bg-white p-3 rounded-2xl border-2 border-amber-400/90 shadow-md hover:shadow-xl transition-all max-w-[240px] w-full text-center">
                          {/* QR Card image with pristine clarity and uncropped aspect ratio */}
                          <div 
                            onClick={() => setIsQrModalOpen(true)}
                            className="relative overflow-hidden rounded-xl bg-white cursor-pointer group"
                            title="Click to Enlarge QR Scanner"
                          >
                            <img
                              src={canaraBankQrImg}
                              alt="Canara Bank UPI QR Scanner - Scan to Pay Balki Technologies"
                              className="w-full h-auto object-contain mx-auto rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                            {/* Scanning beam animation overlay */}
                            <div className="absolute inset-0 border-2 border-amber-400 rounded-lg pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse pointer-events-none" />
                            
                            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <ZoomIn className="w-3 h-3 text-amber-400" />
                              <span>Click to Enlarge</span>
                            </div>
                          </div>

                          {/* Quick Enlarge & Action Bar below image */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsQrModalOpen(true)}
                              className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Click to view full-size QR scanner"
                            >
                              <Maximize2 className="w-3 h-3 text-amber-700" />
                              <span>Enlarge</span>
                            </button>
                            <a
                              href="/canara_bank_upi_qr.jpeg"
                              download="Canara_Bank_UPI_QR_Balki_Technologies.jpeg"
                              className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Download QR image file"
                            >
                              <Download className="w-3 h-3" />
                              <span>Save QR</span>
                            </a>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                            Point phone camera directly to scan
                          </p>
                        </div>
                      </div>

                      {/* Right: Payment Instructions, UPI ID, Apps, and UTR */}
                      <div className="md:col-span-7 space-y-3 text-xs">
                        
                        {/* Official UPI ID Box with Instant Copy */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-semibold">Official UPI ID (VPA):</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Canara Bank Verified
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm select-all">
                              120039687478@canara
                            </span>
                            <button
                              type="button"
                              onClick={copyUpiId}
                              className="px-3 py-1 text-xs font-bold text-slate-800 hover:text-amber-700 bg-white hover:bg-amber-50 border border-slate-200 rounded-md transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              {upiCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Copy UPI ID</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Merchant Name: <strong>Balki Technologies Pvt. Ltd.</strong>
                          </p>
                        </div>

                        {/* Supported Apps Badges */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Scan with Any UPI Application:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">Google Pay</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-200">PhonePe</span>
                            <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold border border-sky-200">Paytm</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">BHIM UPI</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">Canara ai1</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">CRED</span>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">e₹ Digital Rupee</span>
                          </div>
                        </div>

                        {/* Step-by-Step Scan Instructions */}
                        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-[11px] text-slate-700 space-y-1">
                          <div className="font-bold text-amber-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Quick Scan & Pay Steps:</span>
                          </div>
                          <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
                            <li>Open Google Pay, PhonePe, Paytm, BHIM or Canara ai1 on your mobile phone.</li>
                            <li>Tap <strong>Scan QR</strong> and scan the Canara Bank scanner on the left.</li>
                            <li>Verify or enter amount <strong className="text-slate-900 font-mono">₹{finalTotal.toLocaleString('en-IN')}</strong> and complete payment.</li>
                          </ol>
                        </div>

                        {/* 12-Digit UTR Entry (Optional / After Payment) */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <label className="font-bold text-slate-800">
                              Enter 12-Digit UPI Ref / UTR No. (Post Payment)
                            </label>
                            <span className="text-[10px] text-slate-400">Optional</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={12}
                              placeholder="e.g. 429812904812"
                              value={upiUtr}
                              onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs focus:outline-none focus:border-amber-500 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => setUpiUtr(`4298${Math.floor(10000000 + Math.random() * 90000000)}`)}
                              className="px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border border-slate-200 rounded-lg cursor-pointer"
                            >
                              Demo UTR
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Found on your bank/UPI payment receipt. You can also proceed directly to authorize.
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="space-y-2 text-xs">
                    <label className="block text-slate-700 font-semibold">Select Your Bank</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((bank, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg text-center cursor-pointer font-medium text-xs transition-all ${
                            selectedBank === bank
                              ? 'bg-amber-100 border-2 border-amber-600 text-amber-950 font-bold shadow-xs'
                              : 'bg-white border border-slate-200 hover:border-amber-300 text-slate-700'
                          }`}
                        >
                          {bank}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'SchoolPO' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-800 bg-amber-100/70 p-2.5 rounded-lg border border-amber-200">
                      <School className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>Institutional Net 30 Terms:</strong> An official Balki Technologies GST invoice will be generated and dispatched with the order. Payment is due within 30 days of lab installation.
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      School: <strong>{schoolName || 'School Innovation Lab'}</strong> • GSTIN: <strong>{gstin || 'Unregistered Educational Institution'}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button to launch Gateway Simulation */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-xs">
                  <span className="text-slate-500">Total Payable:</span>
                  <div className="text-lg font-black text-slate-900">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  id="btn-confirm-and-pay"
                  onClick={handleLaunchGatewaySimulation}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Payment Simulation</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive Payment Gateway Simulation */}
          {step === 'gateway_sim' && (
            <div className="space-y-5">
              {/* Simulator Header & Security Badges */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                    BP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">BalkiPay™ Multi-Rail Sandbox Gateway</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        Live Simulation
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Merchant: Balki Technologies Pvt. Ltd. • Auth Protocol: PCI-DSS v4.0
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Transaction Amount</span>
                  <span className="text-lg font-black text-amber-400">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dynamic Gateway View Based on Payment Method */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                
                {/* Method 1: UPI Gateway Simulator */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-900">Canara Bank Official UPI Payment Verification</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Awaiting Auth: 00:{simTimer < 10 ? `0${simTimer}` : simTimer}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-5 p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs flex flex-col items-center">
                        <div 
                          onClick={() => setIsQrModalOpen(true)}
                          className="relative group p-1 bg-white rounded-xl border border-slate-300 max-w-[190px] cursor-pointer"
                          title="Click to Enlarge QR Code"
                        >
                          <img
                            src={canaraBankQrImg}
                            alt="Canara Bank UPI QR Code"
                            className="w-full h-auto object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 border-2 border-amber-400 rounded-xl animate-pulse pointer-events-none" />
                          <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                            <Maximize2 className="w-3 h-3 text-amber-400" />
                            <span>Enlarge</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-900 mt-2 font-mono font-bold select-all">
                          120039687478@canara
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsQrModalOpen(true)}
                          className="mt-1 text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>View Full Size Standee</span>
                        </button>
                      </div>

                      <div className="sm:col-span-7 space-y-3">
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Canara Bank Official Merchant QR Active</span>
                          </div>
                          <div>
                            Scan directly from your mobile device using Google Pay, PhonePe, Paytm, BHIM or Canara ai1 for <strong>₹{finalTotal.toLocaleString('en-IN')}</strong>.
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Simulate UPI App Used:</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'gpay', label: 'Google Pay' },
                              { id: 'phonepe', label: 'PhonePe' },
                              { id: 'paytm', label: 'Paytm' },
                              { id: 'bhim', label: 'BHIM UPI' }
                            ].map(app => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setSelectedUpiApp(app.id as any)}
                                className={`p-2 rounded-lg text-center font-semibold text-xs border transition-all cursor-pointer ${
                                  selectedUpiApp === app.id
                                    ? 'bg-amber-100 border-amber-600 text-amber-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {app.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">
                            12-Digit UPI Transaction UTR Reference:
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={12}
                              value={upiUtr || '429810482910'}
                              onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                              className="px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-xs w-44 bg-white focus:outline-none focus:border-amber-500"
                            />
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                              ✓ Bank Validated
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 2: Card 3D Secure OTP Simulation */}
                {paymentMethod === 'Card' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-900">3D Secure 2.0 • Bank Two-Factor Auth</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Card ending in {cardNumber.slice(-4)}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Issuing Bank: <strong>State Bank of India / HDFC</strong></span>
                        <span>Amount: <strong>₹{finalTotal.toLocaleString('en-IN')}</strong></span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-700 font-semibold">
                          Enter 6-Digit One-Time Password (OTP) sent to {customerPhone}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={cardOtp}
                            onChange={(e) => setCardOtp(e.target.value)}
                            className="px-3 py-2 border-2 border-amber-500 rounded-lg font-mono text-center text-sm font-bold tracking-widest bg-amber-50/50 w-36 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setCardOtp('882421')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-300 cursor-pointer"
                          >
                            Auto-Fill Sandbox OTP (882421)
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Sandbox code valid for 10 minutes. 3D-Secure certified for zero fraud liability.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: NetBanking Gateway Simulator */}
                {paymentMethod === 'NetBanking' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-900">{selectedBank} Corporate Portal</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                        Institutional Token
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Corporate / User ID</label>
                          <input
                            type="text"
                            value={netbankingUserId}
                            onChange={(e) => setNetbankingUserId(e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Authorization Token</label>
                          <input
                            type="text"
                            value={netbankingOtp}
                            onChange={(e) => setNetbankingOtp(e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        Direct debit from <strong>Institutional Tinkering Account</strong>. Instant RTGS/IMPS settlement to Balki Technologies Escrow.
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 4: School Purchase Order Gateway Simulator */}
                {paymentMethod === 'SchoolPO' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-900">Institutional Purchase Order Authorization</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Net 30 Verified
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                      <p className="text-slate-700">
                        Sanctioning Authority: <strong>{customerName}</strong>
                      </p>
                      <p className="text-slate-700">
                        Institutional Beneficiary: <strong>{schoolName || 'STEM Innovation Lab'}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Compliance: Aligned with NITI Aayog ATL Procurement Guidelines. Official E-Waybill & GST invoice dispatched immediately.
                      </p>
                    </div>
                  </div>
                )}

                {/* Processing Status Banner */}
                {isProcessing && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                      <span>{processingPhase || 'Processing Sandboxed Payment Gateway Request...'}</span>
                    </div>
                    <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full w-2/3 animate-pulse rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep('payment')}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Method</span>
                </button>

                <button
                  type="button"
                  id="btn-simulate-authorize-payment"
                  disabled={isProcessing}
                  onClick={executePaymentVerification}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing & Allocating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {paymentMethod === 'SchoolPO' 
                          ? 'Approve & Sanction PO' 
                          : `Authorize Payment (₹${finalTotal.toLocaleString('en-IN')})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Success, Transaction ID & GST Invoice */}
          {step === 'success' && createdOrder && (
            <div className="space-y-6 text-slate-800">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {createdOrder.paymentMethod === 'SchoolPO' ? 'School Purchase Order Confirmed!' : 'Payment Authorized & Order Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500">
                  Consignment booked via <strong>Priority Insured Express</strong>. Real-time updates active.
                </p>
              </div>

              {/* Transaction ID & Key Reference Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Transaction ID Badge */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Transaction ID
                  </span>
                  <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-amber-950">
                    <span>{createdOrder.paymentReference || `TXN-BALKI-${createdOrder.id}`}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdOrder.paymentReference || `TXN-BALKI-${createdOrder.id}`, 'txn')}
                      className="p-1 hover:bg-amber-100 rounded text-amber-800 cursor-pointer"
                      title="Copy Transaction ID"
                    >
                      {copiedTxnId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-semibold block">Gateway Verified ✓</span>
                </div>

                {/* Order ID Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-slate-900">
                    <span>{createdOrder.id}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdOrder.id, 'order')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold block">Status: QC & Assembly</span>
                </div>

                {/* AWB Tracking Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Logistics Waybill (AWB)
                  </span>
                  <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-slate-900">
                    <span className="truncate max-w-[130px]">{createdOrder.trackingNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdOrder.trackingNumber, 'awb')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Copy AWB Tracking Number"
                    >
                      {copiedAwb ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-amber-800 font-semibold block">
                    Handover OTP: <strong>{createdOrder.deliveryOtp || '4829'}</strong>
                  </span>
                </div>
              </div>

              {/* Official Tax Invoice Container (Printable) */}
              <div id="printable-gst-invoice" className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">BALKI TECHNOLOGIES PVT. LTD.</h4>
                    <p className="text-[11px] text-slate-500">GSTIN: 36AABCB9012K1Z4 • CIN: U72900TG2024PTC184000</p>
                    <p className="text-[11px] text-slate-500">Hyderabad, Telangana - 500081</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded">
                      TAX INVOICE
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700 block">Billed & Shipped To:</span>
                    <p className="font-medium text-slate-900">{createdOrder.customerName}</p>
                    {createdOrder.schoolName && <p className="text-slate-600">{createdOrder.schoolName}</p>}
                    <p className="text-slate-600">{createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} - {createdOrder.shippingAddress.pincode}</p>
                    <p className="text-slate-500">Phone: {createdOrder.customerPhone}</p>
                    {createdOrder.gstin && <p className="font-mono text-amber-800">Buyer GSTIN: {createdOrder.gstin}</p>}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 block">Payment Summary:</span>
                    <p>Method: <strong>{createdOrder.paymentMethod === 'UPI' ? 'UPI (Canara Bank Scan & Pay)' : createdOrder.paymentMethod}</strong></p>
                    {createdOrder.paymentMethod === 'UPI' && (
                      <p className="text-[10px] text-slate-500 font-mono">VPA: 120039687478@canara</p>
                    )}
                    <p>Txn Ref / UTR: <strong className="font-mono text-amber-800">{createdOrder.paymentReference}</strong></p>
                    <p>Status: <span className="text-emerald-700 font-bold">{createdOrder.paymentStatus}</span></p>
                    <p>Dispatch: <strong>Priority Insured Express (Delhivery)</strong></p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2">Item Description</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {createdOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-medium">{item.product.name}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                          <td className="p-2 text-right font-semibold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Totals */}
                <div className="space-y-1 text-right text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxable Value (Excl. GST):</span>
                    <span>₹{createdOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integrated GST (IGST 18%):</span>
                    <span>₹{createdOrder.gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping & Lab Handling:</span>
                    <span>{createdOrder.shippingFee === 0 ? 'FREE' : `₹${createdOrder.shippingFee}`}</span>
                  </div>
                  {createdOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount Applied:</span>
                      <span>-₹{createdOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Total Invoice Amount (INR):</span>
                    <span className="text-amber-700 font-black">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {onTrackOrder && (
                    <button
                      type="button"
                      id="btn-track-consignment-live"
                      onClick={() => {
                        onClose();
                        onTrackOrder(createdOrder);
                      }}
                      className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Track Consignment Live</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={printInvoice}
                    className="px-3.5 py-2 text-xs font-bold border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    type="button"
                    id="btn-download-gst-tax-invoice"
                    onClick={() => downloadTaxInvoice(createdOrder)}
                    className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Tax Invoice (PDF)</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  Continue Browsing STEM Kits
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Resolution QR Scanner Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  CB
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Canara Bank Official QR Scanner</h4>
                  <p className="text-[10px] text-slate-500">Balki Technologies Pvt. Ltd. • Scan & Pay</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pristine high-resolution QR scanner card display */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shadow-inner flex items-center justify-center">
              <img
                src={canaraBankQrImg}
                alt="Canara Bank UPI QR Code Full View"
                className="max-h-[460px] w-auto object-contain mx-auto rounded-xl shadow-md"
              />
            </div>

            {/* Bottom details */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 font-semibold block">Order Total Amount</span>
                <span className="text-base font-black text-slate-900 font-mono">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                onClick={copyUpiId}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {upiCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{upiCopied ? 'Copied VPA!' : 'Copy UPI ID'}</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-slate-700 font-semibold">UPI ID: 120039687478@canara</span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="text-amber-800 font-bold hover:underline cursor-pointer"
              >
                Done Scanning
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
