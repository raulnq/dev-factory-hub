import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { MonthSelect } from '@/components/MonthSelect';
import { YearSelect } from '@/components/YearSelect';

export function DocumentStatusFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultMonth = String(new Date().getMonth() + 1);
  const defaultYear = String(new Date().getFullYear());

  const [month, setMonth] = useState(searchParams.get('month') ?? defaultMonth);
  const [year, setYear] = useState(searchParams.get('year') ?? defaultYear);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('month', month);
      prev.set('year', year);
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setMonth(defaultMonth);
    setYear(defaultYear);
    setSearchParams(prev => {
      prev.set('month', defaultMonth);
      prev.set('year', defaultYear);
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={month !== defaultMonth || year !== defaultYear}
      onClear={handleClear}
    >
      <MonthSelect value={month} onValueChange={setMonth} />
      <YearSelect value={year} onValueChange={setYear} />
    </SearchBar>
  );
}
