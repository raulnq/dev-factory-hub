import { Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { CollaboratorBalanceSearchBar } from '../components/CollaboratorBalanceSearchBar';
import {
  CollaboratorBalanceSkeleton,
  CollaboratorBalanceTable,
} from '../components/CollaboratorBalanceTable';

export function CollaboratorBalancePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Collaborator Balance"
          description="View income and outcome entries for a collaborator by currency."
        >
          <CollaboratorBalanceSearchBar />
        </ListCardHeader>
        <CardContent>
          <CollaboratorBalanceContent />
        </CardContent>
      </Card>
    </div>
  );
}

function CollaboratorBalanceContent() {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') ?? '';
  const collaboratorId = searchParams.get('collaboratorId') ?? '';

  if (!currency || !collaboratorId) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Select a currency and collaborator to view the balance.
      </div>
    );
  }

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={({ resetErrorBoundary }) => (
            <ErrorFallback
              resetErrorBoundary={resetErrorBoundary}
              message="Failed to load collaborator balance"
            />
          )}
        >
          <Suspense fallback={<CollaboratorBalanceSkeleton />}>
            <CollaboratorBalanceTable />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
