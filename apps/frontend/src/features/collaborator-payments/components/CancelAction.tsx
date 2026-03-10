import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type CancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function CancelAction({
  disabled,
  isPending,
  onCancel,
}: CancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel Payment"
      description="Are you sure you want to cancel this payment? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
