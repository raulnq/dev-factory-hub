import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';

export function TaxPaymentSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
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
          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Number</FieldLabel>
              <Skeleton className="h-10 w-full" />
            </Field>
            <Field>
              <FieldLabel>Created At</FieldLabel>
              <Skeleton className="h-10 w-full" />
            </Field>
            <Field>
              <FieldLabel>Total</FieldLabel>
              <Skeleton className="h-10 w-full" />
            </Field>
          </div>
        </FieldGroup>
      </div>
    </CardContent>
  );
}
