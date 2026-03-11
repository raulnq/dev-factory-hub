import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  confirmCollectionSchema,
  type ConfirmCollection,
} from '#/features/collections/schemas';

type CollectionConfirmActionProps = {
  disabled: boolean;
  isPending: boolean;
  onConfirm: (data: ConfirmCollection) => void;
};

export function CollectionConfirmAction({
  disabled,
  isPending,
  onConfirm,
}: CollectionConfirmActionProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={confirmCollectionSchema}
      defaultValues={{ confirmedAt: today }}
      formId="confirm-collection-form"
      onSubmit={onConfirm}
      isPending={isPending}
      disabled={disabled}
      label="Confirm"
      saveLabel="Confirm"
      description="Enter the confirmation date to mark this collection as confirmed."
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
