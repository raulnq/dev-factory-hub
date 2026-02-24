import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { SearchBar } from '@/components/SearchBar';

export function ClientSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialName = searchParams.get('name') ?? '';
  const [name, setName] = useState(initialName);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (name) {
        prev.set('name', name);
      } else {
        prev.delete('name');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setName('');
    setSearchParams(prev => {
      prev.delete('name');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!name}
      onClear={handleClear}
    >
      <Input
        placeholder="Search by name..."
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-[250px]"
      />
    </SearchBar>
  );
}
