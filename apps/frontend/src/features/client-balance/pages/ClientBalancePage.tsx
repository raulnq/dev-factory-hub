import { Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ClientBalanceSearchBar } from '../components/ClientBalanceSearchBar';
import {
  ClientBalanceSkeleton,
  ClientBalanceTable,
} from '../components/ClientBalanceTable';

export function ClientBalancePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Client Balance"
          description="View income and outcome entries for a client by currency."
        >
          <ClientBalanceSearchBar />
        </ListCardHeader>
        <CardContent>
          <ClientBalanceContent />
        </CardContent>
      </Card>
    </div>
  );
}

function ClientBalanceContent() {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') ?? '';
  const clientId = searchParams.get('clientId') ?? '';

  if (!currency || !clientId) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Select a currency and client to view the balance.
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
              message="Failed to load client balance"
            />
          )}
        >
          <Suspense fallback={<ClientBalanceSkeleton />}>
            <ClientBalanceTable />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
