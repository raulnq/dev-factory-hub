import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PayrollPaymentSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Collaborator</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Net Salary</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Pension Amount</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Gross Salary</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Commission</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Taxes</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Paid At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Pension Paid At</FieldLabel>
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
