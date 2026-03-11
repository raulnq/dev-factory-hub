import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type InvoiceCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function InvoiceCancelAction({
  disabled,
  isPending,
  onCancel,
}: InvoiceCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this invoice? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
