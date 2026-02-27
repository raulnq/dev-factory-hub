import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CollaboratorSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Withholding Percentage</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
      </div>
    </CardContent>
  );
}
