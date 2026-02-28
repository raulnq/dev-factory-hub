import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  TimesheetsSkeleton,
  TimesheetTable,
} from '../components/TimesheetTable';
import { TimesheetSearchBar } from '../components/TimesheetSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListTimesheetPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Timesheets"
          description="Manage and track collaborator hours."
          addLink="/timesheets/new"
          addText="Add Timesheet"
        >
          <TimesheetSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load timesheets"
                  />
                )}
              >
                <Suspense fallback={<TimesheetsSkeleton />}>
                  <TimesheetTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
