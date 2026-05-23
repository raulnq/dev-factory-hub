import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addTaxPaymentSchema,
  type AddTaxPayment,
} from '#/features/tax-payments/schemas';
import { FormCard } from '@/components/FormCard';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CurrencySelect } from '@/components/CurrencySelect';
import { MonthSelect } from '@/components/MonthSelect';
import { YearSelect } from '@/components/YearSelect';

const currentYear = new Date().getFullYear();

type TaxPaymentAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddTaxPayment>;
  onCancel: () => void;
};

export function TaxPaymentAddForm({
  onSubmit,
  onCancel,
  isPending,
}: TaxPaymentAddFormProps) {
  const form = useForm<AddTaxPayment>({
    resolver: zodResolver(addTaxPaymentSchema),
    defaultValues: {
      year: currentYear,
      month: new Date().getMonth() + 1,
      currency: 'USD',
      taxes: 0,
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      isPending={isPending}
      saveText="Save Tax Payment"
      title="Add Tax Payment"
      description="Create a new tax payment."
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="year"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Year</FieldLabel>
                <YearSelect
                  value={String(field.value)}
                  onValueChange={v => field.onChange(Number(v))}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="month"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Month</FieldLabel>
                <MonthSelect
                  value={String(field.value)}
                  onValueChange={v => field.onChange(Number(v))}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Currency</FieldLabel>
                <CurrencySelect
                  onValueChange={field.onChange}
                  value={field.value}
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
        </div>
      </FieldGroup>
    </FormCard>
  );
}
