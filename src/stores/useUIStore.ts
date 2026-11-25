import { create } from 'zustand';
import type { Product } from '../types';

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  quickShopProduct: Product | null;
  toastMessage: string | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  openQuickShop: (product: Product) => void;
  closeQuickShop: () => void;

  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  quickShopProduct: null,
  toastMessage: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openQuickShop: (product) => set({ quickShopProduct: product }),
  closeQuickShop: () => set({ quickShopProduct: null }),

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3000);
  },
  hideToast: () => set({ toastMessage: null }),
}));
