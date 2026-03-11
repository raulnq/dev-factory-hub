import { Coins } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  payPensionPayrollPaymentSchema,
  type PayPensionPayrollPayment,
} from '#/features/payroll-payments/schemas';

type PayrollPaymentPayPensionActionProps = {
  disabled: boolean;
  isPending: boolean;
  onPayPension: (data: PayPensionPayrollPayment) => Promise<void> | void;
};

export function PayrollPaymentPayPensionAction({
  disabled,
  isPending,
  onPayPension,
}: PayrollPaymentPayPensionActionProps) {
  return (
    <UncontrolledFormDialog
      label="Pay Pension"
      saveLabel="Pay Pension"
      description="Enter the pension payment date and amount."
      schema={payPensionPayrollPaymentSchema}
      defaultValues={{
        pensionPaidAt: new Date().toISOString().split('T')[0],
        pensionAmount: 0,
      }}
      onSubmit={onPayPension}
      isPending={isPending}
      disabled={disabled}
      icon={<Coins className="h-4 w-4 mr-2" />}
    >
      {form => (
        <div className="space-y-4">
          <Controller
            name="pensionPaidAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="pensionPaidAt">
                  Pension Payment Date
                </FieldLabel>
                <Input
                  {...field}
                  id="pensionPaidAt"
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
            name="pensionAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="pensionAmount">Pension Amount</FieldLabel>
                <Input
                  {...field}
                  id="pensionAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
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
