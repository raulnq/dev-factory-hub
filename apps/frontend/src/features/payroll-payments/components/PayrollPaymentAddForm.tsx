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
} from '@/components/ui/field';
import {
  addPayrollPaymentSchema,
  type AddPayrollPayment,
} from '#/features/payroll-payments/schemas';
import { FormCard } from '@/components/FormCard';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';
import { CurrencySelect } from '@/components/CurrencySelect';

type PayrollPaymentAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddPayrollPayment>;
  onCancel: () => void;
};

export function PayrollPaymentAddForm({
  isPending,
  onSubmit,
  onCancel,
}: PayrollPaymentAddFormProps) {
  const form = useForm<AddPayrollPayment>({
    resolver: zodResolver(addPayrollPaymentSchema),
    defaultValues: {
      currency: 'USD',
      netSalary: 0,
      comission: 0,
      taxes: 0,
    },
  });

  const netSalary = useWatch({ control: form.control, name: 'netSalary' }) ?? 0;
  const grossSalary = Number(netSalary);

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Payroll Payment"
      isPending={isPending}
      title="Add Payroll Payment"
      description="Create a new payroll payment."
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="collaboratorId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Collaborator</FieldLabel>
                <CollaboratorCombobox
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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
                  disabled={isPending}
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
                  disabled={isPending}
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
              value="0.00"
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
                  disabled={isPending}
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
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </FormCard>
  );
}
