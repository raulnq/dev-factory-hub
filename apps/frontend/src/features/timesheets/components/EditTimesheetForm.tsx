import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { type Timesheet } from '#/features/timesheets/schemas';
import { CardContent } from '@/components/ui/card';

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
            <Input value={timesheet.startDate} type="date" disabled />
          </Field>
          <Field>
            <FieldLabel>End Date</FieldLabel>
            <Input value={timesheet.endDate} type="date" disabled />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input value={timesheet.createdAt.toISOString()} disabled />
          </Field>
          {timesheet.completedAt && (
            <Field>
              <FieldLabel>Completed At</FieldLabel>
              <Input value={timesheet.completedAt} disabled />
            </Field>
          )}
        </div>
      </FieldGroup>
    </CardContent>
  );
}
