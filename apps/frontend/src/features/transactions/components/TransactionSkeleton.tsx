import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormCardSkeleton } from '@/components/FormCardSkeleton';

export function TransactionSkeleton() {
  return (
    <FormCardSkeleton>
      <FieldGroup>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <Field>
          <FieldLabel>Type</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Currency</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Taxes</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormCardSkeleton>
  );
}
