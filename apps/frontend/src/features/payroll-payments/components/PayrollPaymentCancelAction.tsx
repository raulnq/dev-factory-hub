import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type PayrollPaymentCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => Promise<void> | void;
};

export function PayrollPaymentCancelAction({
  disabled,
  isPending,
  onCancel,
}: PayrollPaymentCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this payroll payment? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
