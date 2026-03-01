import { SearchBar } from '@/components/SearchBar';
import { ProjectCombobox } from '../../clients/components/ProjectCombobox';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

export function ProformaSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') ?? '';
  const [projectId, setProjectId] = useState(initialProjectId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (projectId) {
        prev.set('projectId', projectId);
      } else {
        prev.delete('projectId');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setProjectId('');

    setSearchParams(prev => {
      prev.delete('projectId');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!projectId}
      onClear={handleClear}
    >
      <div className="w-[300px]">
        <ProjectCombobox value={projectId} onChange={setProjectId} />
      </div>
    </SearchBar>
  );
}
