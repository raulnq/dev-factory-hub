import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { InvoiceTable, InvoicesSkeleton } from '../components/InvoiceTable';
import { InvoiceSearchBar } from '../components/InvoiceSearchBar';

export function ListInvoicePage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Invoices"
          description="Manage your invoices."
          addLink="/invoices/new"
          addText="Add Invoice"
        >
          <InvoiceSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load invoices"
                  />
                )}
              >
                <Suspense fallback={<InvoicesSkeleton />}>
                  <InvoiceTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
