import type {
  PayCollaboratorPayment,
  ConfirmCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import { PayAction } from './PayAction';
import { ConfirmAction } from './ConfirmAction';
import { CancelAction } from './CancelAction';

type CollaboratorPaymentToolbarProps = {
  status: string;
  isPending: boolean;
  onPay: (data: PayCollaboratorPayment) => void;
  onConfirm: (data: ConfirmCollaboratorPayment) => void;
  onCancel: () => void;
};

export function CollaboratorPaymentToolbar({
  status,
  isPending,
  onPay,
  onConfirm,
  onCancel,
}: CollaboratorPaymentToolbarProps) {
  const canPay = status === 'Pending';
  const canConfirm = status === 'Paid';
  const canCancel = status !== 'Canceled';

  return (
    <>
      <PayAction disabled={!canPay} isPending={isPending} onPay={onPay} />
      <ConfirmAction
        disabled={!canConfirm}
        isPending={isPending}
        onConfirm={onConfirm}
      />
      <CancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
