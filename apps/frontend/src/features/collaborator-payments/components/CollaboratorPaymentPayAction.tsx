import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  payCollaboratorPaymentSchema,
  type PayCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';

type CollaboratorPaymentPayActionProps = {
  disabled: boolean;
  isPending: boolean;
  onPay: (data: PayCollaboratorPayment) => void;
};

export function CollaboratorPaymentPayAction({
  disabled,
  isPending,
  onPay,
}: CollaboratorPaymentPayActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={payCollaboratorPaymentSchema}
      defaultValues={{ paidAt: today }}
      formId="pay-collaborator-payments-form"
      onSubmit={onPay}
      isPending={isPending}
      disabled={disabled}
      label="Mark as Paid"
      saveLabel="Mark as Paid"
      description="Enter the payment date to mark this payment as paid."
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <Controller
          name="paidAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="paidAt">Completion Date</FieldLabel>
              <Input
                {...field}
                id="paidAt"
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
