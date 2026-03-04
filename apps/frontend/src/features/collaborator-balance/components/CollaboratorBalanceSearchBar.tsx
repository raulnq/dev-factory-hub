import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';
import { CollaboratorCombobox } from '@/features/collaborators/components/CollaboratorCombobox';
import { CurrencySelect } from '@/components/CurrencySelect';

export function CollaboratorBalanceSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currency, setCurrency] = useState(
    searchParams.get('currency') ?? 'all'
  );
  const [collaboratorId, setCollaboratorId] = useState(
    searchParams.get('collaboratorId') ?? ''
  );
  const [exchangeCurrencyTo, setExchangeCurrencyTo] = useState(
    searchParams.get('exchangeCurrencyTo') ?? 'all'
  );
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const hasFilters =
    currency !== 'all' ||
    !!collaboratorId ||
    !!searchParams.get('startDate') ||
    !!searchParams.get('endDate') ||
    !!searchParams.get('exchangeCurrencyTo');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (currency !== 'all') prev.set('currency', currency);
      else prev.delete('currency');
      if (collaboratorId) prev.set('collaboratorId', collaboratorId);
      else prev.delete('collaboratorId');
      const startDate = startDateRef.current?.value ?? '';
      if (startDate) prev.set('startDate', startDate);
      else prev.delete('startDate');
      const endDate = endDateRef.current?.value ?? '';
      if (endDate) prev.set('endDate', endDate);
      else prev.delete('endDate');
      if (exchangeCurrencyTo !== 'all' && exchangeCurrencyTo !== currency) {
        prev.set('exchangeCurrencyTo', exchangeCurrencyTo);
      } else {
        prev.delete('exchangeCurrencyTo');
      }
      return prev;
    });
  };

  const handleClear = () => {
    setCurrency('all');
    setCollaboratorId('');
    setExchangeCurrencyTo('all');
    if (startDateRef.current) startDateRef.current.value = '';
    if (endDateRef.current) endDateRef.current.value = '';
    setSearchParams(prev => {
      prev.delete('currency');
      prev.delete('collaboratorId');
      prev.delete('startDate');
      prev.delete('endDate');
      prev.delete('exchangeCurrencyTo');
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
      <div className="w-[240px]">
        <CollaboratorCombobox
          value={collaboratorId}
          onChange={id => setCollaboratorId(id)}
        />
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
      <CurrencySelect
        value={exchangeCurrencyTo}
        onValueChange={setExchangeCurrencyTo}
        allowEmpty
        emptyLabel="Exchange to..."
        placeholder="Exchange to..."
      />
    </SearchBar>
  );
}
