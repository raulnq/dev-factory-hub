import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  TransactionsSkeleton,
  TransactionTable,
} from '../components/TransactionTable';
import { TransactionSearchBar } from '../components/TransactionSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListTransactionPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Transactions"
          description="Manage your transactions."
          addLink="/transactions/new"
          addText="Add Transaction"
        >
          <TransactionSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load transactions"
                  />
                )}
              >
                <Suspense fallback={<TransactionsSkeleton />}>
                  <TransactionTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
