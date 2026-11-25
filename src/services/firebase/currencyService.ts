import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase';
import type { Currency } from '../../types';
import { DEFAULT_CURRENCIES } from '../../data/mockProducts';

let cachedCurrencies: Currency[] | null = null;

export async function getCurrencies(): Promise<Currency[]> {
  if (cachedCurrencies) {
    return cachedCurrencies;
  }

  if (db) {
    try {
      const currenciesCol = collection(db, 'currencies');
      const snapshot = await getDocs(currenciesCol);
      
      if (!snapshot.empty) {
        const currencies = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            label: data.label || 'USD',
            symbol: data.symbol || '$',
          };
        });
        // Ensure INR is always available as the primary currency
        if (!currencies.some(c => c.label === 'INR')) {
          currencies.unshift({ label: 'INR', symbol: '₹' });
        }
        cachedCurrencies = currencies;
        return currencies;
      }
    } catch (error) {
      console.warn('[CurrencyService] Firestore currencies fetch failed; using default currency suite.', error);
    }
  }

  cachedCurrencies = DEFAULT_CURRENCIES;
  return DEFAULT_CURRENCIES;
}
