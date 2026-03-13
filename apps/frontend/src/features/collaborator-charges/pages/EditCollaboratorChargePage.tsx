import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  EditCollaboratorCharge,
  PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas';
import {
  useCollaboratorChargeSuspense,
  useEditCollaboratorCharge,
  usePayCollaboratorCharge,
  useCancelCollaboratorCharge,
} from '../stores/useCollaboratorCharges';
import { CollaboratorChargeEditForm } from '../components/CollaboratorChargeEditForm';
import { CollaboratorChargeSkeleton } from '../components/CollaboratorChargeSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditCollaboratorChargePage() {
  const { collaboratorChargeId } = useParams() as {
    collaboratorChargeId: string;
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
                message="Failed to load charge"
              />
            )}
          >
            <Suspense fallback={<CollaboratorChargeSkeleton />}>
              <EditCollaboratorChargeInner
                collaboratorChargeId={collaboratorChargeId}
                onCancel={() => navigate('/collaborator-charges')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type EditCollaboratorChargeInnerProps = {
  collaboratorChargeId: string;
  onCancel: () => void;
};

function EditCollaboratorChargeInner({
  collaboratorChargeId,
  onCancel,
}: EditCollaboratorChargeInnerProps) {
  const { data: charge } = useCollaboratorChargeSuspense(collaboratorChargeId);
  const edit = useEditCollaboratorCharge(collaboratorChargeId);
  const pay = usePayCollaboratorCharge(collaboratorChargeId);
  const cancel = useCancelCollaboratorCharge(collaboratorChargeId);

  const handleSubmit: SubmitHandler<EditCollaboratorCharge> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Charge updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update charge'
      );
    }
  };

  const handlePay = async (data: PayCollaboratorCharge) => {
    try {
      await pay.mutateAsync(data);
      toast.success('Charge issued');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to issue charge'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Charge canceled');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel charge'
      );
    }
  };

  const isPending = edit.isPending || pay.isPending || cancel.isPending;

  return (
    <CollaboratorChargeEditForm
      collaboratorCharge={charge}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onCollaboratorChargeCancel={handleCancel}
      onCollaboratorChargePay={handlePay}
    />
  );
}
