import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaborator } from '#/features/collaborators/schemas';
import { useAddCollaborator } from '../stores/useCollaborators';
import { AddCollaboratorForm } from '../components/AddCollaboratorForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddCollaboratorPage() {
  const navigate = useNavigate();
  const add = useAddCollaborator();

  const onSubmit: SubmitHandler<AddCollaborator> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Collaborator created successfully');
      navigate(`/collaborators/${result.collaboratorId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save collaborator'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Collaborator"
          description="Create a new collaborator record."
        />
        <AddCollaboratorForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Collaborator"
          cancelText="Cancel"
          onCancel={() => navigate('/collaborators')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
