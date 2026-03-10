import { Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { z } from 'zod';
import { ProjectCombobox } from '@/features/clients/components/ProjectCombobox';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';

const addTimesheetProjectSchema = z.object({
  projectId: z.uuidv7(),
});

export type AddTimesheetProject = z.infer<typeof addTimesheetProjectSchema>;

type AddProjectActionProps = {
  onAdd: (projectId: string) => Promise<void>;
};

export function AddProjectAction({ onAdd }: AddProjectActionProps) {
  return (
    <UncontrolledFormDialog
      schema={addTimesheetProjectSchema}
      defaultValues={{ projectId: '' }}
      onSubmit={data => onAdd(data.projectId)}
      isPending={false}
      label="Add Project"
      saveLabel="Save Project"
      description="Add a new project for this timesheet."
      icon={<Plus className="h-4 w-4 mr-1" />}
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
    </UncontrolledFormDialog>
  );
}
