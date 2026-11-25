import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Clock,
  Printer,
  MessageCircle,
  User,
} from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useAdminAuthStore } from '../../stores/useAdminAuthStore';
import { formatPrice } from '../../utils/formatCurrency';
import type { FulfillmentStatus } from '../../types/admin';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus, assignShipment, cancelOrder } = useAdminStore();
  const { currentUser } = useAdminAuthStore();

  const order = getOrderById(id || '');

  // Form states for shipment assignment
  const [courier, setCourier] = useState<'Delhivery' | 'Blue Dart' | 'DTDC' | 'India Post' | 'Shiprocket' | 'Custom Express'>('Delhivery');
  const [awbNumber, setAwbNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showShipmentModal, setShowShipmentModal] = useState(false);

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-serif text-stone-800">Order Record Not Found</h2>
        <Link to="/admin/orders" className="text-xs text-[#5B6955] underline font-medium">
          ← Return to Orders List
        </Link>
      </div>
    );
  }

  const handleNextStep = (nextStatus: FulfillmentStatus, defaultCustomerNote: string) => {
    if (!currentUser) return;
    updateOrderStatus(
      order.id,
      nextStatus,
      { id: currentUser.id, name: currentUser.name, role: currentUser.role },
      { internal: internalNote || undefined, customer: defaultCustomerNote }
    );
    setInternalNote('');
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awbNumber) return;

    assignShipment(order.id, {
      courier,
      awbNumber,
      trackingUrl: trackingUrl || `https://track.courier.com/${awbNumber}`,
      dispatchDate: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'manifested',
      notes: 'QC passed and handed to courier partner.',
    });
    setShowShipmentModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/orders"
            className="p-1.5 bg-white border border-stone-200 rounded text-stone-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl text-stone-900 font-medium">
                {order.orderReference}
              </h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                order.fulfillmentStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.fulfillmentStatus === 'ready_for_dispatch' ? 'bg-amber-100 text-amber-800' :
                order.fulfillmentStatus === 'dispatched' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.fulfillmentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()} • Secure Guest Token: <span className="font-mono">{order.trackingToken}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="border border-stone-300 bg-white text-stone-700 px-3 py-1.5 text-xs font-medium rounded hover:bg-stone-50 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice & Slip</span>
          </button>
          <a
            href={`/track-order?ref=${order.orderReference}&token=${order.trackingToken}`}
            target="_blank"
            rel="noreferrer"
            className="bg-stone-800 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-black transition-colors"
          >
            View Customer Tracking →
          </a>
        </div>
      </div>

      {/* Main Grid: Order Details & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details & Lifecycle Actions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Fulfillment Action Bar */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-700">
              Fulfillment Stage Action:
            </h3>

            <div className="flex flex-wrap gap-2">
              {order.fulfillmentStatus === 'received' && (
                <button
                  onClick={() => handleNextStep('confirmed', 'Order confirmed by atelier staff.')}
                  className="bg-[#5B6955] text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-[#4a5645] transition-colors"
                >
                  ✓ Confirm Order & Send to Tailoring
                </button>
              )}

              {order.fulfillmentStatus === 'confirmed' && (
                <button
                  onClick={() => handleNextStep('processing', 'Tailoring inspection and QC underway.')}
                  className="bg-[#5B6955] text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-[#4a5645] transition-colors"
                >
                  Start Processing & QC
                </button>
              )}

              {order.fulfillmentStatus === 'processing' && (
                <button
                  onClick={() => handleNextStep('packed', 'Garment packed in ÉLAN signature protective casing.')}
                  className="bg-[#5B6955] text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-[#4a5645] transition-colors"
                >
                  Mark as Packed & Sealed
                </button>
              )}

              {order.fulfillmentStatus === 'packed' && !order.shipment && (
                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="bg-amber-600 text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-amber-700 transition-colors"
                >
                  + Generate Courier Shipment / AWB
                </button>
              )}

              {order.fulfillmentStatus === 'ready_for_dispatch' && (
                <button
                  onClick={() => handleNextStep('dispatched', 'Package handed over to courier driver.')}
                  className="bg-purple-600 text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-purple-700 transition-colors"
                >
                  Mark Dispatched to Hub
                </button>
              )}

              {order.fulfillmentStatus === 'dispatched' && (
                <button
                  onClick={() => handleNextStep('in_transit', 'Air express transit initiated.')}
                  className="bg-blue-600 text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Update to In Transit
                </button>
              )}

              {order.fulfillmentStatus === 'in_transit' && (
                <button
                  onClick={() => handleNextStep('out_for_delivery', 'Courier van assigned for final delivery.')}
                  className="bg-emerald-600 text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-emerald-700 transition-colors"
                >
                  Mark Out for Delivery
                </button>
              )}

              {order.fulfillmentStatus === 'out_for_delivery' && (
                <button
                  onClick={() => handleNextStep('delivered', 'Delivered safely to recipient.')}
                  className="bg-emerald-700 text-white px-4 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-emerald-800 transition-colors"
                >
                  Confirm Delivery Completion
                </button>
              )}

              {order.fulfillmentStatus !== 'delivered' && order.fulfillmentStatus !== 'cancelled' && (
                <button
                  onClick={() => {
                    const reason = prompt('Please enter cancellation reason:');
                    if (reason && currentUser) {
                      cancelOrder(order.id, reason, { id: currentUser.id, name: currentUser.name, role: currentUser.role });
                    }
                  }}
                  className="border border-red-300 text-red-600 px-3 py-2 text-xs uppercase tracking-luxury font-medium rounded hover:bg-red-50 transition-colors ml-auto"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Internal Staff Note input */}
            <div className="pt-2">
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Optional internal note for next action..."
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:border-[#5B6955]"
              />
            </div>
          </div>

          {/* Ordered Garments Table */}
          <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-700">
                Ordered Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded bg-stone-100"
                    />
                    <div>
                      <h4 className="font-serif text-sm text-stone-900 font-medium">{item.name}</h4>
                      <p className="text-[11px] font-mono text-stone-400">SKU: {item.sku || 'N/A'}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.selectedAttributes.map((attr) => (
                          <span key={attr.attributeId} className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                            {attr.attributeId}: {attr.attributeValue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    <p className="font-medium text-stone-900 text-sm">{formatPrice(item.total, order.currencySymbol)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-stone-50/50 border-t border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal, order.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>VAT / GST Taxes</span>
                <span>{formatPrice(order.taxes, order.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'Complimentary' : formatPrice(order.shippingCharge, order.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-semibold text-sm pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span>{formatPrice(order.grandTotal, order.currencySymbol)}</span>
              </div>
            </div>
          </div>

          {/* Courier & Shipment Details Card */}
          {order.shipment ? (
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-2 text-stone-800">
                  <Truck className="w-4 h-4 text-[#5B6955]" />
                  <h3 className="text-xs uppercase tracking-luxury font-semibold">Courier & Dispatch Details</h3>
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded capitalize">
                  {order.shipment.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-stone-400">Courier Partner</p>
                  <p className="font-medium text-stone-800">{order.shipment.courier}</p>
                </div>
                <div>
                  <p className="text-stone-400">AWB Number</p>
                  <p className="font-mono font-medium text-stone-800">{order.shipment.awbNumber}</p>
                </div>
                <div>
                  <p className="text-stone-400">Dispatched Date</p>
                  <p className="font-medium text-stone-800">
                    {order.shipment.dispatchDate ? new Date(order.shipment.dispatchDate).toLocaleDateString() : 'Pending handover'}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400">Live Tracking</p>
                  <a
                    href={order.shipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5B6955] hover:underline font-medium"
                  >
                    Open Tracking ↗
                  </a>
                </div>
              </div>
            </div>
          ) : null}

        </div>

        {/* Right Col: Customer Info & Live Event Timeline */}
        <div className="space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-700 flex items-center space-x-2">
              <User className="w-4 h-4 text-stone-400" />
              <span>Customer & Destination</span>
            </h3>

            <div className="text-xs space-y-2 border-b border-stone-100 pb-3">
              <p className="font-medium text-stone-900">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-stone-500">{order.customer.email}</p>
              <p className="text-stone-500">{order.customer.phone}</p>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-stone-400 font-medium">Delivery Address</p>
              <p className="text-stone-800 leading-relaxed">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>

            {/* Direct WhatsApp Concierge Link */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=Hello%20${order.customer.firstName},%20this%20is%20ÉLAN%20Atelier%20regarding%20your%20order%20${order.orderReference}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 text-white px-3 py-2 text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Customer on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-luxury font-semibold text-stone-700 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Order Activity Timeline</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-stone-200">
              {order.events.map((evt) => (
                <div key={evt.id} className="relative flex items-start space-x-3 text-xs pl-1">
                  <div className="w-5 h-5 rounded-full bg-[#5B6955] text-white flex items-center justify-center shrink-0 z-10 text-[10px]">
                    ✓
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-800">{evt.customerNote || evt.eventType.replace(/_/g, ' ')}</p>
                    {evt.internalNote && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                        Staff Note: {evt.internalNote}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-400 mt-1">
                      {new Date(evt.timestamp).toLocaleString()} • {evt.actorName} ({evt.actorRole})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Shipment Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium">Assign Courier & Generate Dispatch AWB</h3>
            <form onSubmit={handleCreateShipment} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Select Courier Partner</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded bg-stone-50"
                >
                  <option value="Delhivery">Delhivery Surface / Air</option>
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="DTDC">DTDC Premier</option>
                  <option value="India Post">India Post Speed Post</option>
                  <option value="Shiprocket">Shiprocket Automated</option>
                  <option value="Custom Express">Custom Atelier Driver</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">AWB / Consignment Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="e.g. DEL-IND-99382104"
                  className="w-full p-2 border border-stone-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Courier Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowShipmentModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5B6955] text-white font-medium rounded hover:bg-[#4a5645]"
                >
                  Confirm & Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
