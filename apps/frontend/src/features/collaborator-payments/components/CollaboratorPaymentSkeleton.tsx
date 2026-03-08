import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { FormCardSkeleton } from '@/components/FormCardSkeleton';

export function CollaboratorPaymentSkeleton() {
  return (
    <FormCardSkeleton>
      <FieldGroup>
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
      </FieldGroup>
    </FormCardSkeleton>
  );
}
