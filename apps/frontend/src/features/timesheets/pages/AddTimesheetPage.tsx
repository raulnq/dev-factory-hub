import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddTimesheet } from '#/features/timesheets/schemas';
import { useAddTimesheet } from '../stores/useTimesheets';
import { TimesheetAddForm } from '../components/TimesheetAddForm';

export function AddTimesheetPage() {
  const navigate = useNavigate();
  const add = useAddTimesheet();

  const onSubmit: SubmitHandler<AddTimesheet> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Timesheet created successfully');
      navigate(`/timesheets/${result.timesheetId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save timesheet'
      );
    }
  };

  return (
    <div className="space-y-4">
      <TimesheetAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/timesheets')}
      />
    </div>
  );
}
