import { CheckCircle } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  issueMoneyExchangeSchema,
  type IssueMoneyExchange,
} from '#/features/money-exchanges/schemas';

type MoneyExchangeIssueActionProps = {
  disabled: boolean;
  isPending: boolean;
  onIssue: (data: IssueMoneyExchange) => Promise<void> | void;
};

export function MoneyExchangeIssueAction({
  disabled,
  isPending,
  onIssue,
}: MoneyExchangeIssueActionProps) {
  return (
    <UncontrolledFormDialog
      label="Issue"
      saveLabel="Issue"
      description="Enter the issue date to mark this money exchange as issued."
      schema={issueMoneyExchangeSchema}
      defaultValues={{
        issuedAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onIssue}
      isPending={isPending}
      disabled={disabled}
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
