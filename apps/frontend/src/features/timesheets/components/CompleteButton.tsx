import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import {
  completeTimesheetSchema,
  type CompleteTimesheet,
} from '#/features/timesheets/schemas';

type CompleteButtonProps = {
  disabled: boolean;
  onComplete: (data: CompleteTimesheet) => void;
};

export function CompleteButton({ disabled, onComplete }: CompleteButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<CompleteTimesheet>({
    resolver: zodResolver(completeTimesheetSchema),
    defaultValues: { completedAt: today },
  });

  const handleSubmit: SubmitHandler<CompleteTimesheet> = data => {
    onComplete(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({ completedAt: today });
    }
    setDialogOpen(open);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="default"
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Complete
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Timesheet</DialogTitle>
            <DialogDescription>
              Select the date this timesheet was completed.
            </DialogDescription>
          </DialogHeader>
          <form
            id="complete-timesheet-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Controller
              name="completedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="completedAt">Completion Date</FieldLabel>
                  <Input
                    {...field}
                    id="completedAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    disabled={disabled}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="complete-timesheet-form"
                disabled={disabled}
              >
                Complete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
