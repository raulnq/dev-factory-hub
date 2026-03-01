import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddTransaction } from '#/features/transactions/schemas';
import { useAddTransaction } from '../stores/useTransactions';
import { AddTransactionForm } from '../components/AddTransactionForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddTransactionPage() {
  const navigate = useNavigate();
  const add = useAddTransaction();

  const onSubmit: SubmitHandler<AddTransaction> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Transaction created successfully');
      navigate(`/transactions/${result.transactionId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save transaction'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Transaction"
          description="Create a new transaction."
        />
        <AddTransactionForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Transaction"
          cancelText="Cancel"
          onCancel={() => navigate('/transactions')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
