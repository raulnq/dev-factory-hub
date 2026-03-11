import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditInvoice, IssueInvoice } from '#/features/invoices/schemas';
import {
  useInvoiceSuspense,
  useEditInvoice,
  useIssueInvoice,
  useCancelInvoice,
} from '../stores/useInvoices';
import { InvoiceEditForm } from '../components/InvoiceEditForm';
import { InvoiceSkeleton } from '../components/InvoiceSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import type { Invoice } from '#/features/invoices/schemas';
import type { SubmitHandler } from 'react-hook-form';

export function EditInvoicePage() {
  const { invoiceId } = useParams() as { invoiceId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load invoice"
              />
            )}
          >
            <Suspense fallback={<InvoiceSkeleton />}>
              <EditInvoiceInner
                invoiceId={invoiceId}
                onCancel={() => navigate('/invoices')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

function EditInvoiceInner({
  invoiceId,
  onCancel,
}: {
  invoiceId: string;
  onCancel: () => void;
}) {
  const { data: invoice } = useInvoiceSuspense(invoiceId);
  const edit = useEditInvoice(invoiceId);
  const issue = useIssueInvoice(invoiceId);
  const cancel = useCancelInvoice(invoiceId);

  const handleSubmit: SubmitHandler<EditInvoice> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Invoice updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update invoice'
      );
    }
  };

  const handleIssue: SubmitHandler<IssueInvoice> = async data => {
    try {
      await issue.mutateAsync(data);
      toast.success('Invoice issued successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to issue invoice'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Invoice canceled successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel invoice'
      );
    }
  };

  const isPending = edit.isPending || issue.isPending || cancel.isPending;

  return (
    <InvoiceEditForm
      invoice={invoice as Invoice}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onInvoiceCancel={handleCancel}
      onInvoiceIssue={handleIssue}
    />
  );
}
