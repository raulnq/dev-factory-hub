import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddMoneyExchange } from '#/features/money-exchanges/schemas';
import { useAddMoneyExchange } from '../stores/useMoneyExchanges';
import { MoneyExchangeAddForm } from '../components/MoneyExchangeAddForm';

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
      <MoneyExchangeAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/money-exchanges')}
      />
    </div>
  );
}
