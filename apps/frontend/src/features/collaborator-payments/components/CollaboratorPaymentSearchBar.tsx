import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';

export function CollaboratorPaymentSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCollaboratorId = searchParams.get('collaboratorId') ?? '';
  const [collaboratorId, setCollaboratorId] = useState(initialCollaboratorId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (collaboratorId) {
        prev.set('collaboratorId', collaboratorId);
      } else {
        prev.delete('collaboratorId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setCollaboratorId('');
    setSearchParams(prev => {
      prev.delete('collaboratorId');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!collaboratorId}
      onClear={handleClear}
    >
      <div className="w-[250px]">
        <CollaboratorCombobox
          value={collaboratorId}
          onChange={setCollaboratorId}
        />
      </div>
    </SearchBar>
  );
}
