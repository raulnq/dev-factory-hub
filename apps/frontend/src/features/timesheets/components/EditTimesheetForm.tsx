import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { type Timesheet } from '#/features/timesheets/schemas';
import { CardContent } from '@/components/ui/card';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';

type EditTimesheetFormProps = {
  timesheet: Timesheet;
};

export function EditTimesheetForm({ timesheet }: EditTimesheetFormProps) {
  return (
    <CardContent className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Collaborator</FieldLabel>
          <Input value={timesheet.collaboratorName ?? 'N/A'} disabled />
        </Field>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <Input value={timesheet.collaboratorRoleName ?? 'N/A'} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <DateReadOnlyField value={timesheet.startDate} />
          </Field>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <DateReadOnlyField value={timesheet.endDate} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={timesheet.createdAt} />
          </Field>
          {timesheet.completedAt && (
            <Field>
              <FieldLabel>Completed At</FieldLabel>
              <DateReadOnlyField value={timesheet.completedAt} />
            </Field>
          )}
        </div>
      </FieldGroup>
    </CardContent>
  );
}
