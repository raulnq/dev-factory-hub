import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  PayPayrollPayment,
  PayPensionPayrollPayment,
} from '#/features/payroll-payments/schemas';
import { PayrollPaymentPayAction } from './PayrollPaymentPayAction';
import { PayrollPaymentPayPensionAction } from './PayrollPaymentPayPensionAction';
import { PayrollPaymentCancelAction } from './PayrollPaymentCancelAction';
import { PayrollPaymentUploadAction } from './PayrollPaymentUploadAction';

type PayrollPaymentToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onPay: (data: PayPayrollPayment) => Promise<void> | void;
  onPayPension: (data: PayPensionPayrollPayment) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onUpload: (file: File) => Promise<void> | void;
  onDownload: () => void;
};

export function PayrollPaymentToolbar({
  status,
  filePath,
  isPending,
  onPay,
  onPayPension,
  onCancel,
  onUpload,
  onDownload,
}: PayrollPaymentToolbarProps) {
  const canPay = status === 'Pending';
  const canPayPension = status === 'Paid';
  const canCancel = status !== 'Canceled';
  const canUpload =
    status === 'Pending' || status === 'Paid' || status === 'PensionPaid';
  const canDownload = filePath !== null && filePath !== '';

  return (
    <>
      <PayrollPaymentPayAction
        disabled={isPending || !canPay}
        isPending={isPending}
        onPay={onPay}
      />

      <PayrollPaymentPayPensionAction
        disabled={isPending || !canPayPension}
        isPending={isPending}
        onPayPension={onPayPension}
      />

      <PayrollPaymentCancelAction
        disabled={isPending || !canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />

      <PayrollPaymentUploadAction
        disabled={isPending || !canUpload}
        isPending={isPending}
        onUpload={onUpload}
      />

      <Button
        type="button"
        onClick={onDownload}
        disabled={isPending || !canDownload}
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </>
  );
}
