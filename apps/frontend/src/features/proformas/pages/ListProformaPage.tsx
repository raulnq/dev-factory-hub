import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ProformaTable, ProformasSkeleton } from '../components/ProformaTable';
import { ProformaSearchBar } from '../components/ProformaSearchBar';

export function ListProformaPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Proformas"
          description="Manage your proformas."
          addLink="/proformas/new"
          addText="Add Proforma"
        >
          <ProformaSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load proformas"
                  />
                )}
              >
                <Suspense fallback={<ProformasSkeleton />}>
                  <ProformaTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
