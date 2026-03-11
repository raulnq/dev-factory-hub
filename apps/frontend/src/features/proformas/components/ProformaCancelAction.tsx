import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type ProformaCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function ProformaCancelAction({
  disabled,
  isPending,
  onCancel,
}: ProformaCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this proforma? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
