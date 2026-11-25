import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useCartStore } from '../../stores/useCartStore';
import { useCurrencyStore } from '../../stores/useCurrencyStore';
import type { SelectedAttribute } from '../../types';
import { formatPrice, getPriceAmount } from '../../utils/formatCurrency';

export const QuickShopModal: React.FC = () => {
  const { quickShopProduct, closeQuickShop, showToast, openCart } = useUIStore();
  const { addToCart } = useCartStore();
  const { selectedCurrency } = useCurrencyStore();

  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset selected attributes whenever product changes
  useEffect(() => {
    setSelectedAttributes([]);
    setQuantity(1);
  }, [quickShopProduct]);

  if (!quickShopProduct) return null;

  const price = getPriceAmount(quickShopProduct.prices, selectedCurrency.symbol);
  const allAttributesSelected =
    quickShopProduct.attributes.length === 0 ||
    quickShopProduct.attributes.every((attr) =>
      selectedAttributes.some((s) => s.attributeId === attr.id)
    );

  const handleSelectAttribute = (attributeId: string, attributeValue: string) => {
    setSelectedAttributes((prev) => {
      const filtered = prev.filter((a) => a.attributeId !== attributeId);
      return [...filtered, { attributeId, attributeValue }];
    });
  };

  const handleAddToCart = () => {
    if (!allAttributesSelected) return;

    addToCart(quickShopProduct, selectedAttributes, quantity);
    closeQuickShop();
    showToast(`Added ${quickShopProduct.name} to your shopping bag.`);
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={closeQuickShop}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-surface shadow-lift p-6 sm:p-8 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={closeQuickShop}
            className="absolute top-4 right-4 p-1.5 text-secondary hover:text-primary transition-colors"
            aria-label="Close quick shop modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="w-full sm:w-1/2 aspect-[3/4] bg-background overflow-hidden">
              <img
                src={quickShopProduct.gallery[0]}
                alt={quickShopProduct.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Content & Options */}
            <div className="w-full sm:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-secondary font-medium">
                  {quickShopProduct.category}
                </span>
                <h3 className="font-serif text-lg text-primary font-medium mt-1">
                  {quickShopProduct.name}
                </h3>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(price, selectedCurrency.symbol)}
                </p>
              </div>

              {/* Dynamic Attributes */}
              <div className="space-y-3.5 my-2">
                {quickShopProduct.attributes.map((attr) => {
                  const selectedVal = selectedAttributes.find((s) => s.attributeId === attr.id)?.attributeValue;
                  const isColor = attr.id.toLowerCase() === 'color';

                  return (
                    <div key={attr.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-secondary">{attr.name}:</span>
                        <span className="font-medium text-primary">{selectedVal || 'Select'}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {attr.items.map((item) => {
                          const isSelected = selectedVal === item.value;

                          if (isColor) {
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelectAttribute(attr.id, item.value)}
                                className={`w-6 h-6 rounded-full border transition-all relative ${
                                  isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'border-border'
                                }`}
                                style={{ backgroundColor: item.value }}
                                title={item.id}
                              >
                                {isSelected && (
                                  <Check className={`w-3 h-3 absolute inset-0 m-auto ${
                                    item.value === '#FFFFFF' || item.value.toLowerCase() === 'white' ? 'text-primary' : 'text-surface'
                                  }`} />
                                )}
                              </button>
                            );
                          }

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectAttribute(attr.id, item.value)}
                              className={`px-3 py-1 text-xs border uppercase transition-colors ${
                                isSelected
                                  ? 'bg-primary text-surface border-primary'
                                  : 'bg-surface text-primary border-border hover:border-primary'
                              }`}
                            >
                              {item.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!allAttributesSelected || quickShopProduct.inStock === false}
                  className={`w-full py-3 text-xs uppercase tracking-luxury font-medium transition-colors ${
                    !allAttributesSelected
                      ? 'bg-border text-secondary cursor-not-allowed'
                      : 'bg-primary text-surface hover:bg-sand-dark'
                  }`}
                >
                  {!allAttributesSelected ? 'Select Options' : 'Add to Bag'}
                </button>

                <Link
                  to={`/product/${quickShopProduct.id}`}
                  onClick={closeQuickShop}
                  className="block text-center text-xs text-secondary hover:text-primary underline transition-colors pt-1"
                >
                  View Full Product Details
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
