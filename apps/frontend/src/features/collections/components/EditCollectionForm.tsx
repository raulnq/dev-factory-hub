import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editCollectionSchema,
  type Collection,
  type EditCollection,
} from '#/features/collections/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EditCollectionFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollection>;
  collection: Collection;
};

export function EditCollectionForm({
  isPending,
  onSubmit,
  collection,
}: EditCollectionFormProps) {
  const isEditable = collection.status === 'Pending';

  const form = useForm<EditCollection>({
    resolver: zodResolver(editCollectionSchema),
    defaultValues: {
      currency: collection.currency,
      total: Number(collection.total),
      commission: Number(collection.commission),
      taxes: Number(collection.taxes),
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Client</FieldLabel>
            <Input value={collection.clientName ?? ''} disabled />
          </Field>

          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Currency</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || !isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="PEN">PEN</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
                  min="0"
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

          <Controller
            name="commission"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="commission">Commission</FieldLabel>
                <Input
                  {...field}
                  id="commission"
                  type="number"
                  step="0.01"
                  min="0"
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

          <Controller
            name="taxes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="taxes">Taxes</FieldLabel>
                <Input
                  {...field}
                  id="taxes"
                  type="number"
                  step="0.01"
                  min="0"
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
        </div>

        <FieldSeparator />

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input value={collection.createdAt.toLocaleString()} disabled />
          </Field>

          <Field>
            <FieldLabel>Confirmed At</FieldLabel>
            <Input value={collection.confirmedAt ?? ''} disabled />
          </Field>

          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Input
              value={
                collection.canceledAt
                  ? collection.canceledAt.toLocaleString()
                  : ''
              }
              disabled
            />
          </Field>
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
