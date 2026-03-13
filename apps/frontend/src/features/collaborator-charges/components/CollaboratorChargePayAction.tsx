import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  payCollaboratorChargeSchema,
  type PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';

type CollaboratorChargePayActionProps = {
  disabled: boolean;
  isPending: boolean;
  onPay: (data: PayCollaboratorCharge) => void;
};

export function CollaboratorChargePayAction({
  disabled,
  isPending,
  onPay,
}: CollaboratorChargePayActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={payCollaboratorChargeSchema}
      defaultValues={{ issuedAt: today }}
      onSubmit={onPay}
      isPending={isPending}
      disabled={disabled}
      label="Issue"
      saveLabel="Issue"
      description="Enter the issue date to mark this charge as issued."
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
