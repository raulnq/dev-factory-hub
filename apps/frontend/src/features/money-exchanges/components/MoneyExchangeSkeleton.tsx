import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MoneyExchangeSkeleton() {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>From Currency</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>To Currency</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Rate</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>From Amount</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>To Amount</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>From Taxes</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>To Taxes</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </div>
    </CardContent>
  );
}
