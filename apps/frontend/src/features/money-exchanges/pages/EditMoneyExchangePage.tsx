import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  EditMoneyExchange,
  IssueMoneyExchange,
  MoneyExchange,
} from '#/features/money-exchanges/schemas';
import {
  useMoneyExchangeSuspense,
  useEditMoneyExchange,
  useIssueMoneyExchange,
  useCancelMoneyExchange,
  useUploadMoneyExchange,
  useMoneyExchangeDownloadUrl,
} from '../stores/useMoneyExchanges';
import { EditMoneyExchangeForm } from '../components/EditMoneyExchangeForm';
import { MoneyExchangeSkeleton } from '../components/MoneyExchangeSkeleton';
import { MoneyExchangeToolbar } from '../components/MoneyExchangeToolbar';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';

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

export function EditMoneyExchangePage() {
  const { moneyExchangeId } = useParams() as { moneyExchangeId: string };
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
                  message="Failed to load money exchange"
                />
              )}
            >
              <Suspense fallback={<MoneyExchangeSkeleton />}>
                <EditMoneyExchangeInner
                  moneyExchangeId={moneyExchangeId}
                  onCancel={() => navigate('/money-exchanges')}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Card>
    </div>
  );
}

type EditMoneyExchangeInnerProps = {
  moneyExchangeId: string;
  onCancel: () => void;
};

function EditMoneyExchangeInner({
  moneyExchangeId,
  onCancel,
}: EditMoneyExchangeInnerProps) {
  const { data: moneyExchange } = useMoneyExchangeSuspense(moneyExchangeId);
  const edit = useEditMoneyExchange(moneyExchangeId);
  const issue = useIssueMoneyExchange(moneyExchangeId);
  const cancel = useCancelMoneyExchange(moneyExchangeId);
  const upload = useUploadMoneyExchange(moneyExchangeId);
  const downloadUrl = useMoneyExchangeDownloadUrl(moneyExchangeId);

  const handleSubmit: SubmitHandler<EditMoneyExchange> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Money exchange updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update money exchange'
      );
    }
  };

  const handleIssue = async (data: IssueMoneyExchange) => {
    try {
      await issue.mutateAsync(data);
      toast.success('Money exchange issued successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to issue money exchange'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Money exchange canceled');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to cancel money exchange'
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

  const isStatusPending = moneyExchange.status === 'Pending';

  return (
    <>
      <FormCardHeader
        title="Edit Money Exchange"
        description="Update money exchange details."
        renderAction={
          <Badge variant={statusVariant(moneyExchange.status)}>
            {moneyExchange.status}
          </Badge>
        }
      >
        <MoneyExchangeToolbar
          status={moneyExchange.status}
          filePath={moneyExchange.filePath}
          isPending={isPending}
          onIssue={handleIssue}
          onCancel={handleCancel}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </FormCardHeader>
      <EditMoneyExchangeForm
        moneyExchange={moneyExchange as MoneyExchange}
        isPending={edit.isPending}
        onSubmit={handleSubmit}
      />
      <FormCardFooter
        formId={isStatusPending ? 'form' : undefined}
        saveText="Save Money Exchange"
        cancelText="Back"
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
