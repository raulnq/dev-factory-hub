import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useProjects } from '../stores/useClients';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function ProjectCombobox({ value, onChange, disabled, label }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useProjects({
    name: debouncedSearch || undefined,
    pageNumber: 1,
    pageSize: 10,
    enabled: open,
  });

  return (
    <SearchCombobox
      value={value}
      onChange={onChange}
      disabled={disabled}
      label={label}
      defaultLabel="Select project..."
      searchPlaceholder="Search projects..."
      errorMessage="Failed to load projects. Please try again."
      emptyMessage="No projects found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={p => p.projectId}
      getItemLabel={p => p.name}
      renderItem={p => (
        <div className="flex flex-col">
          <span className="font-medium">{p.name}</span>
          <span className="text-xs text-muted-foreground">{p.clientName}</span>
        </div>
      )}
    />
  );
}
