import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { FormSkeleton } from '@/components/FormCard';

export function TaxPaymentSkeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Year</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Month</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Taxes</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
          <Field>
            <FieldLabel>Cancelled At</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Skeleton className="h-10 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormSkeleton>
  );
}
