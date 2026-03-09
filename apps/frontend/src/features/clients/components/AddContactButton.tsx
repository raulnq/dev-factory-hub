import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addContactSchema, type AddContact } from '#/features/clients/schemas';
import { AddItemDialog } from '@/components/AddItemDialog';

type AddContactButtonProps = {
  onAdd: (data: AddContact) => Promise<void>;
  isPending: boolean;
};

export function AddContactButton({ onAdd, isPending }: AddContactButtonProps) {
  return (
    <AddItemDialog
      schema={addContactSchema}
      defaultValues={{ name: '', email: null }}
      onAdd={onAdd}
      isPending={isPending}
      label="Add Contact"
      description="Add a new contact to this client."
      formId="contact-form"
    >
      {form => (
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
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
                <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  id="contact-email"
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
    </AddItemDialog>
  );
}
