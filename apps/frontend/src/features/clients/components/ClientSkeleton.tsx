import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ClientSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Document Number</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Phone</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
      </div>
    </CardContent>
  );
}
