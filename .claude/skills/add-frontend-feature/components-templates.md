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

Exports two things: `<Entity>Table` and `<Entities>Skeleton`. Table reads search params for filters and pagination, includes `Pagination` at the bottom. Uses shared `NoMatchingItems` for empty state and shared table cell components.

```tsx
import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
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
import { EditCellButton } from '@/components/EditCellButton';
import { ViewCellButton } from '@/components/ViewCellButton';
import { TextTableCell } from '@/components/TextTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { DateTableCell } from '@/components/DateTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Name</TableHead>
        <TableHead className="hidden md:table-cell">Amount</TableHead>
        <TableHead className="hidden lg:table-cell">Date</TableHead>
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function <Entities>Skeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8" />
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
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.<entityId>}>
              <TextTableCell className="font-medium" value={item.name} />
              <NumberTableCell value={Number(item.amount)} />
              <DateTableCell value={item.createdAt} />
              <BadgeTableCell variant={getStatusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <ActionTableCell>
                <ViewCellButton link={`/<entities>/${item.<entityId>}`} />
                <EditCellButton link={`/<entities>/${item.<entityId>}/edit`} />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
```

### Table cell components reference

| Component         | Props                                                                          | Purpose                                  |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| `TextTableCell`   | `value`, plus `TableCell` props                                                | Text with `'-'` fallback for null        |
| `NumberTableCell` | `value`, `locale?`, `minimumFractionDigits?` (2), `maximumFractionDigits?` (2) | Formatted number via `Intl.NumberFormat` |
| `DateTableCell`   | `value` (string/Date/null)                                                     | Formatted date, `'--/--/----'` for null  |
| `BadgeTableCell`  | `variant`, `children`, plus `TableCell` props                                  | Badge inside table cell                  |
| `ActionTableCell` | `children`, plus `TableCell` props                                             | Flex container with `gap-2`              |
| `LinkTableCell`   | `value`, `link`, plus `TableCell` props                                        | Truncated link text                      |

## Skeleton (`components/<Entity>Skeleton.tsx`)

Shared by both Edit and View pages. Wraps field skeletons inside `FormSkeleton` (from `@/components/FormCard`), matching the form layout.

```tsx
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormSkeleton } from '@/components/FormCard';

export function <Entity>Skeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
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
        {/* Use FieldSeparator + date fields for read-only date sections */}
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Updated At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormSkeleton>
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

## Add Form (`components/<Entity>AddForm.tsx`)

Form renders `FormCard` directly with title, description, fields, and callbacks. `FormCard` handles the Card, header, content, footer, and form ID internally via `useId()`.

Use `FieldGroup` to wrap all controllers and `FieldSeparator` between logical sections.

```tsx
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { add<Entity>Schema, type Add<Entity> } from '#/features/<entities>/schemas';
import { FormCard } from '@/components/FormCard';

type <Entity>AddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Add<Entity>>;
  onCancel: () => void;
};

export function <Entity>AddForm({
  isPending,
  onSubmit,
  onCancel,
}: <Entity>AddFormProps) {
  const form = useForm<Add<Entity>>({
    resolver: zodResolver(add<Entity>Schema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save <Entity>"
      isPending={isPending}
      title="Add <Entity>"
      description="Create a new <entity>."
    >
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
    </FormCard>
  );
}
```

## Edit Form — Simple (`components/<Entity>EditForm.tsx`)

Same structure as Add but receives entity data as `defaultValues`. For features without state transitions (no toolbar, no status).

```tsx
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  edit<Entity>Schema,
  type Edit<Entity>,
  type <Entity>,
} from '#/features/<entities>/schemas';
import { FormCard } from '@/components/FormCard';

type <Entity>EditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
  onCancel: () => void;
  <entity>: <Entity>;
};

