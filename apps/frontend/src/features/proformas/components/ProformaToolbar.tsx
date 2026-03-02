import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { IssueProformaDialog } from './IssueProformaDialog';
import type { IssueProforma } from '#/features/proformas/schemas';

type ProformaToolbarProps = {
  status: string;
  isPending: boolean;
  total: number;
  onCancel: () => void;
  onIssue: (data: IssueProforma) => void;
};

export function ProformaToolbar({
  status,
  isPending,
  onIssue,
  onCancel,
  total,
}: ProformaToolbarProps) {
  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  return (
    <>
      <IssueProformaDialog
        onIssue={onIssue}
        isPending={isPending}
        disabled={total <= 0 || !canIssue}
      />
      <Button
        onClick={onCancel}
        variant="destructive"
        disabled={isPending || !canCancel}
        size="sm"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cancel
      </Button>
    </>
  );
}
