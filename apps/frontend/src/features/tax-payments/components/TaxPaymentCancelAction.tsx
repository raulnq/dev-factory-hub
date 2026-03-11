import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type TaxPaymentCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => Promise<void> | void;
};

export function TaxPaymentCancelAction({
  disabled,
  isPending,
  onCancel,
}: TaxPaymentCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this tax payment? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
