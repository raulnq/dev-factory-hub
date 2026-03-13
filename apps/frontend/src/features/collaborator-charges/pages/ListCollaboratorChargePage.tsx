import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  CollaboratorChargesSkeleton,
  CollaboratorChargeTable,
} from '../components/CollaboratorChargeTable';
import { CollaboratorChargeSearchBar } from '../components/CollaboratorChargeSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function ListCollaboratorChargePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collaborator Charges"
          description="Manage collaborator charges."
          renderAction={
            <AddButton link="/collaborator-charges/new" text="Add Charge" />
          }
        >
          <CollaboratorChargeSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load collaborator charges"
                  />
                )}
              >
                <Suspense fallback={<CollaboratorChargesSkeleton />}>
                  <CollaboratorChargeTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
