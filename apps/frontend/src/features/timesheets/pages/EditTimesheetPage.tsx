import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useTimesheetSuspense,
  useCompleteTimesheet,
  useAddProjectToTimesheet,
} from '../stores/useTimesheets';
import { TimesheetGrid } from '../components/TimesheetGrid';
import { Card, CardContent } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { EditTimesheetForm } from '../components/EditTimesheetForm';
import { TimesheetSkeleton } from '../components/TimesheetSkeleton';
import { FormCardFooter } from '@/components/FormCardFooter';
import { TimesheetToolbar } from '../components/TimesheetToolbar';
import { getStatusVariant } from '../utils/status-variants';
import { Badge } from '@/components/ui/badge';
import { ListCardHeader } from '@/components/ListCardHeader';
import { AddProjectButton } from '../components/AddProjectButton';

export function EditTimesheetPage() {
  const { timesheetId } = useParams<{ timesheetId: string }>();
  const complete = useCompleteTimesheet(timesheetId ?? '');

  const handleComplete = async () => {
    try {
      await complete.mutateAsync();
      toast.success('Timesheet completed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to complete timesheet'
      );
    }
  };

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load timesheet"
              />
            )}
          >
            <Suspense fallback={<TimesheetSkeleton />}>
              <InnerEditTimesheet
                timesheetId={timesheetId!}
                onComplete={handleComplete}
                isPending={complete.isPending}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerEditTimesheetProp = {
  timesheetId: string;
  onComplete: () => void;
  isPending: boolean;
};

function InnerEditTimesheet({
  timesheetId,
  onComplete,
  isPending,
}: InnerEditTimesheetProp) {
  const { data: ts } = useTimesheetSuspense(timesheetId);
  const addProject = useAddProjectToTimesheet(timesheetId);
  const handleAddProject = async (projectId: string) => {
    try {
      await addProject.mutateAsync(projectId);
      toast.success('Project added');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add project'
      );
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <Card>
        <FormCardHeader
          title="Edit Timesheet"
          description="Edit timesheet details."
          renderAction={
            ts.status && (
              <Badge variant={getStatusVariant(ts.status)}>{ts.status}</Badge>
            )
          }
        >
          <TimesheetToolbar
            status={ts.status}
            onComplete={onComplete}
            isPending={isPending}
          />
        </FormCardHeader>
        <EditTimesheetForm timesheet={ts} />
        <FormCardFooter
          cancelText="Back to List"
          onCancel={() => navigate('/timesheets')}
        />
      </Card>

      <Card>
        <ListCardHeader
          title="All Projects"
          description="Manage your projects."
          renderAction={
            ts.status === 'Pending' && (
              <AddProjectButton onAdd={handleAddProject} />
            )
          }
        />
        <CardContent className="pt-6 overflow-hidden">
          <TimesheetGrid
            timesheetId={ts.timesheetId}
            startDate={ts.startDate}
            endDate={ts.endDate}
            status={ts.status}
          />
        </CardContent>
      </Card>
    </>
  );
}
