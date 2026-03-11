import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProformaSchema } from '#/features/proformas/schemas';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectCombobox } from '../../clients/components/ProjectCombobox';
import type { AddProforma } from '#/features/proformas/schemas';
import { CurrencySelect } from '@/components/CurrencySelect';
import { FormCard } from '@/components/FormCard';

type ProformaAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddProforma>;
  onCancel: () => void;
};

export function ProformaAddForm({
  onSubmit,
  onCancel,
  isPending,
}: ProformaAddFormProps) {
  const form = useForm<AddProforma>({
    resolver: zodResolver(addProformaSchema),
    defaultValues: {
      currency: 'USD',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      isPending={isPending}
      saveText="Save Proforma"
      title="Add Proforma"
      description="Create a new proforma."
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="projectId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Project</FieldLabel>
                <ProjectCombobox
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
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
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  {...field}
                  id="startDate"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                <Input
                  {...field}
                  id="endDate"
                  type="date"
                  aria-invalid={fieldState.invalid}
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
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Notes</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                aria-invalid={fieldState.invalid}
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
