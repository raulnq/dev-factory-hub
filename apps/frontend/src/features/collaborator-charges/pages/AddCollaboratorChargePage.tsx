import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaboratorCharge } from '#/features/collaborator-charges/schemas';
import { useAddCollaboratorCharge } from '../stores/useCollaboratorCharges';
import { CollaboratorChargeAddForm } from '../components/CollaboratorChargeAddForm';

export function AddCollaboratorChargePage() {
  const navigate = useNavigate();
  const add = useAddCollaboratorCharge();

  const onSubmit: SubmitHandler<AddCollaboratorCharge> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Charge created successfully');
      navigate(`/collaborator-charges/${result.collaboratorChargeId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save charge'
      );
    }
  };

  return (
    <div className="space-y-4">
      <CollaboratorChargeAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/collaborator-charges')}
      />
    </div>
  );
}
