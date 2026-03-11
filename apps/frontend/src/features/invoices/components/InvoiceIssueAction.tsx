import { CheckCircle } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  issueInvoiceSchema,
  type IssueInvoice,
} from '#/features/invoices/schemas';

type InvoiceIssueActionProps = {
  disabled: boolean;
  isPending: boolean;
  onIssue: (data: IssueInvoice) => Promise<void> | void;
};

export function InvoiceIssueAction({
  disabled,
  isPending,
  onIssue,
}: InvoiceIssueActionProps) {
  return (
    <UncontrolledFormDialog
      label="Issue"
      saveLabel="Issue"
      description="Enter the invoice details to issue it."
      schema={issueInvoiceSchema}
      defaultValues={{
        issuedAt: new Date().toISOString().split('T')[0],
        exchangeRate: 1,
        number: '',
      }}
      onSubmit={onIssue}
      isPending={isPending}
      disabled={disabled}
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <>
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
            name="exchangeRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="exchangeRate">Exchange Rate</FieldLabel>
                <Input
                  {...field}
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="1.0000"
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
                <FieldLabel htmlFor="number">Invoice Number</FieldLabel>
                <Input
                  {...field}
                  id="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="INV-001"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}
    </UncontrolledFormDialog>
  );
}
