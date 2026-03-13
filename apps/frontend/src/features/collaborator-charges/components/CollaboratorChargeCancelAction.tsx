import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type CollaboratorChargeCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function CollaboratorChargeCancelAction({
  disabled,
  isPending,
  onCancel,
}: CollaboratorChargeCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this charge? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
