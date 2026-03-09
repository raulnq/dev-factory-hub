import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addCollaboratorRoleSchema,
  type AddCollaboratorRole,
} from '#/features/collaborator-roles/schemas';
import { FormCard } from '@/components/FormCard';
import { CurrencySelect } from '@/components/CurrencySelect';

type AddCollaboratorRoleFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddCollaboratorRole>;
  onCancel: () => void;
};

export function AddCollaboratorRoleForm({
  isPending,
  onSubmit,
  onCancel,
}: AddCollaboratorRoleFormProps) {
  const form = useForm<AddCollaboratorRole>({
    resolver: zodResolver(addCollaboratorRoleSchema),
    defaultValues: {
      name: '',
      currency: 'USD',
      feeRate: 0,
      costRate: 0,
    },
  });

  return (
    <FormCard
      formId="form"
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Role"
      isPending={isPending}
      title="Add Collaborator Role"
      description="Create a new collaborator role record."
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Role name"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <CurrencySelect
                value={field.value}
                onValueChange={field.onChange}
                id="currency"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="feeRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="feeRate">Fee Rate</FieldLabel>
                <Input
                  {...field}
                  id="feeRate"
                  type="number"
                  step="0.01"
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
            name="costRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="costRate">Cost Rate</FieldLabel>
                <Input
                  {...field}
                  id="costRate"
                  type="number"
                  step="0.01"
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
