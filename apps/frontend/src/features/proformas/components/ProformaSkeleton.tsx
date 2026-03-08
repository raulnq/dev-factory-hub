import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { FormCardSkeleton } from '@/components/FormCardSkeleton';

export function ProformaSkeleton() {
  return (
    <FormCardSkeleton>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Project</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Notes</FieldLabel>
          <Skeleton className="h-20 w-full" />
        </Field>
        <div className="grid grid-cols-5 gap-4">
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Expenses</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Discount</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Taxes</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormCardSkeleton>
  );
}
