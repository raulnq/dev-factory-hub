import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CollaboratorRoleSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Currency</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Fee Rate</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Cost Rate</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </div>
    </CardContent>
  );
}
