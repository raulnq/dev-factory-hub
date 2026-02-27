import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaboratorRole } from '#/features/collaborator-roles/schemas';
import { useAddCollaboratorRole } from '../stores/useCollaboratorRoles';
import { AddCollaboratorRoleForm } from '../components/AddCollaboratorRoleForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

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
      <Card>
        <FormCardHeader
          title="Add Collaborator Role"
          description="Create a new collaborator role record."
        />
        <AddCollaboratorRoleForm
          isPending={add.isPending}
          onSubmit={onSubmit}
        />
        <FormCardFooter
          formId="form"
          saveText="Save Role"
          cancelText="Cancel"
          onCancel={() => navigate('/collaborator-roles')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
