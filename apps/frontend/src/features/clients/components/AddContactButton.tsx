import { useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { addContactSchema, type AddContact } from '#/features/clients/schemas';

type AddContactButtonProps = {
  onAdd: (data: AddContact) => Promise<void>;
  isPending: boolean;
};

export function AddContactButton({ onAdd, isPending }: AddContactButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<AddContact>({
    resolver: zodResolver(addContactSchema),
    defaultValues: { name: '', email: null },
  });

  const handleSubmit: SubmitHandler<AddContact> = async data => {
    await onAdd(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setDialogOpen(open);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to this client.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-contact-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                form="add-contact-form"
                disabled={isPending}
              >
                Add Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
