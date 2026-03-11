import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addCollaboratorPaymentSchema,
  type AddCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CurrencySelect } from '@/components/CurrencySelect';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';
import { FormCard } from '@/components/FormCard';

type AddCollaboratorPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddCollaboratorPayment>;
  onCancel: () => void;
};

export function AddCollaboratorPaymentForm({
  isPending,
  onSubmit,
  onCancel,
}: AddCollaboratorPaymentFormProps) {
  const form = useForm<AddCollaboratorPayment>({
    resolver: zodResolver(addCollaboratorPaymentSchema),
    defaultValues: {
      currency: 'USD',
      grossSalary: 0,
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Payment"
      isPending={isPending}
      title="Add Payment"
      description="Create a new collaborator payment."
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
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FormCard>
  );
}
