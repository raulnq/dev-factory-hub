import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckSquare } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  confirmCollaboratorPaymentSchema,
  type ConfirmCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';

type CollaboratorPaymentConfirmActionProps = {
  disabled: boolean;
  isPending: boolean;
  onConfirm: (data: ConfirmCollaboratorPayment) => void;
};

export function CollaboratorPaymentConfirmAction({
  disabled,
  isPending,
  onConfirm,
}: CollaboratorPaymentConfirmActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={confirmCollaboratorPaymentSchema}
      defaultValues={{ confirmedAt: today, number: '' }}
      onSubmit={onConfirm}
      isPending={isPending}
      disabled={disabled}
      label="Confirm"
      saveLabel="Confirm"
      description="Enter the confirmation date and reference number."
      icon={<CheckSquare className="h-4 w-4 mr-2" />}
    >
      {form => (
        <>
          <Controller
            name="confirmedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmedAt">Confirmation Date</FieldLabel>
                <Input
                  {...field}
                  id="confirmedAt"
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
                <FieldLabel htmlFor="number">Reference Number</FieldLabel>
                <Input
                  {...field}
                  id="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="Reference number"
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
