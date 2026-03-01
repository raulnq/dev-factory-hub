import { useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { AddProformaForm } from '../components/AddProformaForm';
import { useAddProforma } from '../stores/useProformas';
import { toast } from 'sonner';
import type { AddProforma } from '#/features/proformas/schemas';
import type { SubmitHandler } from 'react-hook-form';

export function AddProformaPage() {
  const navigate = useNavigate();
  const add = useAddProforma();

  const onSubmit: SubmitHandler<AddProforma> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Proforma created successfully');
      navigate(`/proformas/${result.proformaId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create proforma'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Proforma"
          description="Create a new proforma."
        />
        <AddProformaForm onSubmit={onSubmit} isPending={add.isPending} />
        <FormCardFooter
          formId="proforma-form"
          isPending={add.isPending}
          onCancel={() => navigate('/proformas')}
        />
      </Card>
    </div>
  );
}
