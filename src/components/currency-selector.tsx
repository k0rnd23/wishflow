"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COMMON_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KZT", name: "Kazakhstani Tenge" },
  // Add more common currencies as needed
];

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function CurrencySelector({
  value,
  onValueChange,
}: CurrencySelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Common Currencies</SelectLabel>
          {COMMON_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}