export function <Entity>EditForm({
  isPending,
  onSubmit,
  onCancel,
  <entity>,
}: <Entity>EditFormProps) {
  const form = useForm<Edit<Entity>>({
    resolver: zodResolver(edit<Entity>Schema),
    defaultValues: <entity>,
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save <Entity>"
      isPending={isPending}
      title="Edit <Entity>"
      description="Update <entity> details."
    >
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
    </FormCard>
  );
}
```

## Edit Form — With State Transitions (`components/<Entity>EditForm.tsx`)

For features with workflow states, the edit form adds: `readOnly` toggle based on status, `renderTitleSuffix` for status badge, `renderAction` for toolbar, and read-only date fields after a `FieldSeparator`.

```tsx
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import {
  edit<Entity>Schema,
  type <Entity>,
  type Edit<Entity>,
  type Confirm<Entity>,
} from '#/features/<entities>/schemas';
import { FormCard } from '@/components/FormCard';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { StatusBadge } from '@/components/StatusBadge';
import { <Entity>Toolbar } from './<Entity>Toolbar';
import { getStatusVariant } from '../utils/status-variants';

type <Entity>EditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
  onCancel: () => void;
  <entity>: <Entity>;
  on<Entity>Confirm: (data: Confirm<Entity>) => Promise<void> | void;
  on<Entity>Cancel: () => Promise<void> | void;
  // ... other action callbacks
};

