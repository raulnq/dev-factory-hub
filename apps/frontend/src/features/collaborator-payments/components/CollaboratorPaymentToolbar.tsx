import type {
  PayCollaboratorPayment,
  ConfirmCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import { CollaboratorPaymentPayAction } from './CollaboratorPaymentPayAction';
import { CollaboratorPaymentConfirmAction } from './CollaboratorPaymentConfirmAction';
import { CollaboratorPaymentCancelAction } from './CollaboratorPaymentCancelAction';

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
      <CollaboratorPaymentPayAction
        disabled={!canPay}
        isPending={isPending}
        onPay={onPay}
      />
      <CollaboratorPaymentConfirmAction
        disabled={!canConfirm}
        isPending={isPending}
        onConfirm={onConfirm}
      />
      <CollaboratorPaymentCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
