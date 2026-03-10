import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useClients } from '../stores/useClients';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function ClientCombobox({ value, onChange, disabled, label }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useClients({
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
      defaultLabel="Select client..."
      searchPlaceholder="Search clients..."
      errorMessage="Failed to load clients. Please try again."
      emptyMessage="No clients found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={c => c.clientId}
      getItemLabel={c => c.name}
      renderItem={c => <span className="font-medium">{c.name}</span>}
    />
  );
}
