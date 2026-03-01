import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function InvoiceSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <Field>
          <FieldLabel>Client</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Taxes</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Exchange Rate</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </div>
    </CardContent>
  );
}
