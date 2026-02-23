import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Todo } from '#/features/todos/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';

type ViewTodoCardProps = {
  todo: Todo;
};

export function ViewTodoCard({ todo }: ViewTodoCardProps) {
  return (
    <ViewCardContent>
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={todo.name} disabled />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="completed" checked={todo.completed} disabled />
          <FieldLabel htmlFor="completed" className="font-normal">
            Completed
          </FieldLabel>
        </Field>
      </FieldGroup>
    </ViewCardContent>
  );
}
