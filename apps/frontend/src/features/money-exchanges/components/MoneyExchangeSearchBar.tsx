import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { CurrencySelect } from '@/components/CurrencySelect';

export function MoneyExchangeSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFromCurrency = searchParams.get('fromCurrency') ?? 'all';
  const initialToCurrency = searchParams.get('toCurrency') ?? 'all';
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (fromCurrency && fromCurrency !== 'all') {
        prev.set('fromCurrency', fromCurrency);
      } else {
        prev.delete('fromCurrency');
      }
      if (toCurrency && toCurrency !== 'all') {
        prev.set('toCurrency', toCurrency);
      } else {
        prev.delete('toCurrency');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setFromCurrency('all');
    setToCurrency('all');
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
      showClearButton={!!(fromCurrency !== 'all' || toCurrency !== 'all')}
      onClear={handleClear}
    >
      <CurrencySelect
        value={fromCurrency}
        onValueChange={setFromCurrency}
        allowEmpty
        placeholder="From currency"
      />
      <CurrencySelect
        value={toCurrency}
        onValueChange={setToCurrency}
        allowEmpty
        placeholder="To currency"
      />
    </SearchBar>
  );
}
