import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addCollaboratorPaymentSchema,
  type AddCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CollaboratorCombobox } from '../../collaborators/components/CollaboratorCombobox';

type AddCollaboratorPaymentFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddCollaboratorPayment>;
};

export function AddCollaboratorPaymentForm({
  isPending,
  onSubmit,
}: AddCollaboratorPaymentFormProps) {
  const form = useForm<AddCollaboratorPayment>({
    resolver: zodResolver(addCollaboratorPaymentSchema),
    defaultValues: {
      currency: 'USD',
      grossSalary: 0,
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
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
    </FormCardContent>
  );
}
