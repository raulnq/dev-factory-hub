import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { EditTaxPaymentForm } from '../components/EditTaxPaymentForm';
import { TaxPaymentItemsSection } from '../components/TaxPaymentItemsSection';
import { TaxPaymentSkeleton } from '../components/TaxPaymentSkeleton';
import {
  useTaxPaymentSuspense,
  useEditTaxPayment,
  usePayTaxPayment,
  useCancelTaxPayment,
} from '../stores/useTaxPayments';
import { toast } from 'sonner';
import type {
  EditTaxPayment,
  PayTaxPayment,
} from '#/features/tax-payments/schemas';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '../utils/status-variants';
import { TaxPaymentToolbar } from '../components/TaxPaymentToolbar';

export function EditTaxPaymentPage() {
  const { taxPaymentId } = useParams() as { taxPaymentId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load tax payment"
              />
            )}
          >
            <Suspense fallback={<TaxPaymentSkeleton />}>
              <EditTaxPaymentInner
                taxPaymentId={taxPaymentId}
                onCancel={() => navigate('/tax-payments')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

function EditTaxPaymentInner({
  taxPaymentId,
  onCancel,
}: {
  taxPaymentId: string;
  onCancel: () => void;
}) {
  const { data: taxPayment } = useTaxPaymentSuspense(taxPaymentId);
  const edit = useEditTaxPayment(taxPaymentId);
  const pay = usePayTaxPayment(taxPaymentId);
  const cancel = useCancelTaxPayment(taxPaymentId);

  const handleSubmit = async (data: EditTaxPayment) => {
    try {
      await edit.mutateAsync(data);
      toast.success('Tax payment updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update');
    }
  };

  const handlePay = async (data: PayTaxPayment) => {
    try {
      await pay.mutateAsync(data);
      toast.success('Tax payment marked as paid');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to pay');
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Tax payment cancelled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel');
    }
  };

  const isMutating = edit.isPending || pay.isPending || cancel.isPending;
  const isStatusPending = taxPayment.status === 'Pending';

  return (
    <div className="space-y-6">
      <Card>
        <FormCardHeader
          title={`Edit Tax Payment`}
          description="Update tax payment details."
          renderAction={
            taxPayment.status && (
              <Badge variant={getStatusVariant(taxPayment.status)}>
                {taxPayment.status}
              </Badge>
            )
          }
        >
          <TaxPaymentToolbar
            onCancel={handleCancel}
            onPay={handlePay}
            isPending={isMutating}
            status={taxPayment.status}
          />
        </FormCardHeader>
        <EditTaxPaymentForm
          taxPayment={taxPayment}
          onSubmit={handleSubmit}
          isPending={edit.isPending}
        />
        <FormCardFooter
          formId={isStatusPending ? 'tax-payment-form' : undefined}
          isPending={isMutating}
          onCancel={onCancel}
        />
      </Card>

      <TaxPaymentItemsSection
        taxPaymentId={taxPaymentId}
        status={taxPayment.status}
      />
    </div>
  );
}
