import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollaboratorPayment } from '#/features/collaborator-payments/schemas';
import { useAddCollaboratorPayment } from '../stores/useCollaboratorPayments';
import { AddCollaboratorPaymentForm } from '../components/AddCollaboratorPaymentForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

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
      <Card>
        <FormCardHeader
          title="Add Payment"
          description="Create a new collaborator payment."
        />
        <AddCollaboratorPaymentForm
          isPending={add.isPending}
          onSubmit={onSubmit}
        />
        <FormCardFooter
          formId="form"
          saveText="Save Payment"
          cancelText="Cancel"
          onCancel={() => navigate('/collaborator-payments')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
