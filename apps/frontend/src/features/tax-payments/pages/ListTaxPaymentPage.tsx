import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import {
  TaxPaymentTable,
  TaxPaymentsSkeleton,
} from '../components/TaxPaymentTable';
import { TaxPaymentSearchBar } from '../components/TaxPaymentSearchBar';

export function ListTaxPaymentPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Tax Payments"
          description="Manage your tax payments."
          addLink="/tax-payments/new"
          addText="Add Tax Payment"
        >
          <TaxPaymentSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load tax payments"
                  />
                )}
              >
                <Suspense fallback={<TaxPaymentsSkeleton />}>
                  <TaxPaymentTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
