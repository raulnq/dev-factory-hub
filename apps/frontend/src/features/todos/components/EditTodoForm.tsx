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
  editTodoSchema,
  type EditTodo,
  type Todo,
} from '#/features/todos/schemas';
import { FormCardContent } from '@/components/FormCardContent';
import { Checkbox } from '@/components/ui/checkbox';

type EditTodoFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditTodo>;
  todo: Todo;
};

export function EditTodoForm({ isPending, onSubmit, todo }: EditTodoFormProps) {
  const form = useForm<EditTodo>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: todo,
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
          name="completed"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="completed"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending}
              />
              <FieldLabel htmlFor="completed" className="font-normal">
                Completed
              </FieldLabel>
            </Field>
          )}
        />
      </FieldGroup>
    </FormCardContent>
  );
}
