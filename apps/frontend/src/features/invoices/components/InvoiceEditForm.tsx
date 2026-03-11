import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
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
import { FormCard } from '@/components/FormCard';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';
import { InvoiceToolbar } from './InvoiceToolbar';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';
import { type IssueInvoice } from '#/features/invoices/schemas';

type InvoiceEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditInvoice>;
  onCancel: () => void;
  invoice: Invoice;
  onInvoiceCancel: () => void;
  onInvoiceIssue: (data: IssueInvoice) => void;
};

export function InvoiceEditForm({
  isPending,
  onSubmit,
  onCancel,
  invoice,
  onInvoiceCancel,
  onInvoiceIssue,
}: InvoiceEditFormProps) {
  const isStatusPending = invoice.status === 'Pending';

  const form = useForm<EditInvoice>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      currency: invoice.currency,
      subtotal: invoice.subtotal,
      taxes: invoice.taxes,
    },
  });

  const [subtotal, taxes] = form.watch(['subtotal', 'taxes']);
  const total = isStatusPending
    ? (Number(subtotal) + Number(taxes)).toFixed(2)
    : invoice.total.toFixed(2);

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isStatusPending}
      onCancel={onCancel}
      saveText="Save Invoice"
      isPending={isPending}
      title={`Edit Invoice`}
      description="Update invoice details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(invoice.status)}
          status={invoice.status}
        />
      }
      renderAction={
        <InvoiceToolbar
          status={invoice.status}
          isPending={isPending}
          onIssue={onInvoiceIssue}
          onCancel={onInvoiceCancel}
          total={Number(total)}
        />
      }
    >
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
              <CurrencySelect
                value={field.value}
                onValueChange={field.onChange}
                id="currency"
                disabled={isPending || !isStatusPending}
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
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input value={invoice.number ?? '—'} disabled />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <DateReadOnlyField value={invoice.issuedAt} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={invoice.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <DateReadOnlyField value={invoice.canceledAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
