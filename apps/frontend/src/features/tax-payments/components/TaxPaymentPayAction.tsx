import { CheckCircle } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  payTaxPaymentSchema,
  type PayTaxPayment,
} from '#/features/tax-payments/schemas';

type TaxPaymentPayActionProps = {
  disabled: boolean;
  isPending: boolean;
  onPay: (data: PayTaxPayment) => Promise<void> | void;
};

export function TaxPaymentPayAction({
  disabled,
  isPending,
  onPay,
}: TaxPaymentPayActionProps) {
  return (
    <UncontrolledFormDialog
      label="Pay"
      saveLabel="Mark as Paid"
      description="Enter the payment date and number to mark this tax payment as paid."
      schema={payTaxPaymentSchema}
      defaultValues={{
        paidAt: new Date().toISOString().split('T')[0],
        number: '',
      }}
      onSubmit={onPay}
      isPending={isPending}
      disabled={disabled}
      icon={<CheckCircle className="h-4 w-4 mr-2" />}
    >
      {form => (
        <div className="space-y-4">
          <Controller
            name="paidAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="paidAt">Payment Date</FieldLabel>
                <Input
                  {...field}
                  id="paidAt"
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
            name="number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="number">Number</FieldLabel>
                <Input
                  {...field}
                  id="number"
                  placeholder="Payment number"
                  aria-invalid={fieldState.invalid}
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
