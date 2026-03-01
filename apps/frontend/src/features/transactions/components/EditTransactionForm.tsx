import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  editTransactionSchema,
  type EditTransaction,
  type Transaction,
} from '#/features/transactions/schemas';
import { FormCardContent } from '@/components/FormCardContent';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PEN', 'ARS', 'CLP', 'COP', 'MXN'];
const TRANSACTION_TYPES = ['Income', 'Outcome'];

type EditTransactionFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTransaction>;
  transaction: Transaction;
};

export function EditTransactionForm({
  isPending,
  onSubmit,
  transaction,
}: EditTransactionFormProps) {
  const isStatusPending = transaction.status === 'Pending';

  const form = useForm<EditTransaction>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      description: transaction.description,
      currency: transaction.currency,
      type: transaction.type,
      subtotal: transaction.subtotal,
      taxes: transaction.taxes,
    },
  });

  const subtotal = form.watch('subtotal') ?? 0;
  const taxes = form.watch('taxes') ?? 0;
  const total = isStatusPending
    ? (Number(subtotal) + Number(taxes)).toFixed(2)
    : transaction.total.toFixed(2);

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                rows={3}
                aria-invalid={fieldState.invalid}
                placeholder="Transaction description"
                disabled={isPending || !isStatusPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !isStatusPending}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPES.map(t => (
                      <SelectItem key={t} value={t}>
                        {t}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
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
            <FieldLabel>Number</FieldLabel>
            <Input value={transaction.number ?? '—'} disabled />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Input value={transaction.issuedAt ?? '—'} disabled />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input value={transaction.createdAt.toLocaleString()} disabled />
          </Field>
        </div>
        <Field>
          <FieldLabel>Canceled At</FieldLabel>
          <Input
            value={
              transaction.canceledAt
                ? transaction.canceledAt.toLocaleString()
                : '—'
            }
            disabled
          />
        </Field>
      </FieldGroup>
    </FormCardContent>
  );
}
