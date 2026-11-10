import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Truck, 
  FileText, 
  Building2, 
  DollarSign, 
  AlertCircle,
  RefreshCw,
  Eye,
  Check,
  X,
  CreditCard,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { Order, OrderRequest, PaymentTransaction, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminOrderManager: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'requests' | 'transactions'>('orders');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<OrderRequest[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Reject Modal State
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Status Change Modal State
  const [statusUpdateOrderId, setStatusUpdateOrderId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('dispatched');
  const [courierName, setCourierName] = useState<string>('Delhivery B2B Priority');
  const [statusNote, setStatusNote] = useState<string>('');

  // Quote Request Approval Modal State
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);
  const [quotedAmount, setQuotedAmount] = useState<number>(0);

  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-email': currentUser?.email || 'kartikks1205@gmail.com',
    'x-admin-key': 'balki-super-admin-key-2026'
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordRes, reqRes, txnRes] = await Promise.all([
        fetch('/api/admin/orders', { headers: adminHeaders }),
        fetch('/api/admin/order-requests', { headers: adminHeaders }),
        fetch('/api/admin/transactions', { headers: adminHeaders })
      ]);

      if (ordRes.ok) setOrders(await ordRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
      if (txnRes.ok) setTransactions(await txnRes.json());
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleApproveOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: 'POST',
        headers: adminHeaders
      });
      if (res.ok) {
        setSuccessNotice(`Order ${orderId} verified and approved. Moved to assembly queue.`);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectingOrderId) return;
    setActionLoading(rejectingOrderId);
    try {
      const res = await fetch(`/api/admin/orders/${rejectingOrderId}/reject`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ rejectionReason: rejectionReason || 'Institutional review verification failed' })
      });
      if (res.ok) {
        setSuccessNotice(`Order ${rejectingOrderId} marked rejected. Inventory restored.`);
        setRejectingOrderId(null);
        setRejectionReason('');
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusUpdateOrderId) return;
    setActionLoading(statusUpdateOrderId);
    try {
      const res = await fetch(`/api/admin/orders/${statusUpdateOrderId}/status`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          status: targetStatus,
          courierName,
          note: statusNote || undefined
        })
      });
      if (res.ok) {
        setSuccessNotice(`Consignment status updated to ${targetStatus.toUpperCase()}.`);
        setStatusUpdateOrderId(null);
        setStatusNote('');
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleApproveRequest = async () => {
    if (!approvingRequestId) return;
    setActionLoading(approvingRequestId);
    try {
      const res = await fetch(`/api/admin/order-requests/${approvingRequestId}/approve`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ finalQuotedAmount: quotedAmount })
      });
      if (res.ok) {
        setSuccessNotice(`Quote request ${approvingRequestId} approved at INR ${quotedAmount.toLocaleString('en-IN')}.`);
        setApprovingRequestId(null);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'pending'
      ? o.approvalStatus === 'pending_approval'
      : statusFilter === 'approved'
      ? o.approvalStatus === 'approved'
      : statusFilter === 'rejected'
      ? o.approvalStatus === 'rejected'
      : o.orderStatus === statusFilter;

    const matchesSearch = !searchQuery || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.schoolName && o.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Administrative Procurement & Order Console
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Super Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Server-verified authorization: <strong className="text-slate-300">{currentUser?.email || 'kartikks1205@gmail.com'}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            Sync Records
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {successNotice}
          </span>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-400/60 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'orders'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'requests'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          Bulk Quote Requests ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'transactions'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Audit Ledger ({transactions.length})
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending Approval' },
                { id: 'approved', label: 'Approved' },
                { id: 'qc_assembly', label: 'In Assembly' },
                { id: 'dispatched', label: 'Dispatched' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'rejected', label: 'Rejected' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    statusFilter === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search order ID, school, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No orders matching the active criteria. Place an order via store checkout to test live approval.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer & Institution</th>
                    <th className="py-3 px-4">Amount & Payment</th>
                    <th className="py-3 px-4">Approval</th>
                    <th className="py-3 px-4">Status & Carrier</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOrders.map((ord) => {
                    const isPending = ord.approvalStatus === 'pending_approval';
                    const isApproved = ord.approvalStatus === 'approved';
                    const isRejected = ord.approvalStatus === 'rejected';

                    return (
                      <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">
                          {ord.id}
                          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{ord.customerName}</div>
                          <div className="text-slate-400 text-[11px]">{ord.customerEmail}</div>
                          {ord.schoolName && (
                            <div className="text-slate-500 text-[10px] flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-amber-400/80" />
                              {ord.schoolName}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">
                            INR {(ord.finalAmount || ord.totalAmount).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {ord.paymentMethod}
                            </span>
                            <span className={`text-[10px] ${
                              ord.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isApproved && <CheckCircle className="w-3 h-3" />}
                            {isPending && <Clock className="w-3 h-3" />}
                            {isRejected && <XCircle className="w-3 h-3" />}
                            {ord.approvalStatus?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 font-medium capitalize">
                            {ord.orderStatus?.replace('_', ' ')}
                          </div>
                          <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                            {ord.trackingNumber}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              title="View Order Details"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApproveOrder(ord.id)}
                                  disabled={actionLoading === ord.id}
                                  title="Approve Order"
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 transition"
                                >
                                  <Check className="w-3 h-3" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejectingOrderId(ord.id)}
                                  title="Reject Order"
                                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => {
                                  setStatusUpdateOrderId(ord.id);
                                  setTargetStatus(ord.orderStatus === 'qc_assembly' ? 'dispatched' : 'in_transit');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs flex items-center gap-1 transition"
                              >
                                <Truck className="w-3 h-3" />
                                Update Status
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BULK QUOTE REQUESTS */}
      {activeTab === 'requests' && (
        <div className="mt-6 space-y-4">
          {requests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No institutional quote requests pending.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div key={req.requestId} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{req.requestId}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {req.customerDetails?.schoolName || req.customerDetails?.name}
                      </h4>
                      <p className="text-xs text-slate-400">{req.customerDetails?.email} • {req.customerDetails?.phone}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      req.approvalStatus === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : req.approvalStatus === 'pending_approval'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {req.approvalStatus}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/60">
                    <div className="text-xs text-slate-300 font-medium mb-1.5">
                      Requested Hardware ({req.requestedProducts?.length} line items):
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {req.requestedProducts?.map((p, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{p.quantity}x {p.productName}</span>
                          <span>INR {(p.estimatedUnitPrice * p.quantity).toLocaleString('en-IN')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-slate-400">
                        {req.approvalStatus === 'approved' && req.finalQuotedAmount ? 'Approved Final Quotation:' : 'Total Estimated:'}
                      </div>
                      <div className="text-sm font-bold text-white">
                        INR {(req.finalQuotedAmount || req.requestedAmount)?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {(req.approvalStatus === 'pending_approval' || (req.approvalStatus as string) === 'PENDING') && (
                      <button
                        onClick={() => {
                          setApprovingRequestId(req.requestId);
                          setQuotedAmount(Math.round(req.requestedAmount * 0.9)); // default 10% institutional discount
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Review & Quote
                      </button>
                    )}

                    {req.approvalStatus === 'approved' && (
                      <div className="flex items-center gap-2">
                        {req.razorpayPaymentLinkUrl ? (
                          <a
                            href={req.razorpayPaymentLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Razorpay Link</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-medium">Link Generating...</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300">
                          {req.paymentStatus || 'LINK_GENERATED'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT AUDIT LEDGER */}
      {activeTab === 'transactions' && (
        <div className="mt-6">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Method & Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono text-slate-300">{tx.transactionId}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{tx.orderId}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-semibold text-white">{tx.paymentMethod}</span>
                      {tx.gatewayReference && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.gatewayReference}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      INR {tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Order Details: {selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">Created: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-slate-400 font-medium">Customer Information</div>
                <div className="font-semibold text-white mt-1">{selectedOrder.customerName}</div>
                <div className="text-slate-300">{selectedOrder.customerEmail}</div>
                <div className="text-slate-300">{selectedOrder.customerPhone}</div>
                {selectedOrder.schoolName && <div className="text-amber-400 mt-1">School: {selectedOrder.schoolName}</div>}
              </div>

              <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                <div className="text-slate-400 font-medium">Delivery Address</div>
                <div className="text-slate-300 mt-1">
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </div>
                <div className="mt-2 text-cyan-400 font-mono">Carrier: {selectedOrder.courierName || 'Delhivery B2B'}</div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Line Items</h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-slate-800/20">
                    <div>
                      <div className="font-semibold text-white">{it.product?.name}</div>
                      <div className="text-slate-500 font-mono">SKU: {it.product?.sku} • Qty: {it.quantity}</div>
                    </div>
                    <div className="font-bold text-white">
                      INR {(it.product?.price * it.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Paid / Approved Amount:</span>
              <span className="text-base font-bold text-cyan-400">
                INR {(selectedOrder.finalAmount || selectedOrder.totalAmount).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-white mb-2">Reject Order {rejectingOrderId}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Please provide the reason for institutional rejection. This reason will be logged and communicated to the customer.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Official purchase order document missing sanction stamp..."
              rows={3}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {statusUpdateOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-white mb-2">Update Delivery Status: {statusUpdateOrderId}</h3>
            
            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">New Consignment Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="qc_assembly">QC & Hardware Assembly Passed</option>
                  <option value="dispatched">Dispatched with Carrier</option>
                  <option value="in_transit">In Transit to Regional Logistics Hub</option>
                  <option value="out_for_delivery">Out for School Delivery</option>
                  <option value="delivered">Delivered to ATL Lab</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Carrier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Consignment Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Scanned at Shamshabad Cargo Terminal"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setStatusUpdateOrderId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE QUOTE REQUEST MODAL */}
      {approvingRequestId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-white mb-2">Approve Bulk Quote: {approvingRequestId}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the approved institutional price for this procurement package.
            </p>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Approved Quoted Amount (INR)</label>
              <input
                type="number"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-semibold"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setApprovingRequestId(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveRequest}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Authorize Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
