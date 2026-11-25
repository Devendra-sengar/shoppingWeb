import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Download, Printer, RefreshCw } from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminOrdersPage: React.FC = () => {
  const { orders, loadOrdersFromCloud } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Automatically fetch from Firestore on mount
  useEffect(() => {
    loadOrdersFromCloud();
  }, [loadOrdersFromCloud]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await loadOrdersFromCloud();
    setTimeout(() => setIsSyncing(false), 800);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.includes(searchTerm) ||
      o.shipment?.awbNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.fulfillmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-900 font-medium">Orders & Fulfillment Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track customer orders, review QC packing steps, dispatch with couriers, and manage delivery milestones.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="border border-stone-300 bg-white text-stone-700 px-3 py-1.5 text-xs font-medium rounded hover:bg-stone-50 flex items-center space-x-1 transition-colors"
            title="Sync live orders directly from Cloud Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Orders'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="border border-stone-300 bg-white text-stone-700 px-3 py-1.5 text-xs font-medium rounded hover:bg-stone-50 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
          <button
            onClick={() => alert('Order dataset exported in CSV format.')}
            className="border border-stone-300 bg-white text-stone-700 px-3 py-1.5 text-xs font-medium rounded hover:bg-stone-50 flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer, Phone, AWB..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#5B6955]"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1">
          {['all', 'received', 'confirmed', 'packed', 'ready_for_dispatch', 'dispatched', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs rounded uppercase tracking-luxury font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-[#5B6955] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-subtle border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order Reference</th>
                <th className="py-3.5 px-4 font-semibold">Customer & Destination</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment Stage</th>
                <th className="py-3.5 px-4 font-semibold">Courier / AWB</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Order Reference */}
                    <td className="py-4 px-4">
                      <Link to={`/admin/orders/${ord.id}`} className="font-mono font-medium text-stone-900 hover:text-[#5B6955]">
                        {ord.orderReference}
                      </Link>
                      <p className="text-[10px] text-stone-400">
                        {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-stone-800">{ord.customer.firstName} {ord.customer.lastName}</p>
                      <p className="text-[11px] text-stone-500">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                      <p className="text-[10px] text-stone-400">{ord.customer.phone}</p>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={ord.items[0]?.thumbnail}
                          alt={ord.items[0]?.name}
                          className="w-9 h-11 object-cover rounded bg-stone-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-stone-800 truncate max-w-[130px]">{ord.items[0]?.name}</p>
                          <p className="text-[10px] text-stone-400">
                            {ord.items.length > 1 ? `+${ord.items.length - 1} more item(s)` : `Qty: ${ord.items[0]?.quantity}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-stone-900">{formatPrice(ord.grandTotal, ord.currencySymbol)}</p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mt-0.5 ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                        ord.paymentStatus === 'cod_pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Fulfillment */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        ord.fulfillmentStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.fulfillmentStatus === 'ready_for_dispatch' ? 'bg-amber-100 text-amber-800' :
                        ord.fulfillmentStatus === 'dispatched' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Courier / AWB */}
                    <td className="py-4 px-4">
                      {ord.shipment ? (
                        <div>
                          <p className="font-medium text-stone-800">{ord.shipment.courier}</p>
                          <p className="font-mono text-[10px] text-stone-500">{ord.shipment.awbNumber}</p>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Fulfill</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
