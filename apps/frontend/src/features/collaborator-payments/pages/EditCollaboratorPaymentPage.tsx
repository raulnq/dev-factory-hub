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
import { CollaboratorPaymentEditForm } from '../components/CollaboratorPaymentEditForm';
import { CollaboratorPaymentSkeleton } from '../components/CollaboratorPaymentSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditCollaboratorPaymentPage() {
  const { collaboratorPaymentId } = useParams() as {
    collaboratorPaymentId: string;
  };
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

  return (
    <CollaboratorPaymentEditForm
      collaboratorPayment={payment}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onCollaboratorPaymentCancel={handleCancel}
      onCollaboratorPaymentConfirm={handleConfirm}
      onCollaboratorPaymentPay={handlePay}
    />
  );
}
