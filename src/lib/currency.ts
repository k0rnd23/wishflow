const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// Cache exchange rates for 1 hour
let ratesCache: {
  rates: Record<string, number>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getExchangeRates() {
  // Check if we have valid cached rates
  if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
    return ratesCache.rates;
  }

  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    ratesCache = {
      rates: data.rates,
      timestamp: Date.now(),
    };

    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return cached rates if available, even if expired
    if (ratesCache) {
      console.warn('Using expired exchange rates from cache.');
      return ratesCache.rates;
    }
    throw error; // Re-throw the error if no cached rates are available
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  try {
    const rates = await getExchangeRates();

    // If same currency, return original amount
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to USD first
    const amountInUSD =
      fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];

    // Then convert to target currency
    const convertedAmount =
      toCurrency === 'USD' ? amountInUSD : amountInUSD * rates[toCurrency];

    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error(
      `Currency conversion failed for ${amount} ${fromCurrency} to ${toCurrency}:`,
      error
    );
    return 0; // Return 0 if conversion fails
  }
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Common currency options
export const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
] as const;