import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';
import { CurrencySelect } from '@/components/CurrencySelect';

export function BankBalanceSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currency, setCurrency] = useState(searchParams.get('currency') ?? '');
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const hasFilters =
    !!currency ||
    !!searchParams.get('startDate') ||
    !!searchParams.get('endDate');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (currency) prev.set('currency', currency);
      else prev.delete('currency');
      const startDate = startDateRef.current?.value ?? '';
      if (startDate) prev.set('startDate', startDate);
      else prev.delete('startDate');
      const endDate = endDateRef.current?.value ?? '';
      if (endDate) prev.set('endDate', endDate);
      else prev.delete('endDate');
      return prev;
    });
  };

  const handleClear = () => {
    setCurrency('');
    if (startDateRef.current) startDateRef.current.value = '';
    if (endDateRef.current) endDateRef.current.value = '';
    setSearchParams(prev => {
      prev.delete('currency');
      prev.delete('startDate');
      prev.delete('endDate');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={hasFilters}
      onClear={handleClear}
    >
      <CurrencySelect
        value={currency}
        onValueChange={setCurrency}
        allowEmpty
        emptyLabel="Select currency..."
      />
      <Input
        ref={startDateRef}
        type="date"
        defaultValue={searchParams.get('startDate') ?? ''}
        className="w-[180px]"
        aria-label="Start date"
      />
      <Input
        ref={endDateRef}
        type="date"
        defaultValue={searchParams.get('endDate') ?? ''}
        className="w-[180px]"
        aria-label="End date"
      />
    </SearchBar>
  );
}
