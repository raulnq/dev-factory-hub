import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import {
  DocumentStatusSkeleton,
  DocumentStatusTable,
} from '../components/DocumentStatusTable';
import { DocumentStatusFilterBar } from '../components/DocumentStatusFilterBar';
import { SendMonthlyStatementAction } from '../components/SendMonthlyStatementAction';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function DocumentStatusPage() {
  const [searchParams] = useSearchParams();
  const now = new Date();
  const month = searchParams.get('month') ?? String(now.getMonth() + 1);
  const year = searchParams.get('year') ?? String(now.getFullYear());

  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Document Status"
          description="Review which documents have attachments for a given month and year."
          renderAction={
            <SendMonthlyStatementAction
              initialMonth={month}
              initialYear={year}
            />
          }
        >
          <DocumentStatusFilterBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load document status report"
                  />
                )}
              >
                <Suspense fallback={<DocumentStatusSkeleton />}>
                  <DocumentStatusTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
