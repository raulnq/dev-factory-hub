import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import {
  type CompleteTimesheet,
  type Timesheet,
} from '#/features/timesheets/schemas';
import { FormCard } from '@/components/FormCard';
import { DateReadOnlyField } from '@/components/DateReadOnlyField';
import { TimesheetToolbar } from './TimesheetToolbar';
import { StatusBadge } from '@/components/StatusBadge';
import { getStatusVariant } from '../utils/status-variants';

type EditTimesheetFormProps = {
  timesheet: Timesheet;
  onCancel: () => void;
  onComplete: (data: CompleteTimesheet) => void;
  isPending: boolean;
};

export function EditTimesheetForm({
  timesheet,
  onCancel,
  onComplete,
  isPending,
}: EditTimesheetFormProps) {
  const isEditable = timesheet.status === 'Pending';
  return (
    <FormCard
      title="Edit Timesheet"
      description="Edit timesheet details."
      onCancel={onCancel}
      readOnly={!isEditable}
      renderAction={
        <TimesheetToolbar
          status={timesheet.status}
          onComplete={onComplete}
          isPending={isPending}
        />
      }
      renderTitleSuffix={
        <StatusBadge
          status={timesheet.status}
          variant={getStatusVariant(timesheet.status)}
        />
      }
    >
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
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <DateReadOnlyField value={timesheet.createdAt} />
          </Field>
          <Field>
            <FieldLabel>Completed At</FieldLabel>
            <DateReadOnlyField value={timesheet.completedAt} />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
