import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  editCollaboratorChargeSchema,
  type CollaboratorCharge,
  type EditCollaboratorCharge,
  type PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CurrencySelect } from '@/components/CurrencySelect';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { FormCard } from '@/components/FormCard';
import { CollaboratorChargeToolbar } from './CollaboratorChargeToolbar';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

type CollaboratorChargeEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaboratorCharge>;
  onCancel: () => void;
  collaboratorCharge: CollaboratorCharge;
  onCollaboratorChargePay: (data: PayCollaboratorCharge) => void;
  onCollaboratorChargeCancel: () => void;
};

export function CollaboratorChargeEditForm({
  isPending,
  onSubmit,
  onCancel,
  collaboratorCharge,
  onCollaboratorChargePay,
  onCollaboratorChargeCancel,
}: CollaboratorChargeEditFormProps) {
  const isEditable = collaboratorCharge.status === 'Pending';

  const form = useForm<EditCollaboratorCharge>({
    resolver: zodResolver(editCollaboratorChargeSchema),
    defaultValues: {
      description: collaboratorCharge.description,
      amount: Number(collaboratorCharge.amount),
      currency: collaboratorCharge.currency,
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      readOnly={!isEditable}
      onCancel={onCancel}
      saveText="Save Charge"
      isPending={isPending}
      title="Edit Charge"
      description="Update charge details."
      renderTitleSuffix={
        <StatusBadge
          variant={getStatusVariant(collaboratorCharge.status)}
          status={collaboratorCharge.status}
        />
      }
      renderAction={
        <CollaboratorChargeToolbar
          status={collaboratorCharge.status}
          isPending={isPending}
          onPay={onCollaboratorChargePay}
          onCancel={onCollaboratorChargeCancel}
        />
      }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Collaborator</FieldLabel>
            <Input value={collaboratorCharge.collaboratorName ?? ''} disabled />
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

        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                {...field}
                id="amount"
                type="number"
                step="0.01"
                value={field.value ?? ''}
                onChange={e => field.onChange(Number(e.target.value))}
                aria-invalid={fieldState.invalid}
                placeholder="0.00"
                disabled={isPending || !isEditable}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="Description of the charge"
                disabled={isPending || !isEditable}
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldSeparator />

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={collaboratorCharge.createdAt} />
          </Field>

          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <DateReadOnlyField value={collaboratorCharge.issuedAt} />
          </Field>

          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <DateReadOnlyField value={collaboratorCharge.canceledAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
