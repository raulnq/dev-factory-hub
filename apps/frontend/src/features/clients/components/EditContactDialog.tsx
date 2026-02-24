import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  editContactSchema,
  type EditContact,
} from '#/features/clients/schemas';

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
  const form = useForm<EditContact>({
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      name: name ?? '',
      email: email ?? null,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit: SubmitHandler<EditContact> = async (
    data: EditContact
  ) => {
    await onEdit(data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Update the contact details.</DialogDescription>
        </DialogHeader>
        <form
          id="edit-contact-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-contact-form" disabled={isPending}>
              Save Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
