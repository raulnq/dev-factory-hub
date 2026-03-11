import { CheckCircle } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  issueTransactionSchema,
  type IssueTransaction,
} from '#/features/transactions/schemas';

type TransactionIssueActionProps = {
  disabled: boolean;
  isPending: boolean;
  onIssue: (data: IssueTransaction) => Promise<void> | void;
};

export function TransactionIssueAction({
  disabled,
  isPending,
  onIssue,
}: TransactionIssueActionProps) {
  return (
    <UncontrolledFormDialog
      label="Issue"
      saveLabel="Issue"
      description="Enter the issue date and number to mark this transaction as issued."
      schema={issueTransactionSchema}
      defaultValues={{
        issuedAt: new Date().toISOString().split('T')[0],
        number: '',
      }}
      onSubmit={onIssue}
      isPending={isPending}
      disabled={disabled}
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <div className="space-y-4">
          <Controller
            name="issuedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="issuedAt">Issue Date</FieldLabel>
                <Input
                  {...field}
                  id="issuedAt"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="issueNumber">Number</FieldLabel>
                <Input
                  {...field}
                  id="issueNumber"
                  aria-invalid={fieldState.invalid}
                  placeholder="TXN-001"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
    </UncontrolledFormDialog>
  );
}
