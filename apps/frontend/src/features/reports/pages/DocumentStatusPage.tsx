import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  DocumentStatusSkeleton,
  DocumentStatusTable,
} from '../components/DocumentStatusTable';
import { DocumentStatusFilterBar } from '../components/DocumentStatusFilterBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function DocumentStatusPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Document Status"
          description="Review which documents have attachments for a given month and year."
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
