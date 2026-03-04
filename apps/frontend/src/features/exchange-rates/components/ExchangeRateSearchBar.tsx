import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { CurrencySelect } from '@/components/CurrencySelect';

export function ExchangeRateSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFromCurrency = searchParams.get('fromCurrency') ?? 'all';
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (fromCurrency && fromCurrency !== 'all') {
        prev.set('fromCurrency', fromCurrency);
      } else {
        prev.delete('fromCurrency');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setFromCurrency('all');
    setSearchParams(prev => {
      prev.delete('fromCurrency');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={fromCurrency !== 'all'}
      onClear={handleClear}
    >
      <div className="w-[160px]">
        <CurrencySelect
          value={fromCurrency}
          onValueChange={setFromCurrency}
          allowEmpty
          placeholder="From currency"
        />
      </div>
    </SearchBar>
  );
}
