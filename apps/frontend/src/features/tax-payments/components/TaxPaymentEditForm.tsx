import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editTaxPaymentSchema,
  type EditTaxPayment,
  type PayTaxPayment,
  type TaxPayment,
} from '#/features/tax-payments/schemas';
import { FormCard } from '@/components/FormCard';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';
import { TaxPaymentToolbar } from './TaxPaymentToolbar';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

type TaxPaymentEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTaxPayment>;
  onCancel: () => void;
  taxPayment: TaxPayment;
  onTaxPaymentPay: (data: PayTaxPayment) => void;
  onTaxPaymentCancel: () => void;
};

export function TaxPaymentEditForm({
  taxPayment,
  onSubmit,
  onCancel,
  isPending,
  onTaxPaymentPay,
  onTaxPaymentCancel,
}: TaxPaymentEditFormProps) {
  const isStatusPending = taxPayment.status === 'Pending';
  const form = useForm<EditTaxPayment>({
    resolver: zodResolver(editTaxPaymentSchema),
    defaultValues: {
      currency: taxPayment.currency,
      taxes: Number(taxPayment.taxes),
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isStatusPending}
      onCancel={onCancel}
      isPending={isPending}
      saveText="Save Tax Payment"
      title={`Edit Tax Payment`}
      description="Update tax payment details."
      renderTitleSuffix={
        taxPayment.status && (
          <StatusBadge
            variant={getStatusVariant(taxPayment.status)}
            status={taxPayment.status}
          />
        )
      }
      renderAction={
        <TaxPaymentToolbar
          onCancel={onTaxPaymentCancel}
          onPay={onTaxPaymentPay}
          isPending={isPending}
          status={taxPayment.status}
        />
      }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Year</FieldLabel>
            <Input value={taxPayment.year} disabled />
          </Field>
          <Field>
            <FieldLabel>Month</FieldLabel>
            <Input value={taxPayment.month} disabled />
          </Field>

          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Currency</FieldLabel>
                <CurrencySelect
                  onValueChange={field.onChange}
                  value={field.value}
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
                  min="0"
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
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input value={taxPayment.number ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={taxPayment.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <DateReadOnlyField value={taxPayment.paidAt} />
          </Field>
          <Field>
            <FieldLabel>Cancelled At</FieldLabel>
            <DateReadOnlyField value={taxPayment.cancelledAt} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Input value={taxPayment.total} disabled />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
