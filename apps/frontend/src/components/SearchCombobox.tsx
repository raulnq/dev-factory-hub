import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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

type SearchComboboxProps<TItem> = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
  defaultLabel: string;
  searchPlaceholder: string;
  errorMessage: string;
  emptyMessage: string;
  items: TItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
  getItemId: (item: TItem) => string;
  getItemLabel: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
};

export function SearchCombobox<TItem>({
  value,
  onChange,
  disabled,
  label,
  defaultLabel,
  searchPlaceholder,
  errorMessage,
  emptyMessage,
  items,
  isLoading,
  isError,
  open,
  onOpenChange,
  search,
  onSearchChange,
  getItemId,
  getItemLabel,
  renderItem,
}: SearchComboboxProps<TItem>) {
  const listId = useId();
  const [display, setDisplay] = useState(label || defaultLabel);

  const displayValue = !value ? defaultLabel : display;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
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
                displayValue === defaultLabel && 'text-muted-foreground'
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
              setDisplay(defaultLabel);
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
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={onSearchChange}
          />
          <CommandList id={listId}>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                {errorMessage}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin opacity-50" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {items?.map(item => (
                    <CommandItem
                      key={getItemId(item)}
                      value={getItemId(item)}
                      onSelect={selected => {
                        onChange(selected);
                        onOpenChange(false);
                        setDisplay(getItemLabel(item));
                      }}
                    >
                      {renderItem(item)}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === getItemId(item)
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
