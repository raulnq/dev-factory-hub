import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddMoneyExchange } from '#/features/money-exchanges/schemas';
import { useAddMoneyExchange } from '../stores/useMoneyExchanges';
import { AddMoneyExchangeForm } from '../components/AddMoneyExchangeForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddMoneyExchangePage() {
  const navigate = useNavigate();
  const add = useAddMoneyExchange();

  const onSubmit: SubmitHandler<AddMoneyExchange> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Money exchange created successfully');
      navigate(`/money-exchanges/${result.moneyExchangeId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save money exchange'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Money Exchange"
          description="Create a new money exchange."
        />
        <AddMoneyExchangeForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Money Exchange"
          cancelText="Cancel"
          onCancel={() => navigate('/money-exchanges')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
