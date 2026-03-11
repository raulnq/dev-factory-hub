import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddExchangeRate } from '#/features/exchange-rates/schemas';
import { useAddExchangeRate } from '../stores/useExchangeRates';
import { ExchangeRateAddForm } from '../components/ExchangeRateAddForm';

export function AddExchangeRatePage() {
  const navigate = useNavigate();
  const add = useAddExchangeRate();

  const onSubmit: SubmitHandler<AddExchangeRate> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Exchange rate created successfully');
      navigate(`/exchange-rates/${result.exchangeRateId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save exchange rate'
      );
    }
  };

  return (
    <div className="space-y-4">
      <ExchangeRateAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/exchange-rates')}
      />
    </div>
  );
}
