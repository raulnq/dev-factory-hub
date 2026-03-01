import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  issueInvoiceSchema,
  type IssueInvoice,
} from '#/features/invoices/schemas';

type IssueInvoiceButtonProps = {
  disabled: boolean;
  onIssue: SubmitHandler<IssueInvoice>;
};

export function IssueInvoiceButton({
  disabled,
  onIssue,
}: IssueInvoiceButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<IssueInvoice>({
    resolver: zodResolver(issueInvoiceSchema),
    defaultValues: {
      issuedAt: new Date().toISOString().split('T')[0],
      exchangeRate: 1,
      number: '',
    },
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Issue
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Invoice</DialogTitle>
            <DialogDescription>
              Enter the invoice details to issue it.
            </DialogDescription>
          </DialogHeader>
          <form
            id="issue-invoice-form"
            onSubmit={form.handleSubmit(data => {
              onIssue(data);
              setDialogOpen(false);
              form.reset();
            })}
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
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="exchangeRate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="exchangeRate">Exchange Rate</FieldLabel>
                  <Input
                    {...field}
                    id="exchangeRate"
                    type="number"
                    step="0.0001"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="1.0000"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="number">Invoice Number</FieldLabel>
                  <Input
                    {...field}
                    id="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="INV-001"
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
            <Button type="submit" form="issue-invoice-form">
              Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
