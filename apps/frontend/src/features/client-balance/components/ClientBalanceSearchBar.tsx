import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';
import { ClientCombobox } from '@/features/clients/components/ClientCombobox';

export function ClientBalanceSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currency, setCurrency] = useState(searchParams.get('currency') ?? '');
  const [clientId, setClientId] = useState(searchParams.get('clientId') ?? '');
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const hasFilters =
    !!currency ||
    !!clientId ||
    !!searchParams.get('startDate') ||
    !!searchParams.get('endDate');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (currency) prev.set('currency', currency);
      else prev.delete('currency');
      if (clientId) prev.set('clientId', clientId);
      else prev.delete('clientId');
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
    setClientId('');
    if (startDateRef.current) startDateRef.current.value = '';
    if (endDateRef.current) endDateRef.current.value = '';
    setSearchParams(prev => {
      prev.delete('currency');
      prev.delete('clientId');
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
      <Input
        placeholder="Currency *"
        value={currency}
        onChange={e => setCurrency(e.target.value.toUpperCase())}
        maxLength={3}
        className="w-[120px]"
        required
        aria-label="Currency (required)"
      />
      <div className="w-[240px]">
        <ClientCombobox value={clientId} onChange={id => setClientId(id)} />
      </div>
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
