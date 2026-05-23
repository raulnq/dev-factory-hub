import { useSearchParams } from 'react-router';
import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { YearSelect } from '@/components/YearSelect';

const currentYear = String(new Date().getFullYear());

export function TaxPaymentSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [year, setYear] = useState(searchParams.get('year') ?? currentYear);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (year) {
        prev.set('year', year);
      } else {
        prev.delete('year');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setYear(currentYear);
    setSearchParams(prev => {
      prev.set('year', currentYear);
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={year !== currentYear}
      onClear={handleClear}
    >
      <YearSelect value={year} onValueChange={setYear} />
    </SearchBar>
  );
}