export function <Entity>EditForm({
  isPending,
  onSubmit,
  onCancel,
  <entity>,
  on<Entity>Confirm,
  on<Entity>Cancel,
}: <Entity>EditFormProps) {
  const isEditable = <entity>.status === 'Pending';

  const form = useForm<Edit<Entity>>({
    resolver: zodResolver(edit<Entity>Schema),
    defaultValues: {
      currency: <entity>.currency,
      total: Number(<entity>.total),
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isEditable}
      onCancel={onCancel}
      saveText="Save <Entity>"
      isPending={isPending}
      title="Edit <Entity>"
      description="Update <entity> details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(<entity>.status)}
          status={<entity>.status}
        />
      }
      renderAction={
        <<Entity>Toolbar
          status={<entity>.status}
          isPending={isPending}
          onConfirm={on<Entity>Confirm}
          onCancel={on<Entity>Cancel}
        />
      }
    >
      <FieldGroup>
        {/* Editable fields — disabled when !isEditable */}
        <Controller
          name="total"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="total">Total</FieldLabel>
              <Input
                {...field}
                id="total"
                type="number"
                step="0.01"
                value={field.value ?? ''}
                onChange={e => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
                placeholder="0.00"
                disabled={isPending || !isEditable}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Read-only date section */}
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={<entity>.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Confirmed At</FieldLabel>
            <DateReadOnlyField value={<entity>.confirmedAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
```

Key differences from the simple edit form:

- `readOnly={!isEditable}` — hides Save button and wraps children in `<div>` instead of `<form>`
- `renderTitleSuffix` — shows status badge next to the title
- `renderAction` — shows toolbar with action buttons in the header
- Editable fields use `disabled={isPending || !isEditable}`
- Read-only date fields use `DateReadOnlyField` after a `FieldSeparator`

## View Card (`components/<Entity>ViewCard.tsx`)

Read-only display using `FormCard` without `onSubmit`. Uses `renderAction` to show an Edit button in the header.

```tsx
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { <Entity> } from '#/features/<entities>/schemas';
import { FormCard } from '@/components/FormCard';
import { EditButton } from '@/components/EditButton';

type <Entity>ViewCardProps = {
  <entity>: <Entity>;
  onCancel: () => void;
};

export function <Entity>ViewCard({ <entity>, onCancel }: <Entity>ViewCardProps) {
  return (
    <FormCard
      onCancel={onCancel}
      title="View <Entity>"
      description="View <entity> details."
      renderAction={
        <EditButton
          text="Edit"
          link={`/<entities>/${<entity>.<entityId>}/edit`}
        />
      }
    >
      <FieldGroup>
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
      </FieldGroup>
    </FormCard>
  );
}
```

Note: When `FormCard` has no `onSubmit`, it renders children inside a `<div>` and shows only the Cancel button in the footer.

## Searchable Combobox (`components/<Entity>Combobox.tsx`)

When an entity is referenced as a foreign key in other features' forms, create a searchable combobox. Uses the shared `SearchCombobox` component with a `useQuery` (non-Suspense) hook and debounced search.

```tsx
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { use<Entities> } from '../stores/use<Entities>';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function <Entity>Combobox({ value, onChange, disabled, label }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = use<Entities>({
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
      defaultLabel="Select <entity>..."
      searchPlaceholder="Search <entities>..."
      errorMessage="Failed to load <entities>. Please try again."
      emptyMessage="No <entities> found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={item => item.<entityId>}
      getItemLabel={item => item.name}
      renderItem={item => <span className="font-medium">{item.name}</span>}
    />
  );
}
```

Key features:

- 300ms debounce on search input via `use-debounce`
- Only fetches when popover opens (`enabled: open`)
- Display text managed internally by `SearchCombobox` (shows label from `getItemLabel`, not UUID)
- Clear button (X) built into `SearchCombobox`
- Loading, error, and empty states handled by `SearchCombobox`
- Server-side filtering via the query hook

## Action Components

For state transitions (confirm, cancel, approve, etc.), create action components that wrap shared dialog components. Action components follow the naming pattern `<Entity>{Action}Action.tsx`.

### Form action — `UncontrolledFormDialog` (`components/<Entity>ConfirmAction.tsx`)

For actions that require additional data input (e.g., a date):

```tsx
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  confirm<Entity>Schema,
  type Confirm<Entity>,
} from '#/features/<entities>/schemas';

type <Entity>ConfirmActionProps = {
  disabled: boolean;
  isPending: boolean;
  onConfirm: (data: Confirm<Entity>) => Promise<void> | void;
};

export function <Entity>ConfirmAction({
  disabled,
  isPending,
  onConfirm,
}: <Entity>ConfirmActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={confirm<Entity>Schema}
      defaultValues={{ confirmedAt: today }}
      onSubmit={onConfirm}
      isPending={isPending}
      disabled={disabled}
      label="Confirm"
      saveLabel="Confirm"
      description="Enter the confirmation date to mark this <entity> as confirmed."
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <Controller
          name="confirmedAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmedAt">Confirmation Date</FieldLabel>
              <Input
                {...field}
                id="confirmedAt"
                type="date"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
```

### Confirm action — `UncontrolledConfirmDialog` (`components/<Entity>CancelAction.tsx`)

For destructive or no-data actions (just a confirmation prompt):

```tsx
import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type <Entity>CancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => Promise<void> | void;
};

export function <Entity>CancelAction({
  disabled,
  isPending,
  onCancel,
}: <Entity>CancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this <entity>? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
```

### Upload action — `UncontrolledFileUploadDialog` (`components/<Entity>UploadAction.tsx`)

For file upload actions:

```tsx
import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type <Entity>UploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function <Entity>UploadAction({
  disabled,
  isPending,
  onUpload,
}: <Entity>UploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this <entity>."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
```

### Action component props pattern

All action components have consistent, minimal props:

```ts
type <Entity>{Action}ActionProps = {
  disabled: boolean;       // Controls button state (toolbar computes this)
  isPending: boolean;      // Shows loading state
  on{Action}: (...) => Promise<void> | void;  // Callback with typed data
};
```

Action components do NOT manage error handling, toasts, or navigation — those stay in the page's inner component.

## Toolbar (`components/<Entity>Toolbar.tsx`)

For features with multiple state transition actions, create a toolbar that composes action components and handles conditional enabling based on entity status.

```tsx
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Confirm<Entity> } from '#/features/<entities>/schemas';
import { <Entity>ConfirmAction } from './<Entity>ConfirmAction';
import { <Entity>CancelAction } from './<Entity>CancelAction';
import { <Entity>UploadAction } from './<Entity>UploadAction';

type <Entity>ToolbarProps = {
  status: string;
  isPending: boolean;
  onConfirm: (data: Confirm<Entity>) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onUpload: (file: File) => Promise<void> | void;
  onDownload: () => void;
};

export function <Entity>Toolbar({
  status,
  isPending,
  onConfirm,
  onCancel,
  onUpload,
  onDownload,
}: <Entity>ToolbarProps) {
  const canConfirm = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Confirmed';

  return (
    <>
      <<Entity>ConfirmAction
        disabled={!canConfirm}
        isPending={isPending}
        onConfirm={onConfirm}
      />

      <<Entity>CancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />

      <<Entity>UploadAction
        disabled={!canUpload}
        isPending={isPending}
        onUpload={onUpload}
      />

      <Button
        type="button"
        onClick={onDownload}
        disabled={isPending}
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </>
  );
}
```

Key points:

- Toolbar renders as a fragment (`<>...</>`) — `FormCard` wraps it in a flex container via `renderAction`
- Computes `can{Action}` booleans from `status` to disable/enable action components
- Receives raw callback functions and passes them to action components
- Regular buttons (e.g., download) are inline, not wrapped in dialog components

## Delete Confirmation

For deletion, use `UncontrolledConfirmDialog` (if triggered by a button) or `ControlledConfirmDialog` (if controlled by parent state, e.g., from a table row).

### Uncontrolled (button trigger)

```tsx
import { Trash2 } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type Delete<Entity>ActionProps = {
  disabled: boolean;
  isPending: boolean;
  onDelete: () => Promise<void> | void;
};

export function Delete<Entity>Action({
  disabled,
  isPending,
  onDelete,
}: Delete<Entity>ActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Delete"
      description="Are you sure you want to delete this <entity>? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onDelete}
      icon={<Trash2 className="h-4 w-4 mr-2" />}
    />
  );
}
```

### Controlled (parent manages open state)

For table row deletion where the parent manages which item is selected:

```tsx
import { ControlledConfirmDialog } from '@/components/ControlledConfirmDialog';

// In table/section component:
const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
const deleteMutation = useDelete<Entity>();

// In table row action:
<Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ id: item.<entityId>, name: item.name })}>
  <Trash2 className="h-4 w-4" />
</Button>

// Outside table:
<ControlledConfirmDialog
  label={`Delete ${deleteTarget?.name ?? ''}`}
  description="Are you sure? This action cannot be undone."
  isPending={deleteMutation.isPending}
  open={!!deleteTarget}
  onOpenChange={open => { if (!open) setDeleteTarget(null); }}
  onConfirm={async () => {
    await deleteMutation.mutateAsync({ <entityId>: deleteTarget!.id });
    toast.success('<Entity> deleted successfully');
    setDeleteTarget(null);
  }}
/>
```

## Status Variants (`utils/status-variants.ts`)

For features with workflow states, create a status-to-badge-variant mapping file:

```ts
import type { BadgeProps } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, BadgeProps['variant']> = {
  Pending: 'default',
  Confirmed: 'outline',
  Paid: 'secondary',
  Canceled: 'destructive',
};

export function getStatusVariant(status: string): BadgeProps['variant'] {
  return STATUS_VARIANTS[status] || 'secondary';
}
```

Usage in forms (via `renderTitleSuffix`):

```tsx
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

<FormCard
  renderTitleSuffix={
    <StatusBadge variant={getStatusVariant(entity.status)} status={entity.status} />
  }
>
```

Usage in tables:

```tsx
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { getStatusVariant } from '../utils/status-variants';

<BadgeTableCell variant={getStatusVariant(item.status)}>
  {item.status}
</BadgeTableCell>;
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
