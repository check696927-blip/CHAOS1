import { Currency } from "@/types";
import { useState, useEffect } from "react";

// Common currencies with conversion rates (from USD)
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.50 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.12 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 4.97 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.45 },
];

export const detectUserCurrency = (): Currency => {
  // Try to detect user's currency from timezone/locale
  const userLocale = navigator.language || 'en-US';
  const currency = localStorage.getItem('preferred_currency');
  
  if (currency) {
    return CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  }

  // Simple locale-to-currency mapping
  const localeMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'en-IN': 'INR',
    'en-ZA': 'ZAR',
    'zh-CN': 'CNY',
    'ja-JP': 'JPY',
    'pt-BR': 'BRL',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
  };

  const detected = localeMap[userLocale] || localeMap[userLocale.split('-')[0]] || 'USD';
  return CURRENCIES.find(c => c.code === detected) || CURRENCIES[0];
};

export const convertPrice = (priceUSD: number, currency: Currency): number => {
  return priceUSD * currency.rate;
};

export const formatPrice = (priceUSD: number, currency: Currency): string => {
  const converted = convertPrice(priceUSD, currency);
  return `${currency.symbol}${converted.toFixed(2)}`;
};

export const saveCurrencyPreference = (currencyCode: string) => {
  localStorage.setItem('preferred_currency', currencyCode);
};

// React hook for currency management
export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(() => detectUserCurrency());

  useEffect(() => {
    // Listen for currency changes from other components
    const handleStorageChange = () => {
      setCurrency(detectUserCurrency());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    saveCurrencyPreference(newCurrency.code);
  };

  const convertPrice = (priceUSD: number): number => {
    return priceUSD * currency.rate;
  };

  const formatPrice = (price: number): string => {
    return `${currency.symbol}${price.toFixed(2)}`;
  };

  return {
    currency,
    setCurrency: changeCurrency,
    convertPrice,
    formatPrice,
  };
};
