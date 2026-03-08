import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormCardSkeleton } from '@/components/FormCardSkeleton';

export function CollaboratorSkeleton() {
  return (
    <FormCardSkeleton>
      <FieldGroup>
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
      </FieldGroup>
    </FormCardSkeleton>
  );
}
