import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaboratorPayment } from '#/features/collaborator-payments/schemas';
import { useAddCollaboratorPayment } from '../stores/useCollaboratorPayments';
import { CollaboratorPaymentAddForm } from '../components/CollaboratorPaymentAddForm';

export function AddCollaboratorPaymentPage() {
  const navigate = useNavigate();
  const add = useAddCollaboratorPayment();

  const onSubmit: SubmitHandler<AddCollaboratorPayment> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Payment created successfully');
      navigate(`/collaborator-payments/${result.collaboratorPaymentId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save payment'
      );
    }
  };

  return (
    <div className="space-y-4">
      <CollaboratorPaymentAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/collaborator-payments')}
      />
    </div>
  );
}
