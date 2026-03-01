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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PEN', 'ARS', 'CLP', 'COP', 'MXN'];

type EditTaxPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTaxPayment>;
  taxPayment: TaxPayment;
};

export function EditTaxPaymentForm({
  taxPayment,
  onSubmit,
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
      formId="tax-payment-form"
      onSubmit={form.handleSubmit(onSubmit)}
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || !isStatusPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
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
            <Input value={taxPayment.createdAt.toLocaleDateString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <Input
              value={taxPayment.paidAt?.toLocaleDateString() ?? ''}
              disabled
            />
          </Field>
          <Field>
            <FieldLabel>Cancelled At</FieldLabel>
            <Input
              value={taxPayment.cancelledAt?.toLocaleDateString() ?? ''}
              disabled
            />
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
