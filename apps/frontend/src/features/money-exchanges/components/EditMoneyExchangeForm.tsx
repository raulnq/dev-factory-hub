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
  editMoneyExchangeSchema,
  type EditMoneyExchange,
  type MoneyExchange,
} from '#/features/money-exchanges/schemas';
import { FormCardContent } from '@/components/FormCardContent';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PEN', 'ARS', 'CLP', 'COP', 'MXN'];

type EditMoneyExchangeFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditMoneyExchange>;
  moneyExchange: MoneyExchange;
};

export function EditMoneyExchangeForm({
  isPending,
  onSubmit,
  moneyExchange,
}: EditMoneyExchangeFormProps) {
  const isStatusPending = moneyExchange.status === 'Pending';

  const form = useForm<EditMoneyExchange>({
    resolver: zodResolver(editMoneyExchangeSchema),
    defaultValues: {
      fromCurrency: moneyExchange.fromCurrency,
      toCurrency: moneyExchange.toCurrency,
      rate: moneyExchange.rate,
      fromAmount: moneyExchange.fromAmount,
      toAmount: moneyExchange.toAmount,
      fromTaxes: moneyExchange.fromTaxes,
      toTaxes: moneyExchange.toTaxes,
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="fromCurrency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fromCurrency">From Currency</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !isStatusPending}
                >
                  <SelectTrigger id="fromCurrency">
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !isStatusPending}
                >
                  <SelectTrigger id="toCurrency">
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
                disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <FieldSeparator />
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Input value={moneyExchange.issuedAt ?? '—'} disabled />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input value={moneyExchange.createdAt.toLocaleString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Input
              value={
                moneyExchange.canceledAt
                  ? moneyExchange.canceledAt.toLocaleString()
                  : '—'
              }
              disabled
            />
          </Field>
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
