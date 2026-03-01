import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

type ProformaToolbarProps = {
  status: string;
  isPending: boolean;
  total: number;
  onCancel: () => void;
  onIssue: () => void;
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
      <Button
        onClick={onIssue}
        disabled={isPending || total <= 0 || !canIssue}
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Issue
      </Button>
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
