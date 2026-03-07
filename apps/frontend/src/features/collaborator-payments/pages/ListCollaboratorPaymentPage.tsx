import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  CollaboratorPaymentsSkeleton,
  CollaboratorPaymentTable,
} from '../components/CollaboratorPaymentTable';
import { CollaboratorPaymentSearchBar } from '../components/CollaboratorPaymentSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function ListCollaboratorPaymentPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collaborator Payments"
          description="Manage collaborator salary payments."
          renderAction={
            <AddButton link="/collaborator-payments/new" text="Add Payment" />
          }
        >
          <CollaboratorPaymentSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load collaborator payments"
                  />
                )}
              >
                <Suspense fallback={<CollaboratorPaymentsSkeleton />}>
                  <CollaboratorPaymentTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
