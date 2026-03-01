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
  PayrollPayment,
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
import { EditPayrollPaymentForm } from '../components/EditPayrollPaymentForm';
import { PayrollPaymentSkeleton } from '../components/PayrollPaymentSkeleton';
import { PayrollPaymentToolbar } from '../components/PayrollPaymentToolbar';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Paid':
      return 'secondary';
    case 'PensionPaid':
      return 'outline';
    case 'Canceled':
      return 'destructive';
    default:
      return 'default';
  }
}

export function EditPayrollPaymentPage() {
  const { payrollPaymentId } = useParams() as { payrollPaymentId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
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
      </Card>
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

  const isStatusPending = payrollPayment.status === 'Pending';

  return (
    <>
      <FormCardHeader
        title="Edit Payroll Payment"
        description="Update payroll payment details."
        renderAction={
          <Badge variant={statusVariant(payrollPayment.status)}>
            {payrollPayment.status}
          </Badge>
        }
      >
        <PayrollPaymentToolbar
          status={payrollPayment.status}
          filePath={payrollPayment.filePath}
          isPending={isPending}
          onPay={handlePay}
          onPayPension={handlePayPension}
          onCancel={handleCancel}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </FormCardHeader>
      <EditPayrollPaymentForm
        payrollPayment={payrollPayment as PayrollPayment}
        isPending={edit.isPending}
        onSubmit={handleSubmit}
      />
      <FormCardFooter
        formId={isStatusPending ? 'form' : undefined}
        saveText="Save Payroll Payment"
        cancelText="Back"
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
