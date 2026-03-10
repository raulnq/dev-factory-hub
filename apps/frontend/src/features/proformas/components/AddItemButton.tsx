import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addProformaItemSchema,
  type AddProformaItem,
} from '#/features/proformas/schemas';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';

type AddItemButtonProps = {
  onAdd: (data: AddProformaItem) => void;
  isPending: boolean;
};

export function AddItemButton({ onAdd, isPending }: AddItemButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={addProformaItemSchema}
      defaultValues={{ description: '', amount: 0 }}
      onSubmit={onAdd}
      isPending={isPending}
      label="Add Item"
      saveLabel="Save Item"
      description="Add a new item to this proforma."
      icon={<Plus className="h-4 w-4 mr-1" />}
    >
      {form => (
        <FieldGroup>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="Description"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  {...field}
                  id="amount"
                  type="number"
                  step="0.01"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      )}
    </UncontrolledFormDialog>
  );
}
