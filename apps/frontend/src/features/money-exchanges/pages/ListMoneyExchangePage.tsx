import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  MoneyExchangesSkeleton,
  MoneyExchangeTable,
} from '../components/MoneyExchangeTable';
import { MoneyExchangeSearchBar } from '../components/MoneyExchangeSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function ListMoneyExchangePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Money Exchanges"
          description="Manage your money exchanges."
          renderAction={
            <AddButton link="/money-exchanges/new" text="Add Money Exchange" />
          }
        >
          <MoneyExchangeSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load money exchanges"
                  />
                )}
              >
                <Suspense fallback={<MoneyExchangesSkeleton />}>
                  <MoneyExchangeTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
