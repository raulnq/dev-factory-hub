import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addInvoiceSchema, type AddInvoice } from '#/features/invoices/schemas';
import { FormCard } from '@/components/FormCard';
import { ClientCombobox } from '../../clients/components/ClientCombobox';
import { CurrencySelect } from '@/components/CurrencySelect';

type InvoiceAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddInvoice>;
  onCancel: () => void;
};

export function InvoiceAddForm({
  isPending,
  onSubmit,
  onCancel,
}: InvoiceAddFormProps) {
  const form = useForm<AddInvoice>({
    resolver: zodResolver(addInvoiceSchema),
    defaultValues: {
      clientId: '',
      currency: 'USD',
      subtotal: 0,
      taxes: 0,
    },
  });

  const [subtotal, taxes] = form.watch(['subtotal', 'taxes']);
  const total = (Number(subtotal) + Number(taxes)).toFixed(2);

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Invoice"
      title="Add Invoice"
      description="Create a new invoice."
      isPending={isPending}
    >
      <FieldGroup>
        <Controller
          name="clientId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Client</FieldLabel>
              <ClientCombobox
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <CurrencySelect
                value={field.value}
                onValueChange={field.onChange}
                id="currency"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="subtotal"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="subtotal">Subtotal</FieldLabel>
                <Input
                  {...field}
                  id="subtotal"
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
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Input value={total} disabled />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
