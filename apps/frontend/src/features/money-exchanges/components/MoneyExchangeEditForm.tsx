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
  editMoneyExchangeSchema,
  type EditMoneyExchange,
  type IssueMoneyExchange,
  type MoneyExchange,
} from '#/features/money-exchanges/schemas';
import { FormCard } from '@/components/FormCard';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';
import { MoneyExchangeToolbar } from './MoneyExchangeToolbar';
import { getStatusVariant } from '../utils/status-variants';
import { StatusBadge } from '@/components/StatusBadge';

type MoneyExchangeEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditMoneyExchange>;
  onCancel: () => void;
  moneyExchange: MoneyExchange;
  onMoneyExchangeIssue: (data: IssueMoneyExchange) => Promise<void> | void;
  onMoneyExchangeCancel: () => Promise<void> | void;
  onMoneyExchangeUpload: (file: File) => Promise<void> | void;
  onMoneyExchangeDownload: () => void;
};

export function MoneyExchangeEditForm({
  isPending,
  onSubmit,
  onCancel,
  moneyExchange,
  onMoneyExchangeIssue,
  onMoneyExchangeCancel,
  onMoneyExchangeUpload,
  onMoneyExchangeDownload,
}: MoneyExchangeEditFormProps) {
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
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isStatusPending}
      onCancel={onCancel}
      saveText="Save Money Exchange"
      isPending={isPending}
      title="Edit Money Exchange"
      description="Update money exchange details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(moneyExchange.status)}
          status={moneyExchange.status}
        />
      }
      renderAction={
        <MoneyExchangeToolbar
          status={moneyExchange.status}
          filePath={moneyExchange.filePath}
          isPending={isPending}
          onIssue={onMoneyExchangeIssue}
          onCancel={onMoneyExchangeCancel}
          onUpload={onMoneyExchangeUpload}
          onDownload={onMoneyExchangeDownload}
        />
      }
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
                  disabled={isPending || !isStatusPending}
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
                  disabled={isPending || !isStatusPending}
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
            <DateReadOnlyField value={moneyExchange.issuedAt} />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={moneyExchange.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <DateReadOnlyField value={moneyExchange.canceledAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
