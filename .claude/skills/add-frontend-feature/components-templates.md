# Components Templates

## SearchBar (`components/<Entity>SearchBar.tsx`)

Uses the shared `SearchBar` component from `@/components/SearchBar`. Provides filter inputs as children. Updates URL search params.

### Simple text search variant

```tsx
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { SearchBar } from '@/components/SearchBar';

export function <Entity>SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialName = searchParams.get('name') ?? '';
  const [name, setName] = useState(initialName);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (name) {
        prev.set('name', name);
      } else {
        prev.delete('name');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setName('');
    setSearchParams(prev => {
      prev.delete('name');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!name}
      onClear={handleClear}
    >
      <Input
        placeholder="Search by name..."
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-[250px]"
      />
    </SearchBar>
  );
}
```

### Multi-field search variant (comboboxes, dates)

```tsx
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input } from '@/components/ui/input';
import { <Related>Combobox } from '../../<related>/components/<Related>Combobox';
import { SearchBar } from '@/components/SearchBar';

export function <Entity>SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRelatedId = searchParams.get('relatedId') ?? '';
  const startCreatedAt = searchParams.get('startCreatedAt') ?? '';
  const [relatedId, setRelatedId] = useState(initialRelatedId);
  const dateRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (relatedId) prev.set('relatedId', relatedId);
      else prev.delete('relatedId');
      const dateValue = dateRef.current?.value ?? '';
      if (dateValue) prev.set('startCreatedAt', dateValue);
      else prev.delete('startCreatedAt');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setRelatedId('');
    if (dateRef.current) dateRef.current.value = '';
    setSearchParams(prev => {
      prev.delete('relatedId');
      prev.delete('startCreatedAt');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!(relatedId || startCreatedAt)}
      onClear={handleClear}
    >
      <div className="w-[250px]">
        <<Related>Combobox value={relatedId} onChange={setRelatedId} />
      </div>
      <Input
        ref={dateRef}
        type="date"
        defaultValue={startCreatedAt}
        className="w-[200px]"
      />
    </SearchBar>
  );
}
```

## Table (`components/<Entity>Table.tsx`)

Exports two things: `<Entity>Table` and `<Entities>Skeleton`. Table reads search params for filters and pagination, includes `Pagination` at the bottom. Uses shared `NoMatchingItems` for empty state.

```tsx
import { Link, useSearchParams } from 'react-router';
import { Search, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { use<Entities>Suspense } from '../stores/use<Entities>';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';

export function <Entities>Skeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {/* Add column headers */}
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            {/* Match column count */}
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function <Entity>Table() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = use<Entities>Suspense({ name, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* Add column headers */}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.<entityId>}>
              <TableCell className="font-medium">
                <Link to={`/<entities>/${item.<entityId>}`} className="hover:underline">
                  {item.name}
                </Link>
              </TableCell>
              {/* Add data columns */}
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/<entities>/${item.<entityId>}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/<entities>/${item.<entityId>}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
```

## Skeleton (`components/<Entity>Skeleton.tsx`)

Shared by both Edit and View pages. Renders inside `CardContent` with `Field`/`FieldLabel`/`Skeleton` matching the form layout.

```tsx
import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function <Entity>Skeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        {/* Add one skeleton block per field, matching form layout */}
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        {/* Use h-16 for Textarea fields */}
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
      </div>
    </CardContent>
  );
}
```

## Field Type Variants

When building forms, use the correct pattern for each field type. Only the basic text `Input` is shown in the Add/Edit templates below — use these variants for other types.

### Nullable string field

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        {...field}
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value || null)}
        id="email"
        aria-invalid={fieldState.invalid}
        placeholder="Email (optional)"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Number field

```tsx
<Controller
  name="rentalPrice"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="rentalPrice">Rental Price</FieldLabel>
      <Input
        {...field}
        id="rentalPrice"
        type="number"
        step="0.01"
        value={field.value ?? ''}
        onChange={e => field.onChange(Number(e.target.value))}
        aria-invalid={fieldState.invalid}
        placeholder="0.00"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Boolean field (Select)

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Controller
  name="hasElevator"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="hasElevator">Has Elevator</FieldLabel>
      <Select
        value={String(field.value)}
        onValueChange={v => field.onChange(v === 'true')}
        disabled={isPending}
      >
        <SelectTrigger id="hasElevator">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>;
```

### Textarea field (long text)

```tsx
import { Textarea } from '@/components/ui/textarea';

<Controller
  name="notes"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="notes">Notes</FieldLabel>
      <Textarea
        {...field}
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value || null)}
        id="notes"
        rows={3}
        aria-invalid={fieldState.invalid}
        placeholder="Notes (optional)"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>;
```

