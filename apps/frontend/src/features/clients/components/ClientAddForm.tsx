import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addClientSchema, type AddClient } from '#/features/clients/schemas';
import { FormCard } from '@/components/FormCard';

type ClientAddFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddClient>;
  onCancel: () => void;
};

export function ClientAddForm({
  isPending,
  onSubmit,
  onCancel,
}: ClientAddFormProps) {
  const form = useForm<AddClient>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      name: '',
      documentNumber: null,
      phone: null,
      address: null,
      email: null,
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Client"
      isPending={isPending}
      title="Add Client"
      description="Create a new client."
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
                placeholder="Client name"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="documentNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="documentNumber">Document Number</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                id="documentNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Document number (optional)"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                id="phone"
                aria-invalid={fieldState.invalid}
                placeholder="Phone (optional)"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                id="address"
                rows={3}
                aria-invalid={fieldState.invalid}
                placeholder="Address (optional)"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="Email (optional)"
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
