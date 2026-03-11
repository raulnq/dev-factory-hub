import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IssueMoneyExchange } from '#/features/money-exchanges/schemas';
import { MoneyExchangeIssueAction } from './MoneyExchangeIssueAction';
import { MoneyExchangeCancelAction } from './MoneyExchangeCancelAction';
import { MoneyExchangeUploadAction } from './MoneyExchangeUploadAction';

type MoneyExchangeToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onIssue: (data: IssueMoneyExchange) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onUpload: (file: File) => Promise<void> | void;
  onDownload: () => void;
};

export function MoneyExchangeToolbar({
  status,
  filePath,
  isPending,
  onIssue,
  onCancel,
  onUpload,
  onDownload,
}: MoneyExchangeToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Issued';
  const canDownload = filePath !== null && filePath !== '';

  return (
    <>
      <MoneyExchangeIssueAction
        disabled={!canIssue}
        isPending={isPending}
        onIssue={onIssue}
      />

      <MoneyExchangeCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />

      <MoneyExchangeUploadAction
        disabled={!canUpload}
        isPending={isPending}
        onUpload={onUpload}
      />

      <Button
        type="button"
        onClick={onDownload}
        disabled={isPending || !canDownload}
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </>
  );
}
