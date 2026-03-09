import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addMoneyExchangeSchema,
  type AddMoneyExchange,
} from '#/features/money-exchanges/schemas';
import { FormCard } from '@/components/FormCard';
import { CurrencySelect } from '@/components/CurrencySelect';

type AddMoneyExchangeFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddMoneyExchange>;
  onCancel: () => void;
};

export function AddMoneyExchangeForm({
  isPending,
  onSubmit,
  onCancel,
}: AddMoneyExchangeFormProps) {
  const form = useForm<AddMoneyExchange>({
    resolver: zodResolver(addMoneyExchangeSchema),
    defaultValues: {
      fromCurrency: 'USD',
      toCurrency: 'USD',
      rate: 0,
      fromAmount: 0,
      toAmount: 0,
      fromTaxes: 0,
      toTaxes: 0,
    },
  });

  return (
    <FormCard
      formId="form"
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Money Exchange"
      isPending={isPending}
      title="Add Money Exchange"
      description="Create a new money exchange."
    >
      <FieldGroup>
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
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="fromAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fromAmount">From Amount</FieldLabel>
                <Input
                  {...field}
                  id="fromAmount"
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
            name="toAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="toAmount">To Amount</FieldLabel>
                <Input
                  {...field}
                  id="toAmount"
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="fromTaxes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fromTaxes">From Taxes</FieldLabel>
                <Input
                  {...field}
                  id="fromTaxes"
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
            name="toTaxes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="toTaxes">To Taxes</FieldLabel>
                <Input
                  {...field}
                  id="toTaxes"
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
        </div>
      </FieldGroup>
    </FormCard>
  );
}
