import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  ConfirmCollaboratorPayment,
  EditCollaboratorPayment,
  PayCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';
import {
  useCollaboratorPaymentSuspense,
  useEditCollaboratorPayment,
  usePayCollaboratorPayment,
  useConfirmCollaboratorPayment,
  useCancelCollaboratorPayment,
} from '../stores/useCollaboratorPayments';
import { EditCollaboratorPaymentForm } from '../components/EditCollaboratorPaymentForm';
import { CollaboratorPaymentSkeleton } from '../components/CollaboratorPaymentSkeleton';
import { CollaboratorPaymentToolbar } from '../components/CollaboratorPaymentToolbar';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Paid':
      return 'secondary';
    case 'Confirmed':
      return 'outline';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function EditCollaboratorPaymentPage() {
  const { collaboratorPaymentId } = useParams() as {
    collaboratorPaymentId: string;
  };
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
                  message="Failed to load payment"
                />
              )}
            >
              <Suspense fallback={<CollaboratorPaymentSkeleton />}>
                <EditCollaboratorPaymentInner
                  collaboratorPaymentId={collaboratorPaymentId}
                  onCancel={() => navigate('/collaborator-payments')}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Card>
    </div>
  );
}

type EditCollaboratorPaymentInnerProps = {
  collaboratorPaymentId: string;
  onCancel: () => void;
};

function EditCollaboratorPaymentInner({
  collaboratorPaymentId,
  onCancel,
}: EditCollaboratorPaymentInnerProps) {
  const { data: payment } = useCollaboratorPaymentSuspense(
    collaboratorPaymentId
  );
  const edit = useEditCollaboratorPayment(collaboratorPaymentId);
  const pay = usePayCollaboratorPayment(collaboratorPaymentId);
  const confirm = useConfirmCollaboratorPayment(collaboratorPaymentId);
  const cancel = useCancelCollaboratorPayment(collaboratorPaymentId);

  const handleSubmit: SubmitHandler<EditCollaboratorPayment> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Payment updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update payment'
      );
    }
  };

  const handlePay = async (data: PayCollaboratorPayment) => {
    try {
      await pay.mutateAsync(data);
      toast.success('Payment marked as paid');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to mark as paid'
      );
    }
  };

  const handleConfirm = async (data: ConfirmCollaboratorPayment) => {
    try {
      await confirm.mutateAsync(data);
      toast.success('Payment confirmed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to confirm payment'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Payment canceled');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel payment'
      );
    }
  };

  const isPending =
    edit.isPending || pay.isPending || confirm.isPending || cancel.isPending;
  const isEditable = payment.status === 'Pending';

  return (
    <>
      <FormCardHeader
        title={`Edit Payment`}
        description="Update payment details."
        renderAction={
          <Badge variant={statusVariant(payment.status)}>
            {payment.status}
          </Badge>
        }
      >
        <CollaboratorPaymentToolbar
          status={payment.status}
          isPending={isPending}
          onPay={handlePay}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </FormCardHeader>
      <EditCollaboratorPaymentForm
        collaboratorPayment={payment}
        isPending={edit.isPending}
        onSubmit={handleSubmit}
      />
      <FormCardFooter
        formId={isEditable ? 'form' : undefined}
        saveText="Save Payment"
        cancelText="Back"
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
