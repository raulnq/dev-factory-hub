import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  EditPayrollPayment,
  PayPayrollPayment,
  PayPensionPayrollPayment,
} from '#/features/payroll-payments/schemas';
import {
  usePayrollPaymentSuspense,
  useEditPayrollPayment,
  usePayPayrollPayment,
  usePayPensionPayrollPayment,
  useCancelPayrollPayment,
  useUploadPayrollPayment,
  usePayrollPaymentDownloadUrl,
} from '../stores/usePayrollPayments';
import { PayrollPaymentEditForm } from '../components/PayrollPaymentEditForm';
import { PayrollPaymentSkeleton } from '../components/PayrollPaymentSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditPayrollPaymentPage() {
  const { payrollPaymentId } = useParams() as { payrollPaymentId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load payroll payment"
              />
            )}
          >
            <Suspense fallback={<PayrollPaymentSkeleton />}>
              <EditPayrollPaymentInner
                payrollPaymentId={payrollPaymentId}
                onCancel={() => navigate('/payroll-payments')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type EditPayrollPaymentInnerProps = {
  payrollPaymentId: string;
  onCancel: () => void;
};

function EditPayrollPaymentInner({
  payrollPaymentId,
  onCancel,
}: EditPayrollPaymentInnerProps) {
  const { data: payrollPayment } = usePayrollPaymentSuspense(payrollPaymentId);
  const edit = useEditPayrollPayment(payrollPaymentId);
  const pay = usePayPayrollPayment(payrollPaymentId);
  const payPension = usePayPensionPayrollPayment(payrollPaymentId);
  const cancel = useCancelPayrollPayment(payrollPaymentId);
  const upload = useUploadPayrollPayment(payrollPaymentId);
  const downloadUrl = usePayrollPaymentDownloadUrl(payrollPaymentId);

  const handleSubmit: SubmitHandler<EditPayrollPayment> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Payroll payment updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update payroll payment'
      );
    }
  };

  const handlePay = async (data: PayPayrollPayment) => {
    try {
      await pay.mutateAsync(data);
      toast.success('Payroll payment marked as paid');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to pay payroll payment'
      );
    }
  };

  const handlePayPension = async (data: PayPensionPayrollPayment) => {
    try {
      await payPension.mutateAsync(data);
      toast.success('Pension paid successfully');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to pay pension for payroll payment'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Payroll payment canceled');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to cancel payroll payment'
      );
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload.mutateAsync(file);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadUrl.mutateAsync();
      window.open(result.url, '_blank');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get download URL'
      );
    }
  };

  const isPending =
    edit.isPending ||
    pay.isPending ||
    payPension.isPending ||
    cancel.isPending ||
    upload.isPending ||
    downloadUrl.isPending;

  return (
    <PayrollPaymentEditForm
      payrollPayment={payrollPayment}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onPayrollPaymentPay={handlePay}
      onPayrollPaymentPayPension={handlePayPension}
      onPayrollPaymentCancel={handleCancel}
      onPayrollPaymentUpload={handleUpload}
      onPayrollPaymentDownload={handleDownload}
    />
  );
}
