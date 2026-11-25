import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Truck,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';
import { formatPrice } from '../../utils/formatCurrency';

export const AdminDashboardPage: React.FC = () => {
  const { orders, inventory } = useAdminStore();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus !== 'failed' ? o.grandTotal : 0), 0);
  const totalOrders = orders.length;
  const pendingDispatch = orders.filter((o) => o.fulfillmentStatus === 'ready_for_dispatch').length;
  const inTransit = orders.filter((o) => o.fulfillmentStatus === 'dispatched' || o.fulfillmentStatus === 'in_transit').length;
  const delivered = orders.filter((o) => o.fulfillmentStatus === 'delivered').length;
  const lowStockItems = inventory.filter((i) => i.availableStock <= i.lowStockThreshold);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium">Atelier Command Center</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time overview of active collections, fulfillment queues, and boutique dispatch.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products/new"
            className="bg-[#5B6955] text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium hover:bg-[#4a5645] transition-colors rounded"
          >
            + Add New Product
          </Link>
          <Link
            to="/admin/orders"
            className="border border-stone-300 bg-white text-stone-700 px-4 py-2 text-xs uppercase tracking-luxury font-medium hover:bg-stone-50 transition-colors rounded"
          >
            Fulfillment Queue ({pendingDispatch})
          </Link>
        </div>
      </div>

      {/* Top 4 Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Sales */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs uppercase tracking-luxury font-medium">Gross Sales (INR)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {formatPrice(totalRevenue, '₹')}
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs uppercase tracking-luxury font-medium">Total Orders</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {totalOrders}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            <span>{delivered} fulfilled successfully</span>
          </div>
        </div>

        {/* Ready for Dispatch */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs uppercase tracking-luxury font-medium">Awaiting Dispatch</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {pendingDispatch}
          </div>
          <div className="text-[11px] text-amber-700 mt-2 font-medium">
            <span>Requires courier handover</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs uppercase tracking-luxury font-medium">Active Transit</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-900">
            {inTransit}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            <span>Live courier tracking active</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-stone-800 text-sm">Recent Atelier Orders</h2>
              <p className="text-xs text-stone-500">Live order stream and fulfillment statuses</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-[#5B6955] hover:underline font-medium">
              View All Orders →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-subtle border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-stone-900">
                      {ord.orderReference}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-800">{ord.customer.firstName} {ord.customer.lastName}</p>
                      <p className="text-[11px] text-stone-400">{ord.customer.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {ord.items.length} garment{ord.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900">
                      {formatPrice(ord.grandTotal, ord.currencySymbol)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                        ord.fulfillmentStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        ord.fulfillmentStatus === 'ready_for_dispatch' ? 'bg-amber-50 text-amber-700' :
                        ord.fulfillmentStatus === 'dispatched' ? 'bg-purple-50 text-purple-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {ord.fulfillmentStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="text-[#5B6955] hover:text-[#455240] font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Inventory Alerts */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="font-semibold text-stone-800 text-sm">Low Stock Alerts</h2>
            </div>
            <Link to="/admin/inventory" className="text-xs text-[#5B6955] hover:underline font-medium">
              Manage Stock
            </Link>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                All boutique inventory levels are adequate.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium text-stone-800 truncate">{item.productName}</p>
                    <p className="text-[10px] font-mono text-stone-400">{item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-700">{item.availableStock} in stock</span>
                    <p className="text-[10px] text-stone-400">threshold: {item.lowStockThreshold}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
