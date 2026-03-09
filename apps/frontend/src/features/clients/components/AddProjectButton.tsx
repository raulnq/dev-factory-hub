import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addProjectSchema, type AddProject } from '#/features/clients/schemas';
import { AddItemDialog } from '@/components/AddItemDialog';

type AddProjectButtonProps = {
  onAdd: (data: AddProject) => Promise<void>;
  isPending: boolean;
};

export function AddProjectButton({ onAdd, isPending }: AddProjectButtonProps) {
  return (
    <AddItemDialog
      schema={addProjectSchema}
      defaultValues={{ name: '' }}
      onAdd={onAdd}
      isPending={isPending}
      label="Add Project"
      saveLabel="Save Project"
      description="Add a new project to this client."
      formId="add-project-form"
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
    </AddItemDialog>
  );
}
