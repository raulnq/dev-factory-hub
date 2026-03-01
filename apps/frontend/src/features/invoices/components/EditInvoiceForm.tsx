import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  editInvoiceSchema,
  type EditInvoice,
  type Invoice,
} from '#/features/invoices/schemas';
import { FormCardContent } from '@/components/FormCardContent';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PEN', 'ARS', 'CLP', 'COP', 'MXN'];

type EditInvoiceFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditInvoice>;
  invoice: Invoice;
};

export function EditInvoiceForm({
  isPending,
  onSubmit,
  invoice,
}: EditInvoiceFormProps) {
  const isStatusPending = invoice.status === 'Pending';

  const form = useForm<EditInvoice>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      currency: invoice.currency,
      subtotal: invoice.subtotal,
      taxes: invoice.taxes,
    },
  });

  const subtotal = form.watch('subtotal') ?? 0;
  const taxes = form.watch('taxes') ?? 0;
  const total = isStatusPending
    ? (Number(subtotal) + Number(taxes)).toFixed(2)
    : invoice.total.toFixed(2);

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Client</FieldLabel>
          <Input value={invoice.clientName ?? ''} disabled />
        </Field>
        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending || !isStatusPending}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
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
        <FieldSeparator />
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Exchange Rate</FieldLabel>
            <Input
              value={
                invoice.exchangeRate != null
                  ? invoice.exchangeRate.toFixed(4)
                  : '—'
              }
              disabled
            />
          </Field>
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input value={invoice.number ?? '—'} disabled />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Input value={invoice.issuedAt ?? '—'} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input value={invoice.createdAt.toLocaleString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Input
              value={
                invoice.canceledAt ? invoice.canceledAt.toLocaleString() : '—'
              }
              disabled
            />
          </Field>
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
