import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editCollaboratorPaymentSchema,
  type CollaboratorPayment,
  type EditCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type EditCollaboratorPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaboratorPayment>;
  collaboratorPayment: CollaboratorPayment;
};

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  return value;
}

export function EditCollaboratorPaymentForm({
  isPending,
  onSubmit,
  collaboratorPayment,
}: EditCollaboratorPaymentFormProps) {
  const isEditable = collaboratorPayment.status === 'Pending';

  const form = useForm<EditCollaboratorPayment>({
    resolver: zodResolver(editCollaboratorPaymentSchema),
    defaultValues: {
      currency: collaboratorPayment.currency,
      grossSalary: Number(collaboratorPayment.grossSalary),
      withholding: Number(collaboratorPayment.withholding),
    },
  });

  const grossSalary = form.watch('grossSalary');
  const withholding = form.watch('withholding');
  const netSalary =
    Math.round((Number(grossSalary) - Number(withholding)) * 100) / 100;

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Collaborator</FieldLabel>
            <Input
              value={collaboratorPayment.collaboratorName ?? ''}
              disabled
            />
          </Field>

          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Currency</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || !isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="PEN">PEN</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="grossSalary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="grossSalary">Gross Salary</FieldLabel>
                <Input
                  {...field}
                  id="grossSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending || !isEditable}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="withholding"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="withholding">Withholding</FieldLabel>
                <Input
                  {...field}
                  id="withholding"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  disabled={isPending || !isEditable}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor="netSalary">Net Salary</FieldLabel>
            <Input
              id="netSalary"
              type="number"
              value={isNaN(netSalary) ? '' : netSalary.toFixed(2)}
              disabled
            />
          </Field>
        </div>

        <FieldSeparator />

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input
              value={collaboratorPayment.createdAt.toLocaleString()}
              disabled
            />
          </Field>

          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <Input value={formatDate(collaboratorPayment.paidAt)} disabled />
          </Field>

          <Field>
            <FieldLabel>Confirmed At</FieldLabel>
            <Input
              value={formatDate(collaboratorPayment.confirmedAt)}
              disabled
            />
          </Field>

          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input value={collaboratorPayment.number ?? ''} disabled />
          </Field>

          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Input
              value={
                collaboratorPayment.canceledAt
                  ? collaboratorPayment.canceledAt.toLocaleString()
                  : ''
              }
              disabled
            />
          </Field>
        </div>
      </FieldGroup>
    </FormCardContent>
  );
}
