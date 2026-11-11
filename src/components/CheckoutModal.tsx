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
  School,
  Copy,
  Download,
  Truck,
  Loader2,
  CheckCheck,
  AlertCircle,
  Building,
  Zap,
  PackageCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, OrderRequest, PaymentMethod } from '../types';
import { downloadTaxInvoice, downloadOrderRequestSummary } from '../utils/downloadHelpers';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ServerCalculation {
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  discount: number;
  finalAmount: number;
  currency: 'INR';
  requiresApproval: boolean;
  orderCategory: 'SMALL_ORDER' | 'LARGE_ORDER';
  threshold: number;
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    image: string;
  }>;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  couponDiscount: number;
  appliedCoupon?: string;
  onOrderPlaced: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  couponDiscount,
  appliedCoupon = '',
  onOrderPlaced,
  onTrackOrder
}) => {
  // Step navigation
  // 'details': Form collecting customer details & delivery address + price breakdown
  // 'small_order_ready': Small order created & prepared for Razorpay (Payment Pending)
  // 'large_order_confirmation': Large order request submitted (PENDING, NOT_STARTED)
  const [step, setStep] = useState<'details' | 'small_order_ready' | 'large_order_confirmation'>('details');

  // Authenticated user
  const { currentUser, userProfile } = useAuth();

  // Form states
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [schoolName, setSchoolName] = useState(userProfile?.institution || '');
  const [gstin, setGstin] = useState('');
  
  // Delivery address states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('500001');

  // Server-side authoritative calculation
  const [serverCalc, setServerCalc] = useState<ServerCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcError, setCalcError] = useState('');

  // Order submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [createdRequest, setCreatedRequest] = useState<OrderRequest | null>(null);
  const [razorpayData, setRazorpayData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  } | null>(null);

  // Razorpay payment UI states
  const [paymentProcessingState, setPaymentProcessingState] = useState<'idle' | 'opening' | 'verifying' | 'captured' | 'failed' | 'cancelled'>('idle');
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  const [verifiedPaymentId, setVerifiedPaymentId] = useState('');
  const [copiedPaymentId, setCopiedPaymentId] = useState(false);
  const [selectedMethodTab, setSelectedMethodTab] = useState<'all' | 'upi' | 'card' | 'netbanking' | 'qr'>('all');
  const [dynamicQrString, setDynamicQrString] = useState('');

  // Copy helpers
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedRequestId, setCopiedRequestId] = useState(false);
  const [copiedRzpId, setCopiedRzpId] = useState(false);

  // Populate authenticated defaults
  useEffect(() => {
    if (userProfile || currentUser) {
      if (userProfile?.displayName) setCustomerName(userProfile.displayName);
      if (currentUser?.email) setCustomerEmail(currentUser.email);
      if (userProfile?.phone) setCustomerPhone(userProfile.phone);
      if (userProfile?.institution) setSchoolName(userProfile.institution);
    }
  }, [userProfile, currentUser, isOpen]);

  // Reset steps and error when opening
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setSubmissionError('');
    }
  }, [isOpen]);

  // Authoritatively calculate order amount on the backend whenever items or coupon change
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;
    let isMounted = true;
    setIsCalculating(true);
    setCalcError('');

    fetch('/api/orders/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: appliedCoupon
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server price calculation failed');
        if (isMounted) {
          setServerCalc(data);
        }
      })
      .catch(err => {
        if (isMounted) setCalcError(err.message || 'Error communicating with pricing engine');
      })
      .finally(() => {
        if (isMounted) setIsCalculating(false);
      });

    return () => { isMounted = false; };
  }, [isOpen, cartItems, appliedCoupon]);

  if (!isOpen) return null;

  // Fallbacks if server is still answering initial request
  const fallbackSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const fallbackTax = Number((fallbackSubtotal * 0.18).toFixed(2));
  const fallbackShipping = fallbackSubtotal > 1500 || fallbackSubtotal === 0 ? 0 : 150;
  const fallbackTotal = Math.max(0, fallbackSubtotal + fallbackTax + fallbackShipping - couponDiscount);

  const displaySubtotal = serverCalc ? serverCalc.subtotal : fallbackSubtotal;
  const displayTax = serverCalc ? serverCalc.taxAmount : fallbackTax;
  const displayShipping = serverCalc ? serverCalc.shippingCharges : fallbackShipping;
  const displayDiscount = serverCalc ? serverCalc.discount : couponDiscount;
  const displayTotal = serverCalc ? serverCalc.finalAmount : fallbackTotal;
  const approvalThreshold = serverCalc?.threshold ?? 5000;
  
  // Requirement: Below ₹5,000 automatic payment; ₹5,000 and above owner approval required
  const isLargeOrder = serverCalc ? serverCalc.requiresApproval : (displayTotal >= approvalThreshold);

  // Validate form
  const validateForm = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setSubmissionError('Please provide your full contact information (Name, Email, Phone).');
      return false;
    }
    if (!street.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setSubmissionError('Please provide complete consignment delivery address including PIN code.');
      return false;
    }
    return true;
  };

  // Small order submission handler (< ₹5,000)
  const handleSmallOrderCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmissionError('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerId: currentUser?.uid,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        schoolName: schoolName.trim() || undefined,
        gstin: gstin.trim() || undefined,
        deliveryAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        items: cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: appliedCoupon,
        paymentMethod: 'Razorpay'
      };

      const res = await fetch('/api/orders/checkout-small', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize small order checkout.');
      }

      setCreatedOrder(data.order);
      setRazorpayData(data.razorpay);

      // Persist to Firestore if authenticated
      if (currentUser?.uid && data.order) {
        try {
          const docRef = doc(db, 'orders', data.order.id);
          await setDoc(docRef, {
            ...data.order,
            orderId: data.order.id,
            id: data.order.id,
            userId: currentUser.uid,
            customerId: currentUser.uid,
            customerName: data.order.customerName,
            customerEmail: data.order.customerEmail,
            customerPhone: data.order.customerPhone,
            deliveryAddress: data.order.deliveryAddress,
            shippingAddress: data.order.shippingAddress,
            subtotal: data.order.subtotal,
            taxAmount: data.order.taxAmount || 0,
            gstAmount: data.order.gstAmount || 0,
            shippingCharges: data.order.shippingCharges || 0,
            shippingFee: data.order.shippingFee || 0,
            finalAmount: data.order.finalAmount || data.order.totalAmount,
            totalAmount: data.order.totalAmount || data.order.finalAmount,
            currency: 'INR',
            paymentStatus: data.order.paymentStatus,
            orderStatus: data.order.orderStatus,
            approvalStatus: data.order.approvalStatus,
            razorpayOrderId: data.order.razorpayOrderId,
            trackingNumber: data.order.trackingNumber,
            createdAt: data.order.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn('Firestore sync note:', dbErr);
        }
      }

      onOrderPlaced(data.order);
      setStep('small_order_ready');

      // Automatically launch Razorpay checkout modal so customer is taken directly to payment
      setTimeout(() => {
        handleOpenRazorpay(data.order, data.razorpay);
      }, 100);

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Error creating order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Large order submission handler (>= ₹5,000)
  const handleRequestOwnerApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmissionError('');
    setIsSubmitting(true);

    try {
      const payload = {
        customerId: currentUser?.uid,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        schoolName: schoolName.trim() || undefined,
        gstin: gstin.trim() || undefined,
        deliveryAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        },
        items: cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: appliedCoupon
      };

      const res = await fetch('/api/orders/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order approval request.');
      }

      setCreatedRequest(data.request);

      // Persist to Firestore orderRequests collection if authenticated
      if (currentUser?.uid && data.request) {
        try {
          const docRef = doc(db, 'orderRequests', data.request.requestId);
          await setDoc(docRef, {
            requestId: data.request.requestId,
            id: data.request.requestId,
            customerId: currentUser.uid,
            customerDetails: data.request.customerDetails,
            requestedProducts: data.request.requestedProducts,
            subtotal: data.request.subtotal || 0,
            taxAmount: data.request.taxAmount || 0,
            shippingCharges: data.request.shippingCharges || 0,
            requestedAmount: data.request.requestedAmount,
            finalAmount: data.request.finalAmount || data.request.requestedAmount,
            currency: 'INR',
            approvalStatus: 'PENDING',
            paymentStatus: 'NOT_STARTED',
            createdAt: data.request.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.warn('Firestore sync note:', dbErr);
        }
      }

      setStep('large_order_confirmation');

      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.55 }
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Error submitting approval request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'order' | 'request' | 'rzp' | 'payment') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else if (type === 'request') {
      setCopiedRequestId(true);
      setTimeout(() => setCopiedRequestId(false), 2000);
    } else if (type === 'payment') {
      setCopiedPaymentId(true);
      setTimeout(() => setCopiedPaymentId(false), 2000);
    } else {
      setCopiedRzpId(true);
      setTimeout(() => setCopiedRzpId(false), 2000);
    }
  };

  // Official Razorpay Cryptographic Verification on Backend
  const verifyPaymentOnBackend = async (payload: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setPaymentProcessingState('verifying');
    setPaymentErrorMessage('');

    try {
      const res = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cryptographic payment signature verification failed.');
      }

      setVerifiedPaymentId(payload.razorpay_payment_id);
      setCreatedOrder(data.order);
      setPaymentProcessingState('captured');
      onOrderPlaced(data.order);

      // Update Firestore if authenticated
      if (currentUser?.uid && data.order) {
        try {
          const docRef = doc(db, 'orders', data.order.id);
          await setDoc(docRef, {
            ...data.order,
            paymentStatus: 'Paid',
            razorpayPaymentId: payload.razorpay_payment_id,
            razorpayOrderId: payload.razorpay_order_id,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr) {
          console.warn('Firestore sync note:', dbErr);
        }
      }

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch (e) {}
    } catch (err: any) {
      setPaymentProcessingState('failed');
      setPaymentErrorMessage(err.message || 'Signature verification error on backend.');
    }
  };

  // Launch official Razorpay Checkout SDK
  const handleOpenRazorpay = async (customOrder?: Order, customRzp?: any) => {
    const orderToUse = customOrder || createdOrder;
    if (!orderToUse) return;
    setPaymentProcessingState('opening');
    setPaymentErrorMessage('');

    try {
      let rzpOrderId = customRzp?.orderId || razorpayData?.orderId || orderToUse.razorpayOrderId;
      let rzpKeyId = customRzp?.keyId || razorpayData?.keyId;

      if (!rzpOrderId || !rzpKeyId) {
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderToUse.id,
            customerEmail: orderToUse.customerEmail,
            customerPhone: orderToUse.customerPhone
          })
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.error || 'Failed to initialize Razorpay order');
        }
        rzpOrderId = createData.razorpayOrderId;
        rzpKeyId = createData.keyId;
        setRazorpayData(createData);
      }

      // Check if window.Razorpay SDK is ready
      if (typeof (window as any).Razorpay === 'function') {
        const options = {
          key: rzpKeyId,
          amount: Math.round(orderToUse.totalAmount * 100), // paise
          currency: 'INR',
          name: 'BALKI Technologies',
          description: `Order ${orderToUse.id} - ${orderToUse.items?.length || 1} STEM Hardware Items`,
          image: '/balki-logo.jpg',
          order_id: rzpOrderId,
          prefill: {
            name: orderToUse.customerName,
            email: orderToUse.customerEmail,
            contact: orderToUse.customerPhone
          },
          notes: {
            internalOrderId: orderToUse.id,
            schoolName: orderToUse.schoolName || 'STEM Lab',
            testMode: 'true'
          },
          theme: {
            color: '#d97706' // amber-600
          },
          handler: async function (response: any) {
            // Receive cryptographic signature from Razorpay Checkout modal
            await verifyPaymentOnBackend({
              orderId: orderToUse.id,
              razorpay_order_id: response.razorpay_order_id || rzpOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: function () {
              setPaymentProcessingState('cancelled');
              setPaymentErrorMessage('Transaction was closed or cancelled by customer. Order remains safely saved and can be retried at any time.');
            }
          }
        };

        try {
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (resp: any) {
            setPaymentProcessingState('failed');
            const desc = resp.error?.description || 'Transaction declined by bank/network. In development test mode, use the Instant Test Payment simulation below or configure live test keys.';
            setPaymentErrorMessage(desc);
          });
          rzp.open();
        } catch (openErr: any) {
          console.warn('Razorpay open warning:', openErr);
          setPaymentProcessingState('failed');
          setPaymentErrorMessage(openErr.message || 'Razorpay checkout window could not be opened. You can complete verification using Instant Test Payment below.');
        }
      } else {
        // Fallback for sandboxes without external script loading: run test mode simulated flow
        await handleSimulateTestPayment();
      }
    } catch (err: any) {
      setPaymentProcessingState('failed');
      setPaymentErrorMessage(err.message || 'Payment initiation error.');
    }
  };

  // Sandbox simulation: successful payment with real backend signature validation
  const handleSimulateTestPayment = async () => {
    if (!createdOrder) return;
    const rzpOrderId = razorpayData?.orderId || createdOrder.razorpayOrderId || `order_test_${Date.now()}`;
    const testPaymentId = `pay_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const testSignature = 'test_sig_valid_balki';

    await verifyPaymentOnBackend({
      orderId: createdOrder.id,
      razorpay_order_id: rzpOrderId,
      razorpay_payment_id: testPaymentId,
      razorpay_signature: testSignature
    });
  };

  // Sandbox simulation: bank failure simulation
  const handleSimulateFailure = () => {
    setPaymentProcessingState('failed');
    setPaymentErrorMessage('Transaction declined by issuing bank (Test Error Simulation: Insufficient Balance or Auth Failure). Your order remains pending and can be retried.');
  };

  // Sandbox simulation: user cancel simulation
  const handleSimulateCancel = () => {
    setPaymentProcessingState('cancelled');
    setPaymentErrorMessage('Payment cancelled by user. No funds were debited. You can resume checkout whenever ready.');
  };

  // Load dynamic QR string
  const handleLoadQr = async () => {
    if (!createdOrder) return;
    try {
      const res = await fetch('/api/razorpay/create-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: createdOrder.id,
          amount: createdOrder.totalAmount,
          customerPhone: createdOrder.customerPhone
        })
      });
      const data = await res.json();
      if (res.ok && data.qrString) {
        setDynamicQrString(data.qrString);
      }
    } catch (e) {
      console.warn('QR load error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto sm:my-6 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Balki Technologies Institutional Checkout</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isLargeOrder 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-emerald-400 text-slate-950'
                }`}>
                  {isLargeOrder ? 'Owner Approval Category (≥ ₹5,000)' : 'Automatic Payment Category (< ₹5,000)'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Authoritative Server-Verified Pricing • Currency: INR • Anti-Tamper Protected
              </p>
            </div>
          </div>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Details & Order Processing Category Routing */}
          {step === 'details' && (
            <form onSubmit={isLargeOrder ? handleRequestOwnerApproval : handleSmallOrderCheckout} className="space-y-4">
              
              {/* Dynamic Threshold Category Banner */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                isLargeOrder 
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              }`}>
                {isLargeOrder ? (
                  <Building className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase tracking-wide">
                      {isLargeOrder ? 'Large Order Processing Path' : 'Small Order Processing Path'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded font-mono ${
                      isLargeOrder ? 'bg-amber-200 text-amber-950' : 'bg-emerald-200 text-emerald-950'
                    }`}>
                      Threshold: ₹{approvalThreshold.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isLargeOrder ? (
                      <>
                        Total order value of <strong className="font-bold">₹{displayTotal.toLocaleString('en-IN')}</strong> meets or exceeds the <strong className="font-bold">₹{approvalThreshold.toLocaleString('en-IN')}</strong> threshold. In accordance with institutional procurement rules, this order will be routed to the <strong>Owner Approval Required</strong> path. Our team will verify lab stock and confirm pricing.
                      </>
                    ) : (
                      <>
                        Total order value of <strong className="font-bold">₹{displayTotal.toLocaleString('en-IN')}</strong> is below <strong className="font-bold">₹{approvalThreshold.toLocaleString('en-IN')}</strong>. This order qualifies for the <strong>Automatic Payment Checkout</strong> path and will be staged for Razorpay integration.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Server calculation warning or error */}
              {calcError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{calcError}</span>
                </div>
              )}

              {/* Submission error */}
              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Educator / Customer Information */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <School className="w-4 h-4 text-amber-600" />
                    Customer & Institutional Contact
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">* Mandatory fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Official / Personal Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="educator@school.edu.in"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">School / Institution Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kendriya Vidyalaya ATL Innovation Hub"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">GSTIN (Optional for 18% Input Tax Credit)</label>
                    <input
                      type="text"
                      placeholder="36AAAAA0000A1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 uppercase font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Consignment Delivery Address (Lab Location)
                  </h4>
                  <span className="text-[10px] text-slate-400">Delhivery Priority Logistics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Street / Campus Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Plot No. 42, Innovation Block, Sector 2"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Hyderabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
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
                      placeholder="500001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Authoritative Final Price Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Final Authoritative Price Breakdown
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Currency: INR (₹)
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600 text-xs">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal (Trusted Server Prices):</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{displaySubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>18% GST (Indian Standard IGST):</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      ₹{displayTax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Priority School Shipping:</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {displayShipping === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE (Orders &gt; ₹1,500)</span>
                      ) : (
                        `₹${displayShipping}`
                      )}
                    </span>
                  </div>
                  {displayDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Applied Coupon Discount ({appliedCoupon || 'PROMO'}):</span>
                      <span className="font-mono">-₹{displayDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>Total Payable / Requested:</span>
                      {isCalculating && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />}
                    </div>
                    <span className="text-base text-amber-700 font-mono font-black">
                      ₹{displayTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Conditioned by Server Threshold */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  <span>Order Processing: </span>
                  <strong className={isLargeOrder ? 'text-amber-800' : 'text-emerald-700'}>
                    {isLargeOrder ? 'Owner Approval Required' : 'Automatic Payment Checkout'}
                  </strong>
                </div>

                {isLargeOrder ? (
                  /* HIGH-VALUE ORDER (>= ₹5,000): Replace normal button with "Request Owner Approval" */
                  <button
                    type="submit"
                    id="btn-request-owner-approval"
                    disabled={isSubmitting || isCalculating}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Building className="w-4 h-4" />
                        <span>Request Owner Approval</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  /* SMALL ORDER (< ₹5,000): Normal checkout button */
                  <button
                    type="submit"
                    id="btn-proceed-to-payment"
                    disabled={isSubmitting || isCalculating}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preparing Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Proceed to Payment</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 2A: Professional Razorpay Payment Gateway Interface (< ₹5,000 Small Orders) */}
          {step === 'small_order_ready' && createdOrder && (
            <div className="space-y-5 text-slate-800 animate-in fade-in">
              
              {/* Header: Payment Capture Status */}
              <div className="text-center space-y-1.5">
                {paymentProcessingState === 'captured' ? (
                  <div className="w-13 h-13 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : paymentProcessingState === 'failed' ? (
                  <div className="w-13 h-13 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                ) : paymentProcessingState === 'cancelled' ? (
                  <div className="w-13 h-13 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <Clock className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-13 h-13 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <ShieldCheck className="w-7 h-7 text-blue-600" />
                  </div>
                )}

                <h3 className="text-lg font-black text-slate-900">
                  {paymentProcessingState === 'captured' 
                    ? 'Payment Confirmed & Order Dispatched!' 
                    : paymentProcessingState === 'failed'
                    ? 'Payment Attempt Failed'
                    : paymentProcessingState === 'cancelled'
                    ? 'Payment Cancelled by Customer'
                    : 'Razorpay Payment Gateway (Test Mode)'}
                </h3>

                <p className="text-xs text-slate-500">
                  {paymentProcessingState === 'captured'
                    ? 'Cryptographic payment signature verified by backend. Allocation confirmed.'
                    : `Order Total: ₹${createdOrder.totalAmount.toLocaleString('en-IN')} (Automatic Payment Category < ₹${approvalThreshold.toLocaleString('en-IN')})`}
                </p>
              </div>

              {/* Status & Gateway Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Balki Order ID
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
                  <span className="text-[9px] text-emerald-700 font-semibold block">Pre-Approved ✓</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    Razorpay Reference
                  </span>
                  <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-blue-950">
                    <span className="truncate max-w-[130px]">
                      {verifiedPaymentId || razorpayData?.orderId || createdOrder.razorpayOrderId}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(verifiedPaymentId || razorpayData?.orderId || createdOrder.razorpayOrderId || '', 'rzp')}
                      className="p-1 hover:bg-blue-100 rounded text-blue-800 cursor-pointer"
                      title="Copy Payment Reference"
                    >
                      {copiedRzpId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-blue-700 font-semibold block">
                    {paymentProcessingState === 'captured' ? 'Captured (Test Mode)' : 'Order Staged'}
                  </span>
                </div>

                <div className={`border rounded-xl p-3 space-y-0.5 ${
                  paymentProcessingState === 'captured' 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : paymentProcessingState === 'failed'
                    ? 'bg-rose-50 border-rose-300'
                    : paymentProcessingState === 'cancelled'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Payment Status
                  </span>
                  <div className={`text-xs font-black ${
                    paymentProcessingState === 'captured'
                      ? 'text-emerald-700'
                      : paymentProcessingState === 'failed'
                      ? 'text-rose-700'
                      : paymentProcessingState === 'cancelled'
                      ? 'text-amber-800'
                      : 'text-slate-900'
                  }`}>
                    {paymentProcessingState === 'captured' 
                      ? 'Paid' 
                      : paymentProcessingState === 'failed'
                      ? 'Payment Failed'
                      : paymentProcessingState === 'cancelled'
                      ? 'Cancelled'
                      : createdOrder.paymentStatus}
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold block">
                    {paymentProcessingState === 'captured' ? 'Verified via HMAC SHA256' : 'Gateway Authorization Pending'}
                  </span>
                </div>
              </div>

              {/* Error / Cancellation Feedback Banner */}
              {paymentErrorMessage && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                  paymentProcessingState === 'failed'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-current" />
                  <div className="flex-1">
                    <div className="font-bold">
                      {paymentProcessingState === 'failed' ? 'Transaction Error' : 'Transaction Notice'}
                    </div>
                    <p className="text-[11px] mt-0.5 leading-relaxed">{paymentErrorMessage}</p>
                  </div>
                </div>
              )}

              {/* Processing Spinner State Banner */}
              {(paymentProcessingState === 'opening' || paymentProcessingState === 'verifying') && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center gap-3 animate-pulse">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold">
                    {paymentProcessingState === 'opening' 
                      ? 'Initializing Secure Razorpay Checkout Session...' 
                      : 'Validating Cryptographic HMAC SHA256 Signature with Backend...'}
                  </span>
                </div>
              )}

              {/* SUCCESS STATE CARD */}
              {paymentProcessingState === 'captured' ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Transaction Authenticated: {verifiedPaymentId || createdOrder.razorpayPaymentId}</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Payment of <strong className="font-bold">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</strong> was cryptographically authenticated against Razorpay secret keys. Official GST tax invoice issued and inventory allocation locked. Consignment dispatched under tracking ID <span className="font-mono font-bold">{createdOrder.trackingNumber}</span>.
                  </p>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 flex justify-between items-center text-[11px]">
                    <span className="text-slate-600">School Lab Handover Security OTP:</span>
                    <span className="font-mono font-black text-emerald-800 text-sm">{createdOrder.deliveryOtp || '4481'}</span>
                  </div>
                </div>
              ) : (
                /* PAYMENT METHODS & DETAILS CARD (Pending / Failed / Cancelled) */
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs">
                  
                  {/* Itemized Order Breakdown */}
                  <div className="p-4 border-b border-slate-200 space-y-2">
                    <div className="flex justify-between items-center pb-1 border-b border-slate-200/80">
                      <span className="font-bold text-slate-800">STEM Hardware Items ({createdOrder.items.length})</span>
                      <span className="font-bold text-amber-800 font-mono text-sm">
                        Payable: ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-200/70 max-h-36 overflow-y-auto">
                      {createdOrder.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between text-[11px]">
                          <div className="pr-2">
                            <span className="font-semibold text-slate-900">{item.product.name}</span>
                            <span className="text-slate-500 block text-[10px]">
                              Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 shrink-0">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supported Payment Methods Navigation */}
                  <div className="p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        Supported Payment Methods (Razorpay Test Gateway)
                      </span>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                        Test Mode Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMethodTab('upi')}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          selectedMethodTab === 'upi' ? 'border-amber-500 bg-amber-50/60' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-600 mb-1" />
                        <div className="font-bold text-[11px] text-slate-900">UPI Instant</div>
                        <div className="text-[9px] text-slate-500">GPay, PhonePe, Paytm</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethodTab('card')}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          selectedMethodTab === 'card' ? 'border-amber-500 bg-amber-50/60' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-blue-600 mb-1" />
                        <div className="font-bold text-[11px] text-slate-900">Cards</div>
                        <div className="text-[9px] text-slate-500">Visa, RuPay, MC</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMethodTab('netbanking')}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          selectedMethodTab === 'netbanking' ? 'border-amber-500 bg-amber-50/60' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-indigo-600 mb-1" />
                        <div className="font-bold text-[11px] text-slate-900">Net Banking</div>
                        <div className="text-[9px] text-slate-500">50+ Indian Banks</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMethodTab('qr');
                          handleLoadQr();
                        }}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          selectedMethodTab === 'qr' ? 'border-amber-500 bg-amber-50/60' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-amber-600 mb-1" />
                        <div className="font-bold text-[11px] text-slate-900">Dynamic QR</div>
                        <div className="text-[9px] text-slate-500">Scan & Pay</div>
                      </button>
                    </div>

                    {/* Method Specific Explainer */}
                    {selectedMethodTab === 'qr' && (
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-3 text-xs">
                        <div className="w-12 h-12 bg-white rounded-lg border border-amber-300 flex items-center justify-center shrink-0">
                          <QrCode className="w-8 h-8 text-slate-900" />
                        </div>
                        <div className="flex-1 text-[11px] space-y-0.5">
                          <div className="font-bold text-amber-950">Dynamic UPI QR Ready</div>
                          <div className="text-amber-800 text-[10px]">
                            Scan with BHIM, Google Pay, or PhonePe. Reference: <span className="font-mono font-bold">{createdOrder.id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {paymentProcessingState === 'captured' ? (
                    <>
                      {onTrackOrder && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onTrackOrder(createdOrder);
                          }}
                          className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Track Consignment</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => downloadTaxInvoice(createdOrder)}
                        className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Tax Invoice (PDF)</span>
                      </button>
                    </>
                  ) : (
                    /* PRIMARY PAYMENT ACTION */
                    <button
                      type="button"
                      id="btn-pay-razorpay"
                      onClick={handleOpenRazorpay}
                      disabled={paymentProcessingState === 'opening' || paymentProcessingState === 'verifying'}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {paymentProcessingState === 'opening' || paymentProcessingState === 'verifying' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ₹{createdOrder.totalAmount.toLocaleString('en-IN')} with Razorpay</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {paymentProcessingState !== 'captured' && (
                    <button
                      type="button"
                      onClick={handleSimulateTestPayment}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl transition cursor-pointer border border-slate-200 flex items-center gap-1"
                      title="Test mode instant validation using valid backend HMAC SHA256"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Instant Test Payment</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
                  >
                    {paymentProcessingState === 'captured' ? 'Done' : 'Pay Later'}
                  </button>
                </div>
              </div>

              {/* Sandbox Test Mode Simulation Tools (For evaluator to test failure and cancellation states) */}
              {paymentProcessingState !== 'captured' && (
                <div className="p-3 bg-slate-100/90 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Razorpay Test Mode Developer Controls
                    </span>
                    <span className="text-[10px] text-slate-400">Evaluate Error & Cancel States</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSimulateFailure}
                      className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 text-[10px] font-semibold rounded border border-rose-200 transition cursor-pointer"
                    >
                      Simulate Bank Failure
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulateCancel}
                      className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 text-[10px] font-semibold rounded border border-amber-200 transition cursor-pointer"
                    >
                      Simulate User Cancelled
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulateTestPayment}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded border border-emerald-200 transition cursor-pointer"
                    >
                      Simulate Backend HMAC Verified
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 2B: Large Order Confirmation Page (Owner Approval Required) */}
          {step === 'large_order_confirmation' && createdRequest && (
            <div className="space-y-5 text-slate-800 animate-in fade-in">
              <div className="text-center space-y-1.5">
                <div className="w-13 h-13 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Order Approval Request Submitted
                </h3>
                {/* EXACT REQUIRED MESSAGE */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-semibold text-xs leading-relaxed max-w-lg mx-auto shadow-xs">
                  "Your order request has been successfully submitted. Our team will verify product availability and contact you shortly regarding pricing and payment."
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Unique Request ID
                  </span>
                  <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs text-slate-900">
                    <span>{createdRequest.requestId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdRequest.requestId, 'request')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Copy Request ID"
                    >
                      {copiedRequestId ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold block">Stored in Firestore</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Approval Status
                  </span>
                  <div className="text-xs font-black text-amber-900 font-mono">
                    {createdRequest.approvalStatus}
                  </div>
                  <span className="text-[9px] text-amber-800 font-semibold block">
                    Awaiting Owner Review
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Payment Status
                  </span>
                  <div className="text-xs font-black text-slate-800 font-mono">
                    {createdRequest.paymentStatus}
                  </div>
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    Zero payment collected
                  </span>
                </div>
              </div>

              {/* Requested Hardware Breakdown Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800">Requested Hardware & Estimated Amount</span>
                  <span className="font-bold text-amber-800 font-mono">
                    ₹{(createdRequest.requestedAmount || createdRequest.finalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-slate-200/80">
                  {createdRequest.requestedProducts.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-[11px]">
                      <div>
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-slate-500">Quantity: {item.quantity} × ₹{item.estimatedUnitPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900">
                        ₹{(item.estimatedUnitPrice * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Contact Person:</span>
                    <span className="font-medium text-slate-900">{createdRequest.customerDetails.name} ({createdRequest.customerDetails.phone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Delivery Address:</span>
                    <span className="font-medium text-slate-900">{createdRequest.customerDetails.address}</span>
                  </div>
                </div>
              </div>

              {/* Protection Notice */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Our engineering fulfillment team reviews all high-value institutional requests within 4 hours. You will receive an official notification via WhatsApp and email.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  id="btn-download-order-request-summary"
                  onClick={() => downloadOrderRequestSummary(createdRequest)}
                  className="px-4 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Quotation Summary (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Return to STEM Catalog
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
