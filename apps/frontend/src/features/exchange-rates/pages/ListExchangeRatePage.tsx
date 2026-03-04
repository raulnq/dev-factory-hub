import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ExchangeRatesSkeleton,
  ExchangeRateTable,
} from '../components/ExchangeRateTable';
import { ExchangeRateSearchBar } from '../components/ExchangeRateSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListExchangeRatePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Exchange Rates"
          description="Manage your exchange rates."
          addLink="/exchange-rates/new"
          addText="Add Exchange Rate"
        >
          <ExchangeRateSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load exchange rates"
                  />
                )}
              >
                <Suspense fallback={<ExchangeRatesSkeleton />}>
                  <ExchangeRateTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
