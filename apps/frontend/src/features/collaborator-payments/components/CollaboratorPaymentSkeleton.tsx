import { Field, FieldLabel } from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CollaboratorPaymentSkeleton() {
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
            <FieldLabel>Gross Salary</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Withholding</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Net Salary</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </div>
    </CardContent>
  );
}
