import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormSkeleton } from '@/components/FormCard';

export function InvoiceSkeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
        <Field>
          <FieldLabel>Client</FieldLabel>
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
        <FieldSeparator />
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Exchange Rate</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormSkeleton>
  );
}
