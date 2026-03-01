import { Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { BankBalanceSearchBar } from '../components/BankBalanceSearchBar';
import {
  BankBalanceSkeleton,
  BankBalanceTable,
} from '../components/BankBalanceTable';

export function BankBalancePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Bank Balance"
          description="View your income and outcome transactions by currency."
        >
          <BankBalanceSearchBar />
        </ListCardHeader>
        <CardContent>
          <BankBalanceContent />
        </CardContent>
      </Card>
    </div>
  );
}

function BankBalanceContent() {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') ?? '';

  if (!currency) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Select a currency to view the bank balance.
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
              message="Failed to load bank balance"
            />
          )}
        >
          <Suspense fallback={<BankBalanceSkeleton />}>
            <BankBalanceTable />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
