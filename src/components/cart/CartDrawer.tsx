import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useCartStore } from '../../stores/useCartStore';
import { useCurrencyStore } from '../../stores/useCurrencyStore';
import { formatPrice, getPriceAmount } from '../../utils/formatCurrency';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { cart, removeFromCart, updateQuantity, getSubtotal, getTotalItemsCount } = useCartStore();
  const { selectedCurrency } = useCurrencyStore();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal(selectedCurrency.symbol);
  const totalCount = getTotalItemsCount();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-surface shadow-drawer flex flex-col z-50 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-lg tracking-luxury font-medium">Shopping Bag</h2>
            <span className="text-xs text-secondary">({totalCount})</span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-secondary hover:text-primary transition-colors"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-border mb-4 stroke-1" />
              <p className="font-serif text-lg text-primary mb-1">Your bag is empty</p>
              <p className="text-xs text-secondary max-w-xs mb-6">
                Explore our curated collection to discover timeless silhouettes and everyday elegance.
              </p>
              <button
                onClick={closeCart}
                className="inline-block bg-primary text-surface text-xs uppercase tracking-luxury px-6 py-3 hover:bg-sand-dark transition-colors"
              >
                Shop Collections
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = getPriceAmount(item.prices, selectedCurrency.symbol);
              return (
                <div key={item.uniqueId} className="flex space-x-4 border-b border-border/60 pb-6">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-background overflow-hidden flex-shrink-0">
                    <img
                      src={item.gallery[0]}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-primary hover:text-sand-dark transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.uniqueId)}
                          className="text-secondary/60 hover:text-error ml-2 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Attributes */}
                      <div className="text-xs text-secondary mt-1 space-x-2">
                        {item.userSelectedAttributes.map((attr) => (
                          <span key={attr.attributeId} className="inline-block">
                            <span className="text-secondary/70">{attr.attributeId}:</span>{' '}
                            <span className="font-medium text-primary">{attr.attributeValue}</span>
                          </span>
                        ))}
                      </div>

                      <p className="text-xs font-medium text-primary mt-1">
                        {formatPrice(itemPrice, selectedCurrency.symbol)}
                      </p>
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                          className="p-1 hover:bg-background transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-secondary" />
                        </button>
                        <span className="px-2 text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                          className="p-1 hover:bg-background transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-secondary" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-background/50 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-semibold text-primary text-base">
                {formatPrice(subtotal, selectedCurrency.symbol)}
              </span>
            </div>
            <p className="text-[11px] text-secondary">
              Taxes (21% demo VAT) and shipping calculated during checkout.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="block text-center border border-primary text-primary py-3 text-xs uppercase tracking-luxury hover:bg-primary hover:text-surface transition-colors"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block text-center bg-primary text-surface py-3 text-xs uppercase tracking-luxury hover:bg-sand-dark transition-colors flex items-center justify-center space-x-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
