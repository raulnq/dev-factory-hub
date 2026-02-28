import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { ProjectCombobox } from '@/features/clients/components/ProjectCombobox';

const addTimesheetProjectSchema = z.object({
  projectId: z.uuidv7(),
});

export type AddTimesheetProject = z.infer<typeof addTimesheetProjectSchema>;

type AddProjectButtonProps = {
  onAdd: (projectId: string) => Promise<void>;
};

export function AddProjectButton({ onAdd }: AddProjectButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<AddTimesheetProject>({
    resolver: zodResolver(addTimesheetProjectSchema),
    defaultValues: {
      projectId: '',
    },
  });

  const handleSubmit = async (data: AddTimesheetProject) => {
    await onAdd(data.projectId);
    setDialogOpen(false);
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Add a new project for this timesheet.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-project-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Controller
              name="projectId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="projectId">Project</FieldLabel>
                  <ProjectCombobox
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-project-form">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
