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
import { addProjectSchema, type AddProject } from '#/features/clients/schemas';

type AddProjectButtonProps = {
  onAdd: (data: AddProject) => Promise<void>;
  isPending: boolean;
};

export function AddProjectButton({ onAdd, isPending }: AddProjectButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<AddProject>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: { name: '' },
  });

  const handleSubmit: SubmitHandler<AddProject> = async (data: AddProject) => {
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
            Add Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Add a new project to this client.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-project-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                form="add-project-form"
                disabled={isPending}
              >
                Add Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
