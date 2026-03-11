import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editCollaboratorPaymentSchema,
  type CollaboratorPayment,
  type ConfirmCollaboratorPayment,
  type EditCollaboratorPayment,
  type PayCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CurrencySelect } from '@/components/CurrencySelect';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { FormCard } from '@/components/FormCard';
import { CollaboratorPaymentToolbar } from './CollaboratorPaymentToolbar';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

type CollaboratorPaymentEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaboratorPayment>;
  onCancel: () => void;
  collaboratorPayment: CollaboratorPayment;
  onCollaboratorPaymentPay: (data: PayCollaboratorPayment) => void;
  onCollaboratorPaymentConfirm: (data: ConfirmCollaboratorPayment) => void;
  onCollaboratorPaymentCancel: () => void;
};

export function CollaboratorPaymentEditForm({
  isPending,
  onSubmit,
  onCancel,
  collaboratorPayment,
  onCollaboratorPaymentPay,
  onCollaboratorPaymentConfirm,
  onCollaboratorPaymentCancel,
}: CollaboratorPaymentEditFormProps) {
  const isEditable = collaboratorPayment.status === 'Pending';

  const form = useForm<EditCollaboratorPayment>({
    resolver: zodResolver(editCollaboratorPaymentSchema),
    defaultValues: {
      currency: collaboratorPayment.currency,
      grossSalary: Number(collaboratorPayment.grossSalary),
      withholding: Number(collaboratorPayment.withholding),
      taxes: Number(collaboratorPayment.taxes),
    },
  });

  const [grossSalary, withholding] = form.watch(['grossSalary', 'withholding']);
  const netSalary =
    Math.round((Number(grossSalary) - Number(withholding)) * 100) / 100;

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isEditable}
      onCancel={onCancel}
      saveText="Save Payment"
      isPending={isPending}
      title="Edit Payment"
      description="Update payment details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(collaboratorPayment.status)}
          status={collaboratorPayment.status}
        />
      }
      renderAction={
        <CollaboratorPaymentToolbar
          status={collaboratorPayment.status}
          isPending={isPending}
          onPay={onCollaboratorPaymentPay}
          onConfirm={onCollaboratorPaymentConfirm}
          onCancel={onCollaboratorPaymentCancel}
        />
      }
    >
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
                <CurrencySelect
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || !isEditable}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
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
            <DateReadOnlyField value={collaboratorPayment.createdAt} />
          </Field>

          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <DateReadOnlyField value={collaboratorPayment.paidAt} />
          </Field>

          <Field>
            <FieldLabel>Confirmed At</FieldLabel>
            <DateReadOnlyField value={collaboratorPayment.confirmedAt} />
          </Field>

          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input value={collaboratorPayment.number ?? ''} disabled />
          </Field>

          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <DateReadOnlyField value={collaboratorPayment.canceledAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
