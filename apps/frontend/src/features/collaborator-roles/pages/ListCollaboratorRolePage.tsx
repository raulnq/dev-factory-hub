import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  CollaboratorRolesSkeleton,
  CollaboratorRoleTable,
} from '../components/CollaboratorRoleTable';
import { CollaboratorRoleSearchBar } from '../components/CollaboratorRoleSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListCollaboratorRolePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collaborator Roles"
          description="Search and manage collaborator roles."
          addLink="/collaborator-roles/new"
          addText="Add Role"
        >
          <CollaboratorRoleSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load collaborator roles"
                  />
                )}
              >
                <Suspense fallback={<CollaboratorRolesSkeleton />}>
                  <CollaboratorRoleTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
