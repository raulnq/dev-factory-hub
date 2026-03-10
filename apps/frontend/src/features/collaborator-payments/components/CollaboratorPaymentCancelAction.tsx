import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type CollaboratorPaymentCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function CollaboratorPaymentCancelAction({
  disabled,
  isPending,
  onCancel,
}: CollaboratorPaymentCancelActionProps) {
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
