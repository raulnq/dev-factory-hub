import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';

export function TimesheetSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCid = searchParams.get('collaboratorId') ?? '';
  const [cid, setCid] = useState(initialCid);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (cid) {
        prev.set('collaboratorId', cid);
      } else {
        prev.delete('collaboratorId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setCid('');
    setSearchParams(prev => {
      prev.delete('collaboratorId');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!cid}
      onClear={handleClear}
    >
      <div className="w-[250px]">
        <CollaboratorCombobox value={cid} onChange={setCid} />
      </div>
    </SearchBar>
  );
}
