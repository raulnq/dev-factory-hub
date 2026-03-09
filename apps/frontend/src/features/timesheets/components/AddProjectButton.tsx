import { Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { z } from 'zod';
import { ProjectCombobox } from '@/features/clients/components/ProjectCombobox';
import { AddItemDialog } from '@/components/AddItemDialog';

const addTimesheetProjectSchema = z.object({
  projectId: z.uuidv7(),
});

export type AddTimesheetProject = z.infer<typeof addTimesheetProjectSchema>;

type AddProjectButtonProps = {
  onAdd: (projectId: string) => Promise<void>;
};

export function AddProjectButton({ onAdd }: AddProjectButtonProps) {
  return (
    <AddItemDialog
      schema={addTimesheetProjectSchema}
      defaultValues={{ projectId: '' }}
      onAdd={data => onAdd(data.projectId)}
      isPending={false}
      label="Add Project"
      saveLabel="Save Project"
      description="Add a new project for this timesheet."
    >
      {form => (
        <Controller
          name="projectId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="projectId">Project</FieldLabel>
              <ProjectCombobox value={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </AddItemDialog>
  );
}
