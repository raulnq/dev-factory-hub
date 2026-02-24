import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import type { AddClient } from '#/features/clients/schemas';
import { useAddClient } from '../stores/useClients';
import { AddClientForm } from '../components/AddClientForm';

export function AddClientPage() {
  const navigate = useNavigate();
  const add = useAddClient();

  const onSubmit: SubmitHandler<AddClient> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Client created successfully');
      navigate(`/clients/${result.clientId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save client'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader title="Add Client" description="Create a new client." />
        <AddClientForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Client"
          cancelText="Cancel"
          onCancel={() => navigate('/clients')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
