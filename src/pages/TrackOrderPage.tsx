import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Truck,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getOrderByReference } = useAdminStore();

  const refParam = searchParams.get('ref') || '';

  const [inputRef, setInputRef] = useState(refParam);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (refParam) {
      const found = getOrderByReference(refParam);
      if (found) {
        setActiveOrder(found);
        setErrorMsg('');
      } else {
        setErrorMsg(`We could not locate an order with reference "${refParam}". Please check your order confirmation.`);
      }
    }
  }, [refParam, getOrderByReference]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;

    const found = getOrderByReference(inputRef.trim());
    if (found) {
      setActiveOrder(found);
      setErrorMsg('');
    } else {
      setActiveOrder(null);
      setErrorMsg(`No active order found with reference "${inputRef}". Please check your receipt or contact concierge.`);
    }
  };

  // Progression calculation
  const stages = [
    { key: 'received', label: 'Order Placed' },
    { key: 'confirmed', label: 'Tailoring QC' },
    { key: 'packed', label: 'Packed' },
    { key: 'ready_for_dispatch', label: 'Courier Manifested' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStageIndex = (status: string) => {
    const idx = stages.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentIdx = activeOrder ? getStageIndex(activeOrder.fulfillmentStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <p className="text-xs uppercase tracking-luxury text-sand-dark font-medium">Boutique Delivery Tracking</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">Track Your ÉLAN Order</h1>
        <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto leading-relaxed">
          Enter your order reference code from your receipt or WhatsApp dispatch confirmation to view real-time delivery milestones.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto flex items-center bg-surface border border-border shadow-soft rounded p-1.5">
        <input
          type="text"
          value={inputRef}
          onChange={(e) => setInputRef(e.target.value)}
          placeholder="e.g. ELAN-FYA16D-9997"
          className="flex-1 px-4 py-2 text-xs uppercase tracking-subtle bg-transparent focus:outline-none text-primary"
        />
        <button
          type="submit"
          className="bg-primary text-surface px-5 py-2 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors rounded"
        >
          Track Order
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
          {errorMsg}
        </div>
      )}

      {/* Active Order Tracking Result */}
      {activeOrder && (
        <div className="bg-surface border border-border shadow-lift rounded-lg overflow-hidden animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="p-6 bg-[#F8F7F3] border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-secondary block">Order Reference</span>
              <p className="font-mono text-xl font-bold text-primary">{activeOrder.orderReference}</p>
              <p className="text-xs text-secondary mt-0.5">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-luxury text-secondary block">Current Status</span>
              <span className="inline-block px-3 py-1 bg-[#5B6955] text-white text-xs font-semibold uppercase tracking-wider rounded-full mt-1">
                {activeOrder.fulfillmentStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Progress Bar / Milestones */}
          <div className="p-6 sm:p-8 border-b border-border">
            <h3 className="text-xs uppercase tracking-luxury font-semibold text-primary mb-6">
              Milestone Progress
            </h3>

            {/* Stepper */}
            <div className="relative">
              <div className="hidden sm:flex justify-between items-center relative before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:bg-border before:z-0">
                {stages.map((stage, idx) => {
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={stage.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isDone ? 'bg-[#5B6955] text-white ring-4 ring-[#F8F7F3]' : 'bg-border text-secondary'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] uppercase tracking-luxury mt-2 text-center max-w-[80px] ${
                        isDone ? 'font-semibold text-primary' : 'text-secondary/70'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Stepper View */}
              <div className="sm:hidden space-y-3">
                {stages.map((stage, idx) => {
                  const isDone = idx <= currentIdx;
                  return (
                    <div key={stage.key} className="flex items-center space-x-3 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone ? 'bg-[#5B6955] text-white' : 'bg-border text-secondary'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={isDone ? 'font-semibold text-primary' : 'text-secondary'}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier Tracking Box (if dispatched) */}
          {activeOrder.shipment && (
            <div className="p-6 bg-amber-50/40 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">{activeOrder.shipment.courier} Air Express</p>
                  <p className="text-xs text-secondary font-mono">Consignment AWB: {activeOrder.shipment.awbNumber}</p>
                </div>
              </div>
              <a
                href={activeOrder.shipment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#5B6955] hover:underline font-semibold"
              >
                <span>Live Courier Tracking Portal</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          )}

          {/* Items & Delivery Summary */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Left: Garments */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-primary">Ordered Garments</h4>
              <div className="space-y-3">
                {activeOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 bg-background rounded">
                    <img src={item.thumbnail} alt={item.name} className="w-12 h-14 object-cover rounded bg-border" />
                    <div>
                      <p className="font-medium text-primary">{item.name}</p>
                      <p className="text-secondary text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Destination & Concierge */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-luxury font-semibold text-primary">Delivery Destination</h4>
              <p className="text-secondary leading-relaxed">
                {activeOrder.customer.firstName} {activeOrder.customer.lastName}<br />
                {activeOrder.shippingAddress.street}<br />
                {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.postalCode}<br />
                {activeOrder.shippingAddress.country}
              </p>

              <div className="pt-2">
                <a
                  href={`https://wa.me/919131494302?text=Hello%20ÉLAN%20Concierge,%20I%20am%20inquiring%20about%20my%20order%20${activeOrder.orderReference}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded text-xs font-medium hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