### Date field (nullable)

```tsx
<Controller
  name="birthDate"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>
      <Input
        {...field}
        id="birthDate"
        type="date"
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value || null)}
        aria-invalid={fieldState.invalid}
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Combobox field (foreign key reference)

Use the entity's combobox component (see Combobox section below):

```tsx
<Controller
  name="clientId"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Client (Owner)</FieldLabel>
      <ClientCombobox
        value={field.value}
        onChange={field.onChange}
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Grid layout for compact fields

Group related fields in grids:

```tsx
<div className="grid grid-cols-3 gap-4">
  <Controller name="rooms" ... />
  <Controller name="bathrooms" ... />
  <Controller name="parkingSpaces" ... />
</div>

<div className="grid grid-cols-2 gap-4">
  <Controller name="totalArea" ... />
  <Controller name="builtArea" ... />
</div>
```

## Add Form (`components/Add<Entity>Form.tsx`)

Form renders only `FormCardContent` with field controllers. No Card, no Header, no Footer — those are in the page.

Use `FieldGroup` to wrap all controllers and `FieldSeparator` between logical sections.

```tsx
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { add<Entity>Schema, type Add<Entity> } from '#/features/<entities>/schemas';
import { FormCardContent } from '@/components/FormCardContent';

type Add<Entity>FormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Add<Entity>>;
};

export function Add<Entity>Form({ isPending, onSubmit }: Add<Entity>FormProps) {
  const form = useForm<Add<Entity>>({
    resolver: zodResolver(add<Entity>Schema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Name"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        {/* Add more Controller fields here */}
        {/* Use <FieldSeparator /> between logical sections */}
      </FieldGroup>
    </FormCardContent>
  );
}
```

## Edit Form (`components/Edit<Entity>Form.tsx`)

Same structure as Add but receives entity data as `defaultValues`.

```tsx
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  edit<Entity>Schema,
  type Edit<Entity>,
  type <Entity>,
} from '#/features/<entities>/schemas';
import { FormCardContent } from '@/components/FormCardContent';

type Edit<Entity>FormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
  <entity>: <Entity>;
};

export function Edit<Entity>Form({
  isPending,
  onSubmit,
  <entity>,
}: Edit<Entity>FormProps) {
  const form = useForm<Edit<Entity>>({
    resolver: zodResolver(edit<Entity>Schema),
    defaultValues: <entity>,
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Name"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        {/* Add more Controller fields here */}
        {/* Use <FieldSeparator /> between logical sections */}
      </FieldGroup>
    </FormCardContent>
  );
}
```

## View Card (`components/View<Entity>Card.tsx`)

Read-only display using `ViewCardContent` with disabled `Input`/`Textarea` fields.

```tsx
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { <Entity> } from '#/features/<entities>/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';

type View<Entity>CardProps = {
  <entity>: <Entity>;
};

export function View<Entity>Card({ <entity> }: View<Entity>CardProps) {
  return (
    <ViewCardContent>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input value={<entity>.name} disabled />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input value={<entity>.email ?? ''} disabled />
      </Field>
      {/* Use grids for compact display */}
      <div className="grid grid-cols-3 gap-4">
        <Field>
          <FieldLabel>Rooms</FieldLabel>
          <Input value={<entity>.rooms.toString()} disabled />
        </Field>
        {/* ... */}
      </div>
      {/* Boolean fields: display as "Yes"/"No" */}
      <Field>
        <FieldLabel>Has Elevator</FieldLabel>
        <Input value={<entity>.hasElevator ? 'Yes' : 'No'} disabled />
      </Field>
      {/* Use Textarea for long text fields */}
      {/* <Textarea value={<entity>.notes ?? ''} disabled rows={3} /> */}
    </ViewCardContent>
  );
}
```

## Searchable Combobox (`components/<Entity>Combobox.tsx`)

When an entity is referenced as a foreign key in other features' forms, create a searchable combobox. Uses `useQuery` (non-Suspense) with debounced search, display state, and clear button.

