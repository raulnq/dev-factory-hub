import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IssueTransaction } from '#/features/transactions/schemas';
import { TransactionIssueAction } from './TransactionIssueAction';
import { TransactionCancelAction } from './TransactionCancelAction';
import { TransactionUploadAction } from './TransactionUploadAction';

type TransactionToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onIssue: (data: IssueTransaction) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onUpload: (file: File) => Promise<void> | void;
  onDownload: () => void;
};

export function TransactionToolbar({
  status,
  filePath,
  isPending,
  onIssue,
  onCancel,
  onUpload,
  onDownload,
}: TransactionToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Issued';
  const canDownload = filePath !== null && filePath !== '';

  return (
    <>
      <TransactionIssueAction
        disabled={!canIssue}
        isPending={isPending}
        onIssue={onIssue}
      />

      <TransactionCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />

      <TransactionUploadAction
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
