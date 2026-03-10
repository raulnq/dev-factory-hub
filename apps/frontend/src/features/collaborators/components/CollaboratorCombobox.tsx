import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useCollaborators } from '../stores/useCollaborators';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function CollaboratorCombobox({
  value,
  onChange,
  disabled,
  label,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useCollaborators(debouncedSearch, open);

  return (
    <SearchCombobox
      value={value}
      onChange={onChange}
      disabled={disabled}
      label={label}
      defaultLabel="Select collaborator..."
      searchPlaceholder="Search collaborators..."
      errorMessage="Failed to load collaborators. Please try again."
      emptyMessage="No collaborators found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={c => c.collaboratorId}
      getItemLabel={c => c.name}
      renderItem={c => (
        <div className="flex flex-col">
          <span className="font-medium">{c.name}</span>
          <span className="text-xs text-muted-foreground">
            {c.email} - {c.withholdingPercentage}%
          </span>
        </div>
      )}
    />
  );
}
