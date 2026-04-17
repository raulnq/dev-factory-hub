import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IssueInvoice } from '#/features/invoices/schemas';
import { InvoiceIssueAction } from './InvoiceIssueAction';
import { InvoiceCancelAction } from './InvoiceCancelAction';
import { InvoiceUploadAction } from './InvoiceUploadAction';

type InvoiceToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onIssue(data: IssueInvoice): void;
  onCancel: () => void;
  onUpload: (file: File) => Promise<void> | void;
  onDownload: () => void;
  total: number;
};

export function InvoiceToolbar({
  status,
  filePath,
  isPending,
  onIssue,
  onCancel,
  onUpload,
  onDownload,
  total,
}: InvoiceToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Issued';
  const canDownload = filePath !== null && filePath !== '';

  return (
    <>
      <InvoiceIssueAction
        disabled={!canIssue || total <= 0}
        onIssue={onIssue}
        isPending={isPending}
      />
      <InvoiceCancelAction
        disabled={!canCancel}
        onCancel={onCancel}
        isPending={isPending}
      />
      <InvoiceUploadAction
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
