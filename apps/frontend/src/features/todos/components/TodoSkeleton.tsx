import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TodoSkeleton() {
  return (
    <CardContent>
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field orientation="horizontal">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <FieldLabel className="font-normal">Completed</FieldLabel>
        </Field>
      </FieldGroup>
    </CardContent>
  );
}
