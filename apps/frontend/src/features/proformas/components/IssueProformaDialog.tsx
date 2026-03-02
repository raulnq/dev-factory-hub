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
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import {
  issueProformaSchema,
  type IssueProforma,
} from '#/features/proformas/schemas';

type IssueProformaDialogProps = {
  onIssue: (data: IssueProforma) => void;
  isPending: boolean;
  disabled: boolean;
};

export function IssueProformaDialog({
  onIssue,
  isPending,
  disabled,
}: IssueProformaDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<IssueProforma>({
    resolver: zodResolver(issueProformaSchema),
    defaultValues: { issuedAt: today },
  });

  const handleSubmit: SubmitHandler<IssueProforma> = data => {
    onIssue(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({ issuedAt: today });
    }
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" disabled={disabled || isPending}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Proforma</DialogTitle>
          <DialogDescription>
            Select the date this proforma was issued.
          </DialogDescription>
        </DialogHeader>
        <form
          id="issue-proforma-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <Controller
            name="issuedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="issuedAt">Issue Date</FieldLabel>
                <Input
                  {...field}
                  id="issuedAt"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
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
              form="issue-proforma-form"
              disabled={isPending}
            >
              Issue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
