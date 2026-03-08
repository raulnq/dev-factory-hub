import {
  useForm,
  Controller,
  type SubmitHandler,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  editPayrollPaymentSchema,
  type EditPayrollPayment,
  type PayrollPayment,
} from '#/features/payroll-payments/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { CurrencySelect } from '@/components/CurrencySelect';

type EditPayrollPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditPayrollPayment>;
  onCancel: () => void;
  payrollPayment: PayrollPayment;
};

export function EditPayrollPaymentForm({
  isPending,
  onSubmit,
  onCancel,
  payrollPayment,
}: EditPayrollPaymentFormProps) {
  const isStatusPending = payrollPayment.status === 'Pending';

  const form = useForm<EditPayrollPayment>({
    resolver: zodResolver(editPayrollPaymentSchema),
    defaultValues: {
      currency: payrollPayment.currency,
      netSalary: Number(payrollPayment.netSalary),
      comission: Number(payrollPayment.comission),
      taxes: Number(payrollPayment.taxes),
    },
  });

  const netSalary =
    useWatch({ control: form.control, name: 'netSalary' }) ??
    Number(payrollPayment.netSalary);
  const grossSalary = Number(netSalary) + Number(payrollPayment.pensionAmount);

  return (
    <FormCardContent
      formId={isStatusPending ? 'form' : undefined}
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Payroll Payment"
      cancelText={isStatusPending ? 'Cancel' : 'Back'}
      isPending={isPending}
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Collaborator</FieldLabel>
            <Input
              value={payrollPayment.collaboratorName ?? ''}
              disabled
              aria-readonly
            />
          </Field>
          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <CurrencySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  id="currency"
                  disabled={isPending || !isStatusPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="netSalary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="netSalary">Net Salary</FieldLabel>
                <Input
                  {...field}
                  id="netSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending || !isStatusPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <FieldLabel htmlFor="pensionAmount">Pension Amount</FieldLabel>
            <Input
              id="pensionAmount"
              type="number"
              value={Number(payrollPayment.pensionAmount).toFixed(2)}
              disabled
              aria-readonly
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="grossSalary">Gross Salary</FieldLabel>
            <Input
              id="grossSalary"
              type="number"
              value={grossSalary.toFixed(2)}
              disabled
              aria-readonly
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="comission"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="comission">Commission</FieldLabel>
                <Input
                  {...field}
                  id="comission"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending || !isStatusPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="taxes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="taxes">Taxes</FieldLabel>
                <Input
                  {...field}
                  id="taxes"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending || !isStatusPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <FieldSeparator />

        <div className="grid grid-cols-4 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={payrollPayment.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <DateReadOnlyField value={payrollPayment.paidAt} />
          </Field>
          <Field>
            <FieldLabel>Pension Paid At</FieldLabel>
            <DateReadOnlyField value={payrollPayment.pensionPaidAt} />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <DateReadOnlyField value={payrollPayment.canceledAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
