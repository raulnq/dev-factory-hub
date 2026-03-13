import type { PayCollaboratorCharge } from '#/features/collaborator-charges/schemas';
import { CollaboratorChargePayAction } from './CollaboratorChargePayAction';
import { CollaboratorChargeCancelAction } from './CollaboratorChargeCancelAction';

type CollaboratorChargeToolbarProps = {
  status: string;
  isPending: boolean;
  onPay: (data: PayCollaboratorCharge) => void;
  onCancel: () => void;
};

export function CollaboratorChargeToolbar({
  status,
  isPending,
  onPay,
  onCancel,
}: CollaboratorChargeToolbarProps) {
  const canPay = status === 'Pending';
  const canCancel = status !== 'Canceled';

  return (
    <>
      <CollaboratorChargePayAction
        disabled={!canPay}
        isPending={isPending}
        onPay={onPay}
      />
      <CollaboratorChargeCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
