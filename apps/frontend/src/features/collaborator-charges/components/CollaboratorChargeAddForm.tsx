import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addCollaboratorChargeSchema,
  type AddCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CurrencySelect } from '@/components/CurrencySelect';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';
import { FormCard } from '@/components/FormCard';

type CollaboratorChargeAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddCollaboratorCharge>;
  onCancel: () => void;
};

export function CollaboratorChargeAddForm({
  isPending,
  onSubmit,
  onCancel,
}: CollaboratorChargeAddFormProps) {
  const form = useForm<AddCollaboratorCharge>({
    resolver: zodResolver(addCollaboratorChargeSchema),
    defaultValues: {
      currency: 'USD',
      amount: 0,
      description: '',
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Charge"
      isPending={isPending}
      title="Add Charge"
      description="Create a new collaborator charge."
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
                <FieldLabel>Currency</FieldLabel>
                <CurrencySelect
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FormCard>
  );
}
