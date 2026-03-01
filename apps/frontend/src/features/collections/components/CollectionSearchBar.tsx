import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { ClientCombobox } from '../../clients/components/ClientCombobox';

export function CollectionSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClientId = searchParams.get('clientId') ?? '';
  const [clientId, setClientId] = useState(initialClientId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (clientId) {
        prev.set('clientId', clientId);
      } else {
        prev.delete('clientId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setClientId('');
    setSearchParams(prev => {
      prev.delete('clientId');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!clientId}
      onClear={handleClear}
    >
      <div className="w-[250px]">
        <ClientCombobox value={clientId} onChange={setClientId} />
      </div>
    </SearchBar>
  );
}
