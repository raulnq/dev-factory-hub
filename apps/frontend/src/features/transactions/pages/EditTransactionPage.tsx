import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  EditTransaction,
  IssueTransaction,
} from '#/features/transactions/schemas';
import {
  useTransactionSuspense,
  useEditTransaction,
  useIssueTransaction,
  useCancelTransaction,
  useUploadTransaction,
  useTransactionDownloadUrl,
} from '../stores/useTransactions';
import { EditTransactionForm } from '../components/EditTransactionForm';
import { TransactionSkeleton } from '../components/TransactionSkeleton';
import { TransactionToolbar } from '../components/TransactionToolbar';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
import type { Transaction } from '#/features/transactions/schemas';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Issued':
      return 'secondary';
    case 'Canceled':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function EditTransactionPage() {
  const { transactionId } = useParams() as { transactionId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load transaction"
                />
              )}
            >
              <Suspense fallback={<TransactionSkeleton />}>
                <EditTransactionInner
                  transactionId={transactionId}
                  onCancel={() => navigate('/transactions')}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Card>
    </div>
  );
}

type EditTransactionInnerProps = {
  transactionId: string;
  onCancel: () => void;
};

function EditTransactionInner({
  transactionId,
  onCancel,
}: EditTransactionInnerProps) {
  const { data: transaction } = useTransactionSuspense(transactionId);
  const edit = useEditTransaction(transactionId);
  const issue = useIssueTransaction(transactionId);
  const cancel = useCancelTransaction(transactionId);
  const upload = useUploadTransaction(transactionId);
  const downloadUrl = useTransactionDownloadUrl(transactionId);

  const handleSubmit: SubmitHandler<EditTransaction> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Transaction updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update transaction'
      );
    }
  };

  const handleIssue = async (data: IssueTransaction) => {
    try {
      await issue.mutateAsync(data);
      toast.success('Transaction issued successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to issue transaction'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Transaction canceled');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel transaction'
      );
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload.mutateAsync(file);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadUrl.mutateAsync();
      window.open(result.url, '_blank');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get download URL'
      );
    }
  };

  const isPending =
    edit.isPending ||
    issue.isPending ||
    cancel.isPending ||
    upload.isPending ||
    downloadUrl.isPending;

  const isStatusPending = transaction.status === 'Pending';

  return (
    <>
      <FormCardHeader
        title={`Edit Transaction`}
        description="Update transaction details."
        renderAction={
          <Badge variant={statusVariant(transaction.status)}>
            {transaction.status}
          </Badge>
        }
      >
        <TransactionToolbar
          status={transaction.status}
          filePath={transaction.filePath}
          isPending={isPending}
          onIssue={handleIssue}
          onCancel={handleCancel}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </FormCardHeader>
      <EditTransactionForm
        transaction={transaction as Transaction}
        isPending={edit.isPending}
        onSubmit={handleSubmit}
      />
      <FormCardFooter
        formId={isStatusPending ? 'form' : undefined}
        saveText="Save Transaction"
        cancelText="Back"
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
