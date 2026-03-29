import { ProformaIssueAction } from './ProformaIssueAction';
import type { IssueProforma } from '#/features/proformas/schemas';
import { ProformaCancelAction } from './ProformaCancelAction';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type ProformaToolbarProps = {
  status: string;
  isPending: boolean;
  total: number;
  filePath: string | null;
  onCancel: () => void;
  onIssue: (data: IssueProforma) => void;
  onDownload: () => void;
};

export function ProformaToolbar({
  status,
  isPending,
  onIssue,
  onCancel,
  onDownload,
  total,
  filePath,
}: ProformaToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canDownload = !!filePath;
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canDownload || isPending}
        onClick={onDownload}
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <ProformaIssueAction
        onIssue={onIssue}
        isPending={isPending}
        disabled={total <= 0 || !canIssue}
      />
      <ProformaCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
