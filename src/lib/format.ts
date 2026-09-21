const SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', AUD: 'A$', CAD: 'C$', SGD: 'S$',
};

export const CURRENCIES = Object.keys(SYMBOLS);

export function currencySymbol(code: string): string {
  return SYMBOLS[code] ?? code;
}

export function formatPrice(amount: number, currency: string): string {
  const n = Number.isFinite(amount) ? amount : 0;
  // Whole numbers read better on a menu; decimals only when they carry meaning.
  const body = Number.isInteger(n) ? n.toString() : n.toFixed(2);
  return `${currencySymbol(currency)}${body}`;
}

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    out.push(todayKey(d));
  }
  return out;
}
