import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';

export function TimesheetSkeleton() {
  return (
    <>
      <Card>
        <FormCardHeader
          title="Edit Timesheet"
          description="Edit timesheet details."
        />
        <CardContent className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Collaborator</FieldLabel>
              <Skeleton className="h-9 w-full" />
            </Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Skeleton className="h-9 w-full" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Start Date</FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>
              <Field>
                <FieldLabel>End Date</FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Approved At</FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>
              <Field>
                <FieldLabel>Contract Signed At</FieldLabel>
                <Skeleton className="h-9 w-full" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
        <FormCardFooter cancelText="Back to List" />
      </Card>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </>
  );
}
