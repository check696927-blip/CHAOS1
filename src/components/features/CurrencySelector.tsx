import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { Currency } from "@/types";
import { CURRENCIES, saveCurrencyPreference } from "@/lib/currency";

interface CurrencySelectorProps {
  current: Currency;
  onChange: (currency: Currency) => void;
}

export const CurrencySelector = ({ current, onChange }: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (currency: Currency) => {
    onChange(currency);
    saveCurrencyPreference(currency.code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-chaos-dark hover:bg-chaos-purple/20 rounded-lg transition-all border border-gray-700"
      >
        <Globe className="w-4 h-4 text-chaos-cyan" />
        <span className="font-neon text-sm">{current.code}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-64 bg-chaos-dark border border-chaos-purple/30 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
            <div className="p-3 border-b border-gray-800">
              <p className="font-neon text-xs text-gray-400 uppercase">Select Currency</p>
            </div>
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleSelect(currency)}
                className={`w-full flex items-center justify-between p-3 hover:bg-chaos-purple/10 transition-all ${
                  current.code === currency.code ? 'bg-chaos-purple/20' : ''
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">{currency.code} - {currency.symbol}</p>
                  <p className="text-xs text-gray-400">{currency.name}</p>
                </div>
                {current.code === currency.code && (
                  <Check className="w-5 h-5 text-chaos-purple" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
