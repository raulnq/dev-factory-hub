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
  editProjectSchema,
  type EditProject,
} from '#/features/clients/schemas';

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
  const form = useForm<EditProject>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: name ?? '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit: SubmitHandler<EditProject> = async (
    data: EditProject
  ) => {
    await onEdit(data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update the project details.</DialogDescription>
        </DialogHeader>
        <form
          id="edit-project-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="edit-project-form" disabled={isPending}>
              Save Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
