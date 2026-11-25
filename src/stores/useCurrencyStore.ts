import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '../types';
import { DEFAULT_CURRENCIES } from '../data/mockProducts';
import { getCurrencies } from '../services/firebase/currencyService';

interface CurrencyState {
  selectedCurrency: Currency;
  availableCurrencies: Currency[];
  setCurrency: (currency: Currency) => void;
  loadCurrencies: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: DEFAULT_CURRENCIES[0],
      availableCurrencies: DEFAULT_CURRENCIES,

      setCurrency: (currency) => set({ selectedCurrency: currency }),

      loadCurrencies: async () => {
        const currencies = await getCurrencies();
        set({ availableCurrencies: currencies });
        // Ensure current selection is still in available list
        const current = get().selectedCurrency;
        const exists = currencies.some((c) => c.symbol === current.symbol);
        if (!exists && currencies.length > 0) {
          set({ selectedCurrency: currencies[0] });
        }
      },
    }),
    {
      name: 'elan-selected-currency',
    }
  )
);
