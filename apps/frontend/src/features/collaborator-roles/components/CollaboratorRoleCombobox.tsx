import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useCollaboratorRoles } from '../stores/useCollaboratorRoles';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function CollaboratorRoleCombobox({
  value,
  onChange,
  disabled,
  label,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useCollaboratorRoles(
    debouncedSearch,
    open
  );

  return (
    <SearchCombobox
      value={value}
      onChange={onChange}
      disabled={disabled}
      label={label}
      defaultLabel="Select collaborator role..."
      searchPlaceholder="Search roles..."
      errorMessage="Failed to load collaborator roles. Please try again."
      emptyMessage="No collaborator roles found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={role => role.collaboratorRoleId}
      getItemLabel={role => role.name}
      renderItem={role => (
        <div className="flex flex-col">
          <span className="font-medium">{role.name}</span>
          <span className="text-xs text-muted-foreground">
            {role.currency} - Fee: {role.feeRate} / Cost: {role.costRate}
          </span>
        </div>
      )}
    />
  );
}
