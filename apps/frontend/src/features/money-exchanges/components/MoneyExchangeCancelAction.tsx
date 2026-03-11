import { XCircle } from 'lucide-react';
import { UncontrolledConfirmDialog } from '@/components/UncontrolledConfirmDialog';

type MoneyExchangeCancelActionProps = {
  disabled: boolean;
  isPending: boolean;
  onCancel: () => Promise<void> | void;
};

export function MoneyExchangeCancelAction({
  disabled,
  isPending,
  onCancel,
}: MoneyExchangeCancelActionProps) {
  return (
    <UncontrolledConfirmDialog
      label="Cancel"
      description="Are you sure you want to cancel this money exchange? This action cannot be undone."
      isPending={isPending}
      disabled={disabled}
      onConfirm={onCancel}
      icon={<XCircle className="h-4 w-4 mr-2" />}
    />
  );
}
