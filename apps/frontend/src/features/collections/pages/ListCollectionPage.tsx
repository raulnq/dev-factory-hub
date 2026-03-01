import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  CollectionsSkeleton,
  CollectionTable,
} from '../components/CollectionTable';
import { CollectionSearchBar } from '../components/CollectionSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListCollectionPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collections"
          description="Manage client collections."
          addLink="/collections/new"
          addText="Add Collection"
        >
          <CollectionSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load collections"
                  />
                )}
              >
                <Suspense fallback={<CollectionsSkeleton />}>
                  <CollectionTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
