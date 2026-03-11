import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type CollectionCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => Promise<void> | void;
};

export function CollectionCancelAction({
  disabled,
  isPending,
  onCancel,
}: CollectionCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this collection? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
