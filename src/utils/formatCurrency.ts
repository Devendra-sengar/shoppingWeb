import type { Price } from '../types';

export function getPriceAmount(prices: Price[], selectedCurrencySymbol: string): number {
  if (!prices || prices.length === 0) return 0;
  
  const match = prices.find((p) => p.currency.symbol === selectedCurrencySymbol);
  if (match) {
    return match.amount;
  }

  // Graceful fallback for legacy Firestore documents that may lack explicit INR
  const usdPrice = prices.find((p) => p.currency.symbol === '$');
  if (selectedCurrencySymbol === '₹' && usdPrice) {
    return Math.round(usdPrice.amount * 84);
  }

  return prices[0].amount;
}

export function formatPrice(amount: number, currencySymbol: string): string {
  if (currencySymbol === '₹') {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
