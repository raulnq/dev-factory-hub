import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  editContactSchema,
  type EditContact,
} from '#/features/clients/schemas';
import { EditItemDialog } from '@/components/EditItemDialog';

type EditContactDialogProps = {
  name: string | null | undefined;
  email: string | null | undefined;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditContact) => Promise<void>;
};

export function EditContactDialog({
  name,
  email,
  open,
  isPending,
  onOpenChange,
  onEdit,
}: EditContactDialogProps) {
  return (
    <EditItemDialog
      schema={editContactSchema}
      defaultValues={{ name: name ?? '', email: email ?? null }}
      open={open}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onEdit={onEdit}
      label="Edit Contact"
      saveLabel="Save Contact"
      description="Update the contact details."
      formId="edit-contact-form"
    >
      {form => (
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-contact-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-contact-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Contact name"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-contact-email">Email</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  id="edit-contact-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email (optional)"
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
