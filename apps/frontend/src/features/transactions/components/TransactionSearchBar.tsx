import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchBar } from '@/components/SearchBar';

const TRANSACTION_TYPES = ['Income', 'Outcome'];

export function TransactionSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') ?? '';
  const initialDescription = searchParams.get('description') ?? '';
  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState(initialDescription);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (type) prev.set('type', type);
      else prev.delete('type');
      if (description) prev.set('description', description);
      else prev.delete('description');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setType('');
    setDescription('');
    setSearchParams(prev => {
      prev.delete('type');
      prev.delete('description');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!(type || description)}
      onClear={handleClear}
    >
      <div className="w-[160px]">
        <Select
          value={type}
          onValueChange={v => setType(v === '__all__' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            {TRANSACTION_TYPES.map(t => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder="Search by description..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-[250px]"
      />
    </SearchBar>
  );
}
