import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addTimesheetSchema,
  type AddTimesheet,
} from '#/features/timesheets/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';
import { CollaboratorRoleCombobox } from '@/features/collaborator-roles/components/CollaboratorRoleCombobox';

type AddTimesheetFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddTimesheet>;
};

export function AddTimesheetForm({
  isPending,
  onSubmit,
}: AddTimesheetFormProps) {
  const form = useForm<AddTimesheet>({
    resolver: zodResolver(addTimesheetSchema),
    defaultValues: {
      collaboratorId: '',
      collaboratorRoleId: '',
      startDate: '',
      endDate: '',
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="collaboratorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="collaboratorId">Collaborator</FieldLabel>
              <CollaboratorCombobox
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="collaboratorRoleId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="collaboratorRoleId">Role</FieldLabel>
              <CollaboratorRoleCombobox
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  {...field}
                  id="startDate"
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
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input
                  {...field}
                  id="endDate"
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
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
