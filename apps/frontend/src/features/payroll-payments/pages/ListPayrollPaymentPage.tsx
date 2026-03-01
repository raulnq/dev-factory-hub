import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  PayrollPaymentsSkeleton,
  PayrollPaymentTable,
} from '../components/PayrollPaymentTable';
import { PayrollPaymentSearchBar } from '../components/PayrollPaymentSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListPayrollPaymentPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Payroll Payments"
          description="Manage your payroll payments."
          addLink="/payroll-payments/new"
          addText="Add Payroll Payment"
        >
          <PayrollPaymentSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load payroll payments"
                  />
                )}
              >
                <Suspense fallback={<PayrollPaymentsSkeleton />}>
                  <PayrollPaymentTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
