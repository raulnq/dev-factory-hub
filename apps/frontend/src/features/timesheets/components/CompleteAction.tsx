import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { CheckCircle } from 'lucide-react';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  completeTimesheetSchema,
  type CompleteTimesheet,
} from '#/features/timesheets/schemas';

type CompleteButtonProps = {
  disabled: boolean;
  isPending: boolean;
  onComplete: (data: CompleteTimesheet) => void;
};

export function CompleteAction({
  disabled,
  isPending,
  onComplete,
}: CompleteButtonProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <UncontrolledFormDialog
      schema={completeTimesheetSchema}
      defaultValues={{ completedAt: today }}
      formId="complete-timesheet-form"
      onSubmit={onComplete}
      isPending={isPending}
      disabled={disabled}
      label="Complete"
      saveLabel="Complete"
      description="Select the date this timesheet was completed."
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <Controller
          name="completedAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="completedAt">Completion Date</FieldLabel>
              <Input
                {...field}
                id="completedAt"
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
