import { useSearchParams } from 'react-router';
import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 26 }, (_, i) => currentYear - 20 + i);

export function TaxPaymentSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYear = searchParams.get('year') ?? String(currentYear);
  const [year, setYear] = useState(initialYear);

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
    setYear(String(currentYear));
    setSearchParams(prev => {
      prev.set('year', String(currentYear));
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={year !== String(currentYear)}
      onClear={handleClear}
    >
      <div className="w-[140px]">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map(y => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SearchBar>
  );
}