```tsx
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { use<Entities> } from '../stores/use<Entities>';

type <Entity>ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

const DEFAULT_LABEL = 'Select <entity>...';

export function <Entity>Combobox({
  value,
  onChange,
  disabled,
  label,
}: <Entity>ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [display, setDisplay] = useState(label || DEFAULT_LABEL);

  const { data, isError, isLoading } = use<Entities>({
    name: debouncedSearch || undefined,
    pageNumber: 1,
    pageSize: 10,
    enabled: open,
  });

  const displayValue = !value ? DEFAULT_LABEL : display;

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch('');
      }}
    >
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span
              className={cn(
                'truncate',
                displayValue === DEFAULT_LABEL && 'text-muted-foreground'
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
            placeholder="Search <entities>..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load <entities>. Please try again.
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin opacity-50" />
              </div>
            ) : (
              <>
                <CommandEmpty>No <entities> found.</CommandEmpty>
                <CommandGroup>
                  {data?.items.map(item => (
                    <CommandItem
                      key={item.<entityId>}
                      value={item.<entityId>}
                      onSelect={selected => {
                        onChange(selected);
                        setOpen(false);
                        setDisplay(item.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {/* Secondary info: DNI, type, etc. */}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          'ml-auto',
                          value === item.<entityId>
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
```

Key features:

- 300ms debounce on search input via `use-debounce`
- Only fetches when popover opens (`enabled: open`)
- Display text stored separately (shows name, not UUID)
- Clear button (X) appears when a value is selected
- Loading, error, and empty states
- `shouldFilter={false}` — server-side filtering, not client-side

## Action Button with Dialog (`components/<Action>Button.tsx`)

For state transitions (approve, reject, etc.), create a button that opens a dialog with a small form:

```tsx
import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  approve<Entity>Schema,
  type Approve<Entity>,
} from '#/features/<entities>/schemas';

type ApproveButtonProps = {
  disabled: boolean;
  onApprove: (data: Approve<Entity>) => void;
};

export function ApproveButton({ disabled, onApprove }: ApproveButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<Approve<Entity>>({
    resolver: zodResolver(approve<Entity>Schema),
    defaultValues: {
      approvedAt: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="default"
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Approve
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve <Entity></DialogTitle>
            <DialogDescription>
              Please confirm the approval date.
            </DialogDescription>
          </DialogHeader>
          <form
            id="approve-form"
            onSubmit={form.handleSubmit(data => {
              onApprove(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <Controller
              name="approvedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="approvedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="approvedAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="approve-form">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Delete Confirmation Dialog (`components/Delete<Entity>Dialog.tsx`)

For destructive actions, create a confirmation dialog. Unlike action dialogs (approve, reject), delete dialogs are simpler — no form, just confirmation:

```tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Delete<Entity>DialogProps = {
  name: string | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
};

export function Delete<Entity>Dialog({
  name,
  isOpen,
  onOpenChange,
  onDelete,
}: Delete<Entity>DialogProps) {
  const handleSubmit = async () => {
    await onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete <Entity></DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

Usage in table/page — manage dialog state and call the delete mutation:

```tsx
const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
const deleteMutation = useDelete<Entity>();

// In table row:
<Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ id: item.<entityId>, name: item.name })}>
  <Trash2 className="h-4 w-4" />
</Button>

// Outside table:
<Delete<Entity>Dialog
  name={deleteTarget?.name}
  isOpen={!!deleteTarget}
  onOpenChange={open => { if (!open) setDeleteTarget(null); }}
  onDelete={async () => {
    await deleteMutation.mutateAsync({ <entityId>: deleteTarget!.id });
    toast.success('<Entity> deleted successfully');
    setDeleteTarget(null);
  }}
/>
```

## Lazy Loading Heavy Components

For large components (maps, charts, rich editors), use `React.lazy()` with `Suspense` to avoid loading them upfront:

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() =>
  import('../../../components/HeavyComponent').then(module => ({
    default: module.HeavyComponent,
  }))
);

function HeavyComponentSkeleton() {
  return (
    <div className="h-[400px] bg-muted rounded-md animate-pulse border border-border" />
  );
}

// Usage in a form or view:
<Suspense fallback={<HeavyComponentSkeleton />}>
  <HeavyComponent value={value} onChange={onChange} disabled={disabled} />
</Suspense>;
```

Key rules:

- `.then(module => ({ default: module.ComponentName }))` — required since components use named exports (no default)
- Always wrap in `<Suspense>` with a skeleton fallback matching the component's dimensions
- Only use for genuinely heavy components (maps, charts) — not for regular UI components

## Status Badge (`Badge` variant)

Use `Badge` with variants for status display in tables:

```tsx
import { Badge } from '@/components/ui/badge';

// Map status to badge variant
function statusVariant(status: string) {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'destructive';
    case 'Under Review':
      return 'secondary';
    default:
      return 'outline';
  }
}

// In table cell:
<Badge variant={statusVariant(item.status)}>{item.status}</Badge>;
```
