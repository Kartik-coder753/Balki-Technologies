import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShoppingBag, 
  Package, 
  Truck, 
  Download, 
  Calendar, 
  Copy, 
  Check, 
  Edit3, 
  Save, 
  X, 
  Award, 
  Clock, 
  Key, 
  User, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Order, RentalBooking, Course, NavTab, UserProgress } from '../types';
import { downloadTaxInvoice } from '../utils/downloadHelpers';
import { AdminOrderManager } from './AdminOrderManager';

interface ClientDashboardProps {
  orders: Order[];
  rentals: RentalBooking[];
  courses: Course[];
  userProgress: UserProgress;
  setActiveTab: (tab: NavTab) => void;
  onTrackOrder?: (order: Order) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  orders: initialOrders,
  rentals,
  courses,
  userProgress,
  setActiveTab,
  onTrackOrder
}) => {
  const { currentUser, userProfile, updateProfileData } = useAuth();
  const isAdmin = currentUser?.email?.toLowerCase() === 'kartikks1205@gmail.com' || userProfile?.role === 'Admin';
  const [activeSubTab, setActiveSubTab] = useState<'purchases' | 'credentials' | 'tinkering' | 'admin_console'>('purchases');
  
  // Real-time Firestore client orders
  const [clientOrders, setClientOrders] = useState<Order[]>(initialOrders);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  
  // Credentials / Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editInstitution, setEditInstitution] = useState(userProfile?.institution || '');
  const [editInstitutionType, setEditInstitutionType] = useState(userProfile?.institutionType || 'Kendriya Vidyalaya');
  const [editRole, setEditRole] = useState(userProfile?.role || 'ATL In-Charge');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);

  // Copy indicators
  const [copiedUid, setCopiedUid] = useState(false);

  // Sync edit form when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.displayName || '');
      setEditInstitution(userProfile.institution || '');
      setEditInstitutionType(userProfile.institutionType || 'Kendriya Vidyalaya');
      setEditRole(userProfile.role || 'ATL In-Charge');
      setEditPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  // Real-time query to Firestore for orders belonging to this authenticated user
  useEffect(() => {
    if (!currentUser) {
      setClientOrders([]);
      setLoadingOrders(false);
      return;
    }

    try {
      const ordersCol = collection(db, 'orders');
      // Query orders where userId == currentUser.uid
      const q = query(ordersCol, where('userId', '==', currentUser.uid));
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Order);
          });
          // Sort latest orders first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setClientOrders(list);
          setLoadingOrders(false);
        },
        (error) => {
          console.warn('Firestore orders query error, falling back to local/REST', error);
          handleFirestoreError(error, 'read', 'orders');
          // Fallback to initial local orders filtered by email/uid
          const filtered = initialOrders.filter(
            (o) => o.userId === currentUser.uid || o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
          );
          setClientOrders(filtered);
          setLoadingOrders(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Orders listener setup failed', err);
      setLoadingOrders(false);
    }
  }, [currentUser, initialOrders]);

  const copyUidToClipboard = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMessage(null);

    try {
      await updateProfileData({
        displayName: editName.trim(),
        institution: editInstitution.trim(),
        institutionType: editInstitutionType,
        role: editRole,
        phone: editPhone.trim()
      });
      setIsEditingProfile(false);
      setProfileSuccessMessage('Client profile & credentials updated successfully.');
      setTimeout(() => setProfileSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update client profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Compute purchase statistics
  const hasPurchased = clientOrders.length > 0 || !!userProfile?.hasPurchased;
  const totalOrdersCount = clientOrders.length;
  const totalSpent = clientOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const totalItemsCount = clientOrders.reduce(
    (sum, ord) => sum + ord.items.reduce((iSum, it) => iSum + it.quantity, 0),
    0
  );
  const inTransitCount = clientOrders.filter(
    (o) => o.orderStatus === 'in_transit' || o.orderStatus === 'dispatched' || o.orderStatus === 'qc_assembly'
  ).length;

  const registrationDate = userProfile?.createdAt 
    ? new Date(userProfile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Active';

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-12 sm:pb-16 px-3 sm:px-6">
      
      {/* 1. Header Banner & Identity Card */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-slate-900/40 to-slate-950 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Client Identity Block */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl sm:text-3xl font-black shadow-lg border border-amber-400/30 shrink-0">
              {(userProfile?.displayName || currentUser?.email || 'C').charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-white truncate max-w-[200px] sm:max-w-none">
                  {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Client Account'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userProfile?.role || 'ATL In-Charge'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Client</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{userProfile?.institution || 'Atal Tinkering Partner Institution'}</span>
                <span>•</span>
                <span className="text-slate-400 shrink-0">{userProfile?.institutionType || 'Kendriya Vidyalaya'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-slate-300 truncate max-w-[180px] sm:max-w-none">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{currentUser?.email}</span>
                </span>
                {userProfile?.phone && (
                  <span className="flex items-center gap-1 text-slate-300 shrink-0">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {userProfile.phone}
                  </span>
                )}
                <span className="shrink-0">Joined: {registrationDate}</span>
              </div>
            </div>
          </div>

          {/* Purchasing Status Highlight Badge */}
          <div className="bg-slate-900/90 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shrink-0 lg:max-w-xs w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Purchasing Status</span>
              {hasPurchased ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ✓ Active Buyer
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  No Purchases Yet
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {hasPurchased
                ? `${totalOrdersCount} verified equipment order(s) registered under this institutional client.`
                : 'Account created and verified. No STEM products have been purchased yet under this account.'}
            </p>

            {!hasPurchased && (
              <button
                onClick={() => {
                  setActiveTab('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center min-h-[42px]"
              >
                Browse Hardware Catalog
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 2. Key Client Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-bold">
            <span className="truncate">Purchases</span>
            <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              {hasPurchased ? 'Active' : 'None'}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
            {hasPurchased ? `${totalOrdersCount} orders placed` : '0 orders placed'}
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-bold">
            <span className="truncate">Procured</span>
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {totalItemsCount} <span className="text-xs text-slate-500 font-normal">units</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Hardware & kits</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-bold">
            <span className="truncate">Investment</span>
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">GST billing incl.</p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-bold">
            <span className="truncate">Consignments</span>
            <Truck className="w-4 h-4 text-orange-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {inTransitCount} <span className="text-xs text-slate-500 font-normal">active</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Delhivery Express</p>
        </div>

      </div>

      {/* 3. Navigation Sub-Tabs - Horizontal Swipe on Mobile */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
        <button
          onClick={() => setActiveSubTab('purchases')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] ${
            activeSubTab === 'purchases'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Product Orders ({clientOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('credentials')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] ${
            activeSubTab === 'credentials'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4 text-amber-400" />
          <span>Client Credentials & Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tinkering')}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] ${
            activeSubTab === 'tinkering'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>ATL Learning & Hardware Rentals</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveSubTab('admin_console')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] ${
              activeSubTab === 'admin_console'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Admin Approvals & Orders</span>
          </button>
        )}
      </div>

      {profileSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl animate-in fade-in flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{profileSuccessMessage}</span>
        </div>
      )}

      {/* 4. Tab 1: Product Buying Histories */}
      {activeSubTab === 'purchases' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Official Equipment Purchase Records
              </h3>
              <p className="text-xs text-slate-500">
                Real-time purchase orders stored in the database for client: <span className="font-bold text-slate-800">{currentUser?.email}</span>
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>+ Place New Order</span>
            </button>
          </div>

          {loadingOrders ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Loading client purchase history from database...
            </div>
          ) : clientOrders.length === 0 ? (
            <div className="py-16 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  No Products Purchased Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your client account is active, but you haven't placed an order yet. All purchases made with this account will automatically sync here with GST Tax Invoices and Delhivery tracking.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Explore Balki STEM Store
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {clientOrders.map((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 sm:space-y-5"
                  >
                    {/* Top Row: Order ID, Date, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-slate-900">
                            {order.id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500">{orderDate}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-700">{order.paymentMethod}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Tracking No: <span className="text-slate-700 font-bold">{order.trackingNumber}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.approvalStatus && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.approvalStatus === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.approvalStatus === 'pending_approval'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {order.approvalStatus === 'pending_approval' ? 'Approval Pending' : order.approvalStatus === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus.includes('Paid') || order.paymentStatus.includes('Approved')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.paymentStatus}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider text-[10px]">
                          {order.orderStatus?.replace('_', ' ') || 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Products Purchased in this order */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Purchased Equipment ({order.items.length} items)
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                          >
                            <img
                              src={it.product.image}
                              alt={it.product.name}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80';
                              }}
                              className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {it.product.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span>Qty: <strong className="text-slate-800">{it.quantity}</strong></span>
                                <span>•</span>
                                <span>₹{it.product.price.toLocaleString('en-IN')} each</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-slate-900 shrink-0">
                              ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Summary and Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500">
                        <span>Subtotal: ₹{order.subtotal?.toLocaleString('en-IN')}</span>
                        <span className="mx-2">•</span>
                        <span>GST: ₹{order.gstAmount?.toLocaleString('en-IN')}</span>
                        <span className="mx-2">•</span>
                        <span className="font-bold text-slate-900 text-sm">
                          Total Paid: ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onTrackOrder && (
                          <button
                            id={`btn-client-track-${order.id}`}
                            onClick={() => onTrackOrder(order)}
                            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Track Consignment</span>
                          </button>
                        )}

                        <button
                          id={`btn-client-invoice-${order.id}`}
                          onClick={() => downloadTaxInvoice(order)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tax Invoice (PDF)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Client Credentials & Profile */}
      {activeSubTab === 'credentials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Client Credentials & Identity Record
              </h3>
              <p className="text-xs text-slate-500">
                Institutional account information stored securely in the database.
              </p>
            </div>

            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Full Name / Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Institution / School Name</label>
                  <input
                    type="text"
                    required
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Institution Type</label>
                  <select
                    value={editInstitutionType}
                    onChange={(e) => setEditInstitutionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Kendriya Vidyalaya">Kendriya Vidyalaya (KVS)</option>
                    <option value="Navodaya Vidyalaya">Jawahar Navodaya Vidyalaya (JNV)</option>
                    <option value="Private CBSE/ICSE">Private CBSE / ICSE School</option>
                    <option value="Govt Model School">State Government Model School</option>
                    <option value="University/College">Engineering College / University</option>
                    <option value="Corporate/Industrial">Corporate / Industrial Innovation Lab</option>
                    <option value="Individual Tinkerer">Individual Tinkerer / Mentor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Official Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 outline-none focus:border-amber-500 bg-white"
                >
                  <option value="ATL In-Charge">ATL In-Charge / Lab Director</option>
                  <option value="Principal / Director">Principal / Head of Institution</option>
                  <option value="STEM Educator">Senior STEM / Physics / Robotics Educator</option>
                  <option value="Student Innovator">Student Innovator / Tinkerer</option>
                  <option value="Procurement Officer">Institutional Procurement Officer</option>
                  <option value="Client">Individual STEM Client</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unique Client ID (UID)</span>
                  <div className="flex items-center justify-between font-mono text-slate-800 font-bold">
                    <span className="truncate">{currentUser?.uid || 'N/A'}</span>
                    <button
                      onClick={copyUidToClipboard}
                      className="p-1 hover:bg-slate-200 rounded-md transition-colors cursor-pointer text-slate-500"
                      title="Copy UID"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Authenticated Email</span>
                  <p className="font-bold text-slate-900">{currentUser?.email || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Official Contact Phone</span>
                  <p className="font-bold text-slate-900">{userProfile?.phone || 'Not configured'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Affiliation</span>
                  <p className="font-bold text-slate-900">{userProfile?.institution || 'Atal Tinkering Partner'}</p>
                  <p className="text-[11px] text-slate-500">{userProfile?.institutionType || 'Kendriya Vidyalaya'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Designation / Role</span>
                  <p className="font-bold text-slate-900">{userProfile?.role || 'ATL In-Charge'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Registration Timestamp</span>
                  <p className="font-bold text-slate-900">{registrationDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: ATL Learning & Hardware Rentals */}
      {activeSubTab === 'tinkering' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Rentals */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Hardware Rentals & Prototyping Gear
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
                  <p className="text-[11px] text-slate-400 mt-1">
                    Need a high-speed 3D printer, 100MHz oscilloscope, or CNC PCB miller for an upcoming school project?
                  </p>
                  <button
                    onClick={() => setActiveTab('rentals')}
                    className="mt-3 px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
                  >
                    View Rental Catalog
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* NEP 2020 Course & Certificate Hub */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                NEP 2020 Hands-on Curriculum
              </h3>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold"
              >
                Explore Modules
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">ATL Tinkering Hours Log</span>
                <span className="font-mono text-amber-600 font-bold">{userProgress.tinkeringHours || 0} hrs logged</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Complete interactive experiment modules to earn verified ATL certificates accredited under NEP 2020 guidelines.
              </p>
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Access Course Classroom
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab 4: Administrative Order Approvals & Management Console */}
      {activeSubTab === 'admin_console' && isAdmin && (
        <AdminOrderManager />
      )}

    </div>
  );
};
