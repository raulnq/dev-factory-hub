import { useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchBar } from '@/components/SearchBar';

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'PEN',
  'ARS',
  'CLP',
  'COP',
  'MXN',
  'JPY',
  'CAD',
  'CHF',
  'CNY',
];

export function MoneyExchangeSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFromCurrency = searchParams.get('fromCurrency') ?? '';
  const initialToCurrency = searchParams.get('toCurrency') ?? '';
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (fromCurrency) {
        prev.set('fromCurrency', fromCurrency);
      } else {
        prev.delete('fromCurrency');
      }
      if (toCurrency) {
        prev.set('toCurrency', toCurrency);
      } else {
        prev.delete('toCurrency');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setFromCurrency('');
    setToCurrency('');
    setSearchParams(prev => {
      prev.delete('fromCurrency');
      prev.delete('toCurrency');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!(fromCurrency || toCurrency)}
      onClear={handleClear}
    >
      <div className="w-[160px]">
        <Select value={fromCurrency} onValueChange={setFromCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="From currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map(c => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[160px]">
        <Select value={toCurrency} onValueChange={setToCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="To currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map(c => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SearchBar>
  );
}
