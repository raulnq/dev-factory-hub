import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addProjectSchema, type AddProject } from '#/features/clients/schemas';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';

type ProjectAddActionProps = {
  onAdd: (data: AddProject) => Promise<void>;
  isPending: boolean;
};

export function ProjectAddAction({ onAdd, isPending }: ProjectAddActionProps) {
  return (
    <UncontrolledFormDialog
      schema={addProjectSchema}
      defaultValues={{ name: '' }}
      onSubmit={onAdd}
      isPending={isPending}
      label="Add Project"
      saveLabel="Save Project"
      description="Add a new project to this client."
      icon={<Plus className="h-4 w-4 mr-1" />}
    >
      {form => (
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="project-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="project-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Project name"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      )}
    </UncontrolledFormDialog>
  );
}
