import { Send } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MonthSelect } from '@/components/MonthSelect';
import { YearSelect } from '@/components/YearSelect';
import { useSendMonthlyStatement } from '../stores/useReports';

const formSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  toEmail: z.string().email('Invalid email address'),
  fromEmail: z.string().email('Invalid email address'),
  ccEmails: z.string().min(1, 'At least one CC email is required'),
});

type SendMonthlyStatementForm = z.infer<typeof formSchema>;

type SendMonthlyStatementActionProps = {
  initialMonth: string;
  initialYear: string;
};

export function SendMonthlyStatementAction({
  initialMonth,
  initialYear,
}: SendMonthlyStatementActionProps) {
  const send = useSendMonthlyStatement();

  const defaultFromEmail = import.meta.env.VITE_DEFAULT_FROM_EMAIL ?? '';
  const defaultCcEmails = import.meta.env.VITE_DEFAULT_CC_EMAILS ?? '';

  const handleSubmit = async (data: SendMonthlyStatementForm) => {
    const ccEmailsList = data.ccEmails
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);
    try {
      const result = await send.mutateAsync({
        month: Number(data.month),
        year: Number(data.year),
        toEmail: data.toEmail,
        fromEmail: data.fromEmail,
        ccEmails: ccEmailsList,
      });
      if (result.sent) {
        toast.success(
          `Monthly statement sent with ${result.attachmentCount} attachment(s).`
        );
      } else {
        toast.info('No documents found for the selected period.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send statement'
      );
      throw error;
    }
  };

  return (
    <UncontrolledFormDialog
      label="Send Monthly Statement"
      saveLabel="Send"
      description="Send the monthly statement email with all documents for the selected period."
      schema={formSchema}
      defaultValues={{
        month: initialMonth,
        year: initialYear,
        toEmail: '',
        fromEmail: defaultFromEmail,
        ccEmails: defaultCcEmails,
      }}
      onSubmit={handleSubmit}
      isPending={send.isPending}
      icon={<Send className="mr-2 h-4 w-4" />}
    >
      {form => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="month"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Month</FieldLabel>
                  <MonthSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={send.isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Year</FieldLabel>
                  <YearSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={send.isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="toEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>To Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="recipient@example.com"
                  disabled={send.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="fromEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>From Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="sender@example.com"
                  disabled={send.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="ccEmails"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>CC Emails</FieldLabel>
                <Input
                  {...field}
                  placeholder="cc1@example.com, cc2@example.com"
                  disabled={send.isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
    </UncontrolledFormDialog>
  );
}
