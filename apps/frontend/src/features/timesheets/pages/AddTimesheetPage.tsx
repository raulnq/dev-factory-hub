import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddTimesheet } from '#/features/timesheets/schemas';
import { useAddTimesheet } from '../stores/useTimesheets';
import { AddTimesheetForm } from '../components/AddTimesheetForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

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
      <Card>
        <FormCardHeader
          title="Add Timesheet"
          description="Initialize a new timesheet period."
        />
        <AddTimesheetForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Create Timesheet"
          cancelText="Cancel"
          onCancel={() => navigate('/timesheets')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
