import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  addTaxPaymentItemSchema,
  type AddTaxPaymentItem,
} from '#/features/tax-payments/schemas';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';

const ITEM_TYPES = [
  'ESSALUD',
  'REGIMENMYPE',
  'CUARTACATEGORIA',
  'RENTA',
] as const;

type AddTaxPaymentItemButtonProps = {
  onAdd: (data: AddTaxPaymentItem) => void;
  isPending: boolean;
};

export function AddTaxPaymentItemButton({
  onAdd,
  isPending,
}: AddTaxPaymentItemButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={addTaxPaymentItemSchema}
      defaultValues={{ type: 'ESSALUD', amount: 0 }}
      onSubmit={onAdd}
      isPending={isPending}
      label="Add Item"
      saveLabel="Save Item"
      description="Add a new item to this tax payment."
      icon={<Plus className="h-4 w-4 mr-1" />}
    >
      {form => (
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_TYPES.map(t => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  min="0"
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
