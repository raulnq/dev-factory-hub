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
import type { CompleteTimesheet } from '#/features/timesheets/schemas';
import { TimesheetGrid } from '../components/TimesheetGrid';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorFallback } from '@/components/ErrorFallback';
import { TimesheetEditForm } from '../components/TimesheetEditForm';
import { TimesheetSkeleton } from '../components/TimesheetSkeleton';
import { ListCardHeader } from '@/components/ListCardHeader';
import { AddProjectAction } from '../components/AddProjectAction';

export function EditTimesheetPage() {
  const { timesheetId } = useParams<{ timesheetId: string }>();
  const complete = useCompleteTimesheet(timesheetId ?? '');

  const handleComplete = async (data: CompleteTimesheet) => {
    try {
      await complete.mutateAsync(data);
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
  onComplete: (data: CompleteTimesheet) => void;
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
      <TimesheetEditForm
        timesheet={ts}
        onCancel={() => navigate('/timesheets')}
        onComplete={onComplete}
        isPending={isPending}
      />

      <Card>
        <ListCardHeader
          title="All Projects"
          description="Manage your projects."
          renderAction={
            ts.status === 'Pending' && (
              <AddProjectAction onAdd={handleAddProject} />
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
