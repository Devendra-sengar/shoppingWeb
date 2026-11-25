import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import type { OrderReceipt } from '../types';
import { formatPrice, getPriceAmount } from '../utils/formatCurrency';

const WHATSAPP_TARGET_NUMBER = '919131494302';

export const OrderConfirmationPage: React.FC = () => {
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('elan-latest-receipt');
    if (stored) {
      try {
        setReceipt(JSON.parse(stored));
      } catch {
        setReceipt(null);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Generate formatted WhatsApp message
  const generateWhatsAppMessage = (r: OrderReceipt): string => {
    const itemsText = r.items
      .map((item, index) => {
        const itemPrice = getPriceAmount(item.prices, r.currencySymbol);
        const options = item.userSelectedAttributes
          .map((a) => `${a.attributeId}: ${a.attributeValue}`)
          .join(', ');
        return `${index + 1}. *${item.name}*\n   • Qty: ${item.quantity}\n   • ${options}\n   • Price: ${r.currencySymbol}${itemPrice * item.quantity}`;
      })
      .join('\n\n');

    return (
      `*🛍️ NEW ORDER CONFIRMATION — ÉLAN ATELIER*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Order Reference:* ${r.orderId}\n` +
      `*Date:* ${r.orderDate}\n` +
      `*Payment Method:* ${r.paymentMethod}\n` +
      (r.paymentDetails ? `*Payment Details:* ${r.paymentDetails}\n` : '') +
      `\n` +
      `👤 *CUSTOMER DETAILS:*\n` +
      `• Name: ${r.customer.firstName} ${r.customer.lastName}\n` +
      `• Email: ${r.customer.email}\n` +
      `• Mobile: ${r.customer.phone}\n` +
      `\n` +
      `📍 *DELIVERY DESTINATION:*\n` +
      `${r.shippingAddress.street}, ${r.shippingAddress.city}, ${r.shippingAddress.state} - ${r.shippingAddress.postalCode}, ${r.shippingAddress.country}\n` +
      `\n` +
      `👗 *ORDERED GARMENTS (${r.items.length}):*\n` +
      `${itemsText}\n` +
      `\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *FINANCIAL SUMMARY:*\n` +
      `• Subtotal: ${r.currencySymbol}${r.subtotal.toFixed(2)}\n` +
      `• VAT / Taxes (21%): ${r.currencySymbol}${r.taxes.toFixed(2)}\n` +
      `• Shipping: Complimentary Express\n` +
      `• *GRAND TOTAL: ${r.currencySymbol}${r.total.toFixed(2)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Thank you for choosing ÉLAN. Your order is registered in our atelier system._`
    );
  };

  const whatsAppUrl = receipt
    ? `https://wa.me/${WHATSAPP_TARGET_NUMBER}?text=${encodeURIComponent(generateWhatsAppMessage(receipt))}`
    : '#';

  if (!receipt) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-border mx-auto stroke-1" />
        <h1 className="font-serif text-3xl text-primary font-normal">No Active Order Found</h1>
        <p className="text-xs text-secondary leading-relaxed">
          You do not have a recent order receipt in this session. If you have already placed an order, a confirmation summary has been displayed.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-surface px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Printable Receipt Card */}
      <div className="bg-surface border border-border p-6 sm:p-12 shadow-subtle space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-8 border-b border-border">
          <div className="w-12 h-12 bg-olive/10 text-olive rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-luxury text-sand-dark font-medium">Order Confirmed</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
            Thank You, {receipt.customer.firstName}
          </h1>
          <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
            Your order has been registered in our atelier system and dispatched directly to our WhatsApp concierge (+91 9131494302).
          </p>
        </div>

        {/* Status notice */}
        <div className="p-3.5 bg-olive/10 border border-olive/30 text-xs text-olive-dark flex items-center justify-between rounded-sm print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />
            <span>Order placed & transmitted to WhatsApp concierge (+91 9131494302)</span>
          </div>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:text-sand-dark underline flex items-center space-x-1"
          >
            <span>View in WhatsApp</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Order Meta details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-background border border-border p-4 text-xs">
          <div>
            <span className="uppercase tracking-luxury text-secondary text-[10px] block">Order Ref</span>
            <span className="font-semibold text-primary">{receipt.orderId}</span>
          </div>
          <div>
            <span className="uppercase tracking-luxury text-secondary text-[10px] block">Date</span>
            <span className="font-medium text-primary">{receipt.orderDate}</span>
          </div>
          <div>
            <span className="uppercase tracking-luxury text-secondary text-[10px] block">Payment</span>
            <span className="font-medium text-olive-dark truncate block">{receipt.paymentMethod}</span>
          </div>
          <div>
            <span className="uppercase tracking-luxury text-secondary text-[10px] block">WhatsApp</span>
            <span className="font-semibold text-primary">+91 9131494302</span>
          </div>
        </div>

        {/* Delivery Destination */}
        <div className="text-xs text-secondary space-y-1">
          <span className="uppercase tracking-luxury text-secondary text-[10px] font-semibold block">Delivery Destination:</span>
          <p className="text-primary font-medium">{receipt.customer.firstName} {receipt.customer.lastName}</p>
          <p>{receipt.shippingAddress.street}</p>
          <p>{receipt.shippingAddress.city}, {receipt.shippingAddress.state} - {receipt.shippingAddress.postalCode}</p>
          <p>{receipt.shippingAddress.country}</p>
          <p className="pt-1 text-secondary/80">Customer Phone: <strong>{receipt.customer.phone}</strong> • Email: {receipt.customer.email}</p>
        </div>

        {/* Itemized Garments */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-xs uppercase tracking-luxury font-semibold text-primary">Ordered Garments</h2>

          <div className="divide-y divide-border/60">
            {receipt.items.map((item) => {
              const unitPrice = getPriceAmount(item.prices, receipt.currencySymbol);
              return (
                <div key={item.uniqueId} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.gallery[0]} alt="" className="w-12 h-16 object-cover bg-background" />
                    <div>
                      <p className="font-medium text-primary">{item.name}</p>
                      <p className="text-secondary text-[11px]">Qty: {item.quantity}</p>
                      <p className="text-[10px] text-secondary/70">
                        {item.userSelectedAttributes.map((a) => `${a.attributeId}: ${a.attributeValue}`).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-primary">
                    {formatPrice(unitPrice * item.quantity, receipt.currencySymbol)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(receipt.subtotal, receipt.currencySymbol)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Estimated VAT (21%)</span>
            <span>{formatPrice(receipt.taxes, receipt.currencySymbol)}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Shipping</span>
            <span className="text-olive-light">Complimentary Express</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between text-base font-serif font-semibold text-primary">
            <span>Total Simulated Paid</span>
            <span>{formatPrice(receipt.total, receipt.currencySymbol)}</span>
          </div>
        </div>

        {/* Security & Verification Note */}
        <div className="p-3 bg-background border border-border text-[11px] text-secondary leading-normal flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-sand-dark flex-shrink-0 mt-0.5" />
          <span>
            Order captured in demonstration client store. The receipt details above have been transmitted directly to WhatsApp concierge <strong>+91 9131494302</strong> for order coordination.
          </span>
        </div>

        {/* Actions (Hidden during print) */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-primary text-xs uppercase tracking-luxury font-medium hover:border-primary transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            <span>Print Official Receipt</span>
          </button>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-surface text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>

    </div>
  );
};
