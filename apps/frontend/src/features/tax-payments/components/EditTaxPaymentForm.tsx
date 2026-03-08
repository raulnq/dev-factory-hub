import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editTaxPaymentSchema,
  type EditTaxPayment,
  type TaxPayment,
} from '#/features/tax-payments/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';

type EditTaxPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTaxPayment>;
  onCancel: () => void;
  taxPayment: TaxPayment;
};

export function EditTaxPaymentForm({
  taxPayment,
  onSubmit,
  onCancel,
  isPending,
}: EditTaxPaymentFormProps) {
  const isStatusPending = taxPayment.status === 'Pending';
  const form = useForm<EditTaxPayment>({
    resolver: zodResolver(editTaxPaymentSchema),
    defaultValues: {
      currency: taxPayment.currency,
      taxes: Number(taxPayment.taxes),
    },
  });

  return (
    <FormCardContent
      formId={isStatusPending ? 'tax-payment-form' : undefined}
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      isPending={isPending}
      saveText="Save Tax Payment"
      cancelText={isStatusPending ? 'Cancel' : 'Back'}
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
    </FormCardContent>
  );
}
