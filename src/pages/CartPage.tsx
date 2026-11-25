import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useCurrencyStore } from '../stores/useCurrencyStore';
import { formatPrice, getPriceAmount } from '../utils/formatCurrency';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getSubtotal, getTaxes, getGrandTotal, clearCart } = useCartStore();
  const { selectedCurrency } = useCurrencyStore();

  const subtotal = getSubtotal(selectedCurrency.symbol);
  const taxes = getTaxes(selectedCurrency.symbol);
  const grandTotal = getGrandTotal(selectedCurrency.symbol);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-border mx-auto stroke-1" />
        <h1 className="font-serif text-3xl text-primary font-normal">Your Bag is Empty</h1>
        <p className="text-xs text-secondary leading-relaxed">
          Looks like you haven't added any pieces to your shopping bag yet. Explore our latest arrivals to begin your wardrobe curation.
        </p>
        <Link
          to="/collections"
          className="inline-flex items-center bg-primary text-surface px-6 py-3 text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>Explore Collections</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-store mx-auto px-4 sm:px-6 lg:px-12 py-10">
      
      {/* Title */}
      <div className="mb-10 pb-6 border-b border-border flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">Shopping Bag</h1>
          <p className="text-xs uppercase tracking-luxury text-secondary mt-1">Review your selections</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-secondary hover:text-error transition-colors underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => {
            const unitPrice = getPriceAmount(item.prices, selectedCurrency.symbol);
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.uniqueId}
                className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-surface border border-border"
              >
                {/* Image */}
                <div className="w-24 sm:w-28 aspect-[3/4] bg-background overflow-hidden flex-shrink-0">
                  <img
                    src={item.gallery[0]}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-luxury text-secondary">
                        {item.category}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="block font-serif text-base sm:text-lg text-primary font-medium hover:text-sand-dark transition-colors mt-0.5"
                      >
                        {item.name}
                      </Link>

                      {/* Selected Attributes */}
                      <div className="flex flex-wrap gap-2 text-xs text-secondary mt-2">
                        {item.userSelectedAttributes.map((attr) => (
                          <span
                            key={attr.attributeId}
                            className="px-2 py-0.5 bg-background border border-border/80"
                          >
                            <span className="text-secondary/70">{attr.attributeId}:</span>{' '}
                            <span className="font-medium text-primary">{attr.attributeValue}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="font-serif text-base font-medium text-primary">
                      {formatPrice(itemTotal, selectedCurrency.symbol)}
                    </p>
                  </div>

                  {/* Quantity & Unit Price */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-border bg-background">
                        <button
                          onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                          className="p-1.5 hover:bg-surface transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 text-secondary" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                          className="p-1.5 hover:bg-surface transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 text-secondary" />
                        </button>
                      </div>
                      <span className="text-xs text-secondary">
                        ({formatPrice(unitPrice, selectedCurrency.symbol)} each)
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="text-xs text-secondary/70 hover:text-error flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/collections"
              className="inline-flex items-center text-xs uppercase tracking-luxury text-secondary hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Continue Browsing Garments</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-surface border border-border p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl text-primary font-medium pb-4 border-b border-border">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-primary">
                  {formatPrice(subtotal, selectedCurrency.symbol)}
                </span>
              </div>

              <div className="flex justify-between text-secondary">
                <span>Estimated VAT (21% Demo Tax)</span>
                <span className="font-medium text-primary">
                  {formatPrice(taxes, selectedCurrency.symbol)}
                </span>
              </div>

              <div className="flex justify-between text-secondary">
                <span>Standard Dispatch</span>
                <span className="text-olive-light font-medium">Complimentary</span>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-baseline">
                <span className="font-serif text-lg text-primary font-medium">Total</span>
                <span className="font-serif text-2xl font-semibold text-primary">
                  {formatPrice(grandTotal, selectedCurrency.symbol)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-secondary leading-normal bg-background p-3 border border-border">
              Notice: This is an architectural demonstration checkout. All figures reflect demo currency parameters.
            </p>

            <Link
              to="/checkout"
              className="w-full py-4 bg-primary text-surface text-xs uppercase tracking-luxury font-medium hover:bg-sand-dark transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
