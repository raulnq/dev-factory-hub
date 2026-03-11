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
  type IssueTransaction,
  type Transaction,
} from '#/features/transactions/schemas';
import { FormCard } from '@/components/FormCard';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';
import { TransactionToolbar } from './TransactionToolbar';
import { getStatusVariant } from '../utils/status-variants';
import { StatusBadge } from '@/components/StatusBadge';

const TRANSACTION_TYPES = ['Income', 'Outcome'];

type EditTransactionFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTransaction>;
  onCancel: () => void;
  transaction: Transaction;
  onTransactionIssue: (data: IssueTransaction) => Promise<void> | void;
  onTransactionCancel: () => Promise<void> | void;
  onTransactionUpload: (file: File) => Promise<void> | void;
  onTransactionDownload: () => void;
};

export function EditTransactionForm({
  isPending,
  onSubmit,
  onCancel,
  transaction,
  onTransactionIssue,
  onTransactionCancel,
  onTransactionUpload,
  onTransactionDownload,
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

  const [subtotal, taxes] = form.watch(['subtotal', 'taxes']);
  const total = isStatusPending
    ? (Number(subtotal) + Number(taxes)).toFixed(2)
    : transaction.total.toFixed(2);

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isStatusPending}
      onCancel={onCancel}
      saveText="Save Transaction"
      isPending={isPending}
      title={`Edit Transaction`}
      description="Update transaction details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(transaction.status)}
          status={transaction.status}
        />
      }
      renderAction={
        <TransactionToolbar
          status={transaction.status}
          filePath={transaction.filePath}
          isPending={isPending}
          onIssue={onTransactionIssue}
          onCancel={onTransactionCancel}
          onUpload={onTransactionUpload}
          onDownload={onTransactionDownload}
        />
      }
    >
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
                <CurrencySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  id="currency"
                  disabled={isPending || !isStatusPending}
                />
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
            <DateReadOnlyField value={transaction.issuedAt} />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={transaction.createdAt} />
          </Field>
        </div>
        <Field>
          <FieldLabel>Canceled At</FieldLabel>
          <DateReadOnlyField value={transaction.canceledAt} />
        </Field>
      </FieldGroup>
    </FormCard>
  );
}
