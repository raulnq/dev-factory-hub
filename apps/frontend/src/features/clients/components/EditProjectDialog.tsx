import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  editProjectSchema,
  type EditProject,
} from '#/features/clients/schemas';
import { EditItemDialog } from '@/components/EditItemDialog';

type EditProjectDialogProps = {
  name: string | null | undefined;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditProject) => Promise<void>;
};

export function EditProjectDialog({
  name,
  open,
  isPending,
  onOpenChange,
  onEdit,
}: EditProjectDialogProps) {
  return (
    <EditItemDialog
      schema={editProjectSchema}
      defaultValues={{ name: name ?? '' }}
      open={open}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onEdit={onEdit}
      label="Edit Project"
      saveLabel="Save Project"
      description="Update the project details."
      formId="edit-project-form"
    >
      {form => (
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-project-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-project-name"
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
    </EditItemDialog>
  );
}
