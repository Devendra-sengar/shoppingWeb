import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, SelectedAttribute } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { getPriceAmount } from '../utils/formatCurrency';

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product, attributes: SelectedAttribute[], quantity?: number) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: (currencySymbol: string) => number;
  getTaxes: (currencySymbol: string) => number;
  getGrandTotal: (currencySymbol: string) => number;
  getTotalItemsCount: () => number;
}

// Generate canonical unique ID with alphabetically sorted attribute keys
function generateUniqueCartId(productId: string, attributes: SelectedAttribute[]): string {
  const sorted = [...attributes].sort((a, b) => a.attributeId.localeCompare(b.attributeId));
  const attrKey = sorted.map((a) => `${a.attributeId}:${a.attributeValue}`).join('-');
  return `${productId}-${attrKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, attributes, quantity = 1) => {
        const uniqueId = generateUniqueCartId(product.id, attributes);
        const existingIndex = get().cart.findIndex((item) => item.uniqueId === uniqueId);

        if (existingIndex > -1) {
          const updated = [...get().cart];
          updated[existingIndex].quantity += quantity;
          set({ cart: updated });
        } else {
          const newItem: CartItem = {
            ...product,
            uniqueId,
            userSelectedAttributes: attributes,
            quantity: Math.max(1, quantity),
          };
          set({ cart: [...get().cart, newItem] });
        }
      },

      removeFromCart: (uniqueId) => {
        set({ cart: get().cart.filter((item) => item.uniqueId !== uniqueId) });
      },

      updateQuantity: (uniqueId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(uniqueId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.uniqueId === uniqueId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getSubtotal: (currencySymbol) => {
        return get().cart.reduce((sum, item) => {
          const price = getPriceAmount(item.prices, currencySymbol);
          return sum + price * item.quantity;
        }, 0);
      },

      getTaxes: (currencySymbol) => {
        const subtotal = get().getSubtotal(currencySymbol);
        const rate = BRAND_CONFIG.policies.taxRatePercent / 100;
        return parseFloat((subtotal * rate).toFixed(2));
      },

      getGrandTotal: (currencySymbol) => {
        const subtotal = get().getSubtotal(currencySymbol);
        const taxes = get().getTaxes(currencySymbol);
        return parseFloat((subtotal + taxes).toFixed(2));
      },

      getTotalItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'elan-shopping-cart',
    }
  )
);
