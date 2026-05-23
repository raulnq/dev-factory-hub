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

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2019 }, (_, i) =>
  String(2020 + i)
);

export function DocumentStatusFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultMonth = String(new Date().getMonth() + 1);
  const defaultYear = String(currentYear);

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
      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map(m => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map(y => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SearchBar>
  );
}
