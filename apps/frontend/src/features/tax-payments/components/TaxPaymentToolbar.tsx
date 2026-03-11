import type { PayTaxPayment } from '#/features/tax-payments/schemas';
import { TaxPaymentPayAction } from './TaxPaymentPayAction';
import { TaxPaymentCancelAction } from './TaxPaymentCancelAction';

type TaxPaymentToolbarProps = {
  status: string;
  isPending: boolean;
  onPay: (data: PayTaxPayment) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
};

export function TaxPaymentToolbar({
  status,
  isPending,
  onPay,
  onCancel,
}: TaxPaymentToolbarProps) {
  const canPay = status === 'Pending';
  const canCancel = status !== 'Canceled';

  return (
    <>
      <TaxPaymentPayAction
        disabled={isPending || !canPay}
        isPending={isPending}
        onPay={onPay}
      />

      <TaxPaymentCancelAction
        disabled={isPending || !canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />
    </>
  );
}
