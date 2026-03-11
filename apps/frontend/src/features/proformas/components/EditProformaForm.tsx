import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProformaSchema } from '#/features/proformas/schemas';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  Proforma,
  EditProforma,
  IssueProforma,
} from '#/features/proformas/schemas';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { FormCard } from '@/components/FormCard';
import { ProformaToolbar } from './ProformaToolbar';
import { getStatusVariant } from '../utils/status-variants';
import { StatusBadge } from '@/components/StatusBadge';

type EditProformaFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditProforma>;
  onCancel: () => void;
  proforma: Proforma;
  onProformaCancel: () => void;
  onProformaIssue: (data: IssueProforma) => void;
};

export function EditProformaForm({
  proforma,
  onSubmit,
  onCancel,
  isPending,
  onProformaCancel,
  onProformaIssue,
}: EditProformaFormProps) {
  const isEditable = proforma.status === 'Pending';
  const form = useForm<EditProforma>({
    resolver: zodResolver(editProformaSchema),
    defaultValues: {
      expenses: Number(proforma.expenses),
      discount: Number(proforma.discount),
      taxes: Number(proforma.taxes),
      notes: proforma.notes ?? '',
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      isPending={isPending}
      saveText="Save Proforma"
      title={`Edit Proforma ${proforma.number}`}
      description="Update proforma details."
      readOnly={!isEditable}
      renderTitleSuffix={
        <StatusBadge
          status={proforma.status}
          variant={getStatusVariant(proforma.status)}
        />
      }
      renderAction={
        <ProformaToolbar
          onCancel={onProformaCancel}
          onIssue={onProformaIssue}
          total={proforma.total}
          isPending={isPending}
          status={proforma.status}
        />
      }
    >
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Project</FieldLabel>
            <Input value={proforma.projectName ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Input value={proforma.currency} disabled />
          </Field>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <DateReadOnlyField value={proforma.startDate} />
          </Field>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <DateReadOnlyField value={proforma.endDate} />
          </Field>
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
                disabled={isPending || !isEditable}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-5 gap-4">
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Input value={proforma.subtotal} disabled />
          </Field>
          <Controller
            control={form.control}
            name="expenses"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Expenses</FieldLabel>
                <Input
                  {...field}
                  id="expenses"
                  type="number"
                  step="0.01"
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
            control={form.control}
            name="discount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Discount</FieldLabel>
                <Input
                  {...field}
                  id="discount"
                  type="number"
                  step="0.01"
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
            control={form.control}
            name="taxes"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Taxes</FieldLabel>
                <Input
                  {...field}
                  id="taxes"
                  type="number"
                  step="0.01"
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
            <FieldLabel>Total</FieldLabel>
            <Input value={proforma.total} disabled />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
