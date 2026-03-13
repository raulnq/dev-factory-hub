import { Skeleton } from '@/components/ui/skeleton';
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { FormSkeleton } from '@/components/FormCard';

export function CollaboratorChargeSkeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Collaborator</FieldLabel>
            <Skeleton className="h-9" />
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Skeleton className="h-9" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Amount</FieldLabel>
          <Skeleton className="h-9" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Skeleton className="h-16" />
        </Field>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9" />
          </Field>
          <Field>
            <FieldLabel>Issued At</FieldLabel>
            <Skeleton className="h-9" />
          </Field>
          <Field>
            <FieldLabel>Canceled At</FieldLabel>
            <Skeleton className="h-9" />
          </Field>
        </div>
      </FieldGroup>
    </FormSkeleton>
  );
}
