import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ClientTable, ClientsSkeleton } from '../components/ClientTable';
import { ClientSearchBar } from '../components/ClientSearchBar';

export function ListClientPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Clients"
          description="Search and manage your clients."
          addLink="/clients/new"
          addText="Add Client"
        >
          <ClientSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load clients"
                  />
                )}
              >
                <Suspense fallback={<ClientsSkeleton />}>
                  <ClientTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
