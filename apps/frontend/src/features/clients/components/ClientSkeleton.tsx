import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormCardSkeleton } from '@/components/FormCardSkeleton';

export function ClientSkeleton() {
  return (
    <FormCardSkeleton>
      <FieldGroup>
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
      </FieldGroup>
    </FormCardSkeleton>
  );
}
