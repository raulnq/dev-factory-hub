import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  CollaboratorsSkeleton,
  CollaboratorTable,
} from '../components/CollaboratorTable';
import { CollaboratorSearchBar } from '../components/CollaboratorSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function ListCollaboratorPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collaborators"
          description="Search and manage your collaborators."
          renderAction={
            <AddButton link="/collaborators/new" text="Add Collaborator" />
          }
        >
          <CollaboratorSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load collaborators"
                  />
                )}
              >
                <Suspense fallback={<CollaboratorsSkeleton />}>
                  <CollaboratorTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
