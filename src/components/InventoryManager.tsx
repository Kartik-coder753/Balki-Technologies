import React, { useState } from 'react';
import { InventoryItem, ProductCategory } from '../types';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Warehouse, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  FileSpreadsheet, 
  X, 
  Edit, 
  ArrowUpRight,
  Download
} from 'lucide-react';
import { downloadStockAuditCsv } from '../utils/downloadHelpers';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onUpdateStock: (sku: string, deltaStock: number, newMinThreshold?: number, notes?: string) => Promise<void>;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onUpdateStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [thresholdInput, setThresholdInput] = useState<number>(10);
  const [auditNotes, setAuditNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Analytics Metrics
  const totalSkus = inventory.length;
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const totalValuation = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const lowStockCount = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;

  const warehouses = ['all', 'Hyderabad Central Hub', 'Bengaluru Depot', 'Delhi NCR Hub'];

  // Filtered List
  const filteredInventory = inventory.filter(item => {
    if (warehouseFilter !== 'all' && item.warehouse !== warehouseFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item?.name?.toLowerCase() || '').includes(q);
      const matchSku = (item?.sku?.toLowerCase() || '').includes(q);
      if (!matchName && !matchSku) {
        return false;
      }
    }
    return true;
  });

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setThresholdInput(item.minimumThreshold);
    setAdjustAmount(10);
    setAdjustType('add');
    setAuditNotes('');
  };

  const handleSaveStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    const delta = adjustType === 'add' ? Number(adjustAmount) : -Number(adjustAmount);

    try {
      await onUpdateStock(editingItem.sku, delta, Number(thresholdInput), auditNotes);
      setSuccessToast(`Stock updated for SKU: ${editingItem.sku}`);
      setTimeout(() => setSuccessToast(''), 3000);
      setEditingItem(null);
    } catch (err) {
      alert('Failed to update stock');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80"
          alt="Balki Supply Chain & Warehouse Robotics"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-luminosity pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60 pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Warehouse className="w-3.5 h-3.5" />
            <span>Pan-India Supply Chain & Lab Inward/Outward Log</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Balki Technologies Inventory Management System
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time multi-warehouse stock monitoring, automated low-stock reorder thresholds, and component batch allocations for 50,000+ Atal Tinkering Labs across India.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            id="btn-export-stock-audit"
            onClick={() => downloadStockAuditCsv(inventory)}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 backdrop-blur-xs transition-colors shadow-sm cursor-pointer"
            title="Download CSV stock audit spreadsheet"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Stock Audit (CSV)</span>
          </button>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total SKUs Monitored</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalSkus}</span>
            <span className="text-xs text-slate-500 font-medium">Unique Items</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Units in Stock</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalStockUnits.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-600 font-bold">Live Inventory</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Warehouse Valuation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-700">₹{(totalValuation / 100000).toFixed(2)}L</span>
            <span className="text-xs text-slate-500">Asset Value</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Reorder / Critical Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-red-600">{lowStockCount}</span>
            {lowStockCount > 0 ? (
              <span className="text-xs text-red-600 font-bold animate-pulse">Action Required</span>
            ) : (
              <span className="text-xs text-emerald-600 font-bold">All Healthy</span>
            )}
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by SKU or Component Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Warehouse dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Warehouse:</span>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-amber-500"
            >
              {warehouses.map((w, i) => (
                <option key={i} value={w}>{w === 'all' ? 'All Hubs' : w}</option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Stock Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Critical">Critical Shortage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 pl-5">SKU & Item Name</th>
                <th className="p-3.5">Warehouse Location</th>
                <th className="p-3.5 text-center">Current Stock</th>
                <th className="p-3.5 text-center">Min. Threshold</th>
                <th className="p-3.5 text-right">Unit Cost</th>
                <th className="p-3.5 text-right">Selling Price</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center pr-5">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">SKU: {item.sku}</div>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">
                    {item.warehouse}
                  </td>
                  <td className="p-3.5 text-center font-extrabold text-sm text-slate-900">
                    {item.currentStock}
                  </td>
                  <td className="p-3.5 text-center text-slate-500 font-mono">
                    {item.minimumThreshold}
                  </td>
                  <td className="p-3.5 text-right text-slate-600">
                    ₹{item.unitCost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900">
                    ₹{item.sellingPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'In Stock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Low Stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center pr-5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-700 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Adjust Warehouse Stock</h3>
                <p className="text-[11px] text-slate-400">{editingItem.name} ({editingItem.sku})</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  <span className="text-slate-500">Current Stock:</span>
                  <p className="font-extrabold text-base text-slate-900">{editingItem.currentStock} Units</p>
                </div>
                <div>
                  <span className="text-slate-500">Warehouse:</span>
                  <p className="font-medium text-slate-800">{editingItem.warehouse}</p>
                </div>
              </div>

              {/* Adjust Type */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">Movement Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      adjustType === 'add'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Inward Restock (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('remove')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      adjustType === 'remove'
                        ? 'bg-red-50 border-red-500 text-red-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Minus className="w-4 h-4 text-red-600" />
                    <span>Lab Allocation (-)</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Adjustment Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min. Alert Threshold</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={thresholdInput}
                    onChange={(e) => setThresholdInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Audit / PO Reference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Inward batch 2026-B9 received from factory"
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md transition-all"
                >
                  {isUpdating ? 'Recording...' : 'Commit Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
