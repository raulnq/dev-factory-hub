import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addExchangeRateSchema,
  type AddExchangeRate,
} from '#/features/exchange-rates/schemas';
import { FormCard } from '@/components/FormCard';
import { CurrencySelect } from '@/components/CurrencySelect';

type ExchangeRateAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddExchangeRate>;
  onCancel: () => void;
};

export function ExchangeRateAddForm({
  isPending,
  onSubmit,
  onCancel,
}: ExchangeRateAddFormProps) {
  const form = useForm<AddExchangeRate>({
    resolver: zodResolver(addExchangeRateSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      fromCurrency: 'USD',
      toCurrency: 'USD',
      rate: 0,
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Exchange Rate"
      isPending={isPending}
      title="Add Exchange Rate"
      description="Create a new exchange rate."
    >
      <FieldGroup>
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input
                {...field}
                id="date"
                type="date"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="fromCurrency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fromCurrency">From Currency</FieldLabel>
                <CurrencySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  id="fromCurrency"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="toCurrency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="toCurrency">To Currency</FieldLabel>
                <CurrencySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  id="toCurrency"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="rate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="rate">Rate</FieldLabel>
              <Input
                {...field}
                id="rate"
                type="number"
                step="0.0001"
                value={field.value ?? ''}
                onChange={e => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
                placeholder="0.0000"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FormCard>
  );
}
