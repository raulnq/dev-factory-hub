import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaboratorRole } from '#/features/collaborator-roles/schemas';
import { useAddCollaboratorRole } from '../stores/useCollaboratorRoles';
import { CollaboratorRoleAddForm } from '../components/CollaboratorRoleAddForm';

export function AddCollaboratorRolePage() {
  const navigate = useNavigate();
  const add = useAddCollaboratorRole();

  const onSubmit: SubmitHandler<AddCollaboratorRole> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Collaborator role created successfully');
      navigate(`/collaborator-roles/${result.collaboratorRoleId}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save collaborator role'
      );
    }
  };

  return (
    <div className="space-y-4">
      <CollaboratorRoleAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/collaborator-roles')}
      />
    </div>
  );
}
