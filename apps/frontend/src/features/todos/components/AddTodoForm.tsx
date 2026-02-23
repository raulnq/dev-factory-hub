import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { addTodoSchema, type AddTodo } from '#/features/todos/schemas';
import { FormCardContent } from '@/components/FormCardContent';

type AddTodoFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddTodo>;
};

export function AddTodoForm({ isPending, onSubmit }: AddTodoFormProps) {
  const form = useForm<AddTodo>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      name: '',
    },
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
      </FieldGroup>
    </FormCardContent>
  );
}
