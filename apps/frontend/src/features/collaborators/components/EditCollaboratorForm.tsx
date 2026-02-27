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
  editCollaboratorSchema,
  type EditCollaborator,
  type Collaborator,
} from '#/features/collaborators/schemas';
import { FormCardContent } from '@/components/FormCardContent';

type EditCollaboratorFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaborator>;
  collaborator: Collaborator;
};

export function EditCollaboratorForm({
  isPending,
  onSubmit,
  collaborator,
}: EditCollaboratorFormProps) {
  const form = useForm<EditCollaborator>({
    resolver: zodResolver(editCollaboratorSchema),
    defaultValues: collaborator,
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
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
                placeholder="Name"
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
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Email (optional)"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="withholdingPercentage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="withholdingPercentage">
                Withholding Percentage (%)
              </FieldLabel>
              <Input
                {...field}
                id="withholdingPercentage"
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
      </FieldGroup>
    </FormCardContent>
  );
}
