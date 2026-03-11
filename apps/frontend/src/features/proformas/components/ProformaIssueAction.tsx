import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import {
  issueProformaSchema,
  type IssueProforma,
} from '#/features/proformas/schemas';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';

type ProformaIssueActionProps = {
  onIssue: (data: IssueProforma) => void;
  isPending: boolean;
  disabled: boolean;
};

export function ProformaIssueAction({
  onIssue,
  isPending,
  disabled,
}: ProformaIssueActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={issueProformaSchema}
      defaultValues={{ issuedAt: today }}
      formId="issue-proforma-form"
      onSubmit={onIssue}
      isPending={isPending}
      disabled={disabled}
      label="Issue"
      saveLabel="Issue"
      description="Select the date this proforma was issued."
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
