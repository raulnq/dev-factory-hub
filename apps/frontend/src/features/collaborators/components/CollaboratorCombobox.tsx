import { useId, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { listCollaborators } from '../stores/collaboratorsClient';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDebounce } from 'use-debounce';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

const DEFAULT_LABEL = 'Select collaborator...';

export function CollaboratorCombobox({
  value,
  onChange,
  disabled,
  label,
}: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();
  const [display, setDisplay] = useState(label || DEFAULT_LABEL);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['collaborators-search', debouncedSearch],
    queryFn: async () => {
      const token = await getToken();
      return listCollaborators(
        { pageNumber: 1, pageSize: 100, name: debouncedSearch || undefined },
        token
      );
    },
  });

  const displayValue = !value ? DEFAULT_LABEL : display;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            disabled={disabled || isLoading}
          >
            <span
              className={cn(
                'truncate',
                displayValue == DEFAULT_LABEL && 'text-muted-foreground'
              )}
            >
              {displayValue}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {value && !disabled && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm"
            onClick={e => {
              e.stopPropagation();
              onChange('');
              setDisplay(DEFAULT_LABEL);
            }}
          >
            <X className="size-3 opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search properties..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList id={listId}>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load collaborators. Please try again.
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin opacity-50" />
              </div>
            ) : (
              <>
                <CommandEmpty>No collaborators found.</CommandEmpty>
                <CommandGroup>
                  {data?.items.map(c => (
                    <CommandItem
                      key={c.collaboratorId}
                      value={c.collaboratorId}
                      onSelect={selected => {
                        onChange(selected);
                        setOpen(false);
                        setDisplay(c.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {c.email} - {c.withholdingPercentage}%
                        </span>
                      </div>
                      <Check
                        className={cn(
                          'ml-auto',
                          value === c.collaboratorId
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
