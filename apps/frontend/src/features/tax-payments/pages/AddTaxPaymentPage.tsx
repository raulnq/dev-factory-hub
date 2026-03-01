import { useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { AddTaxPaymentForm } from '../components/AddTaxPaymentForm';
import { useAddTaxPayment } from '../stores/useTaxPayments';
import { toast } from 'sonner';
import type { AddTaxPayment } from '#/features/tax-payments/schemas';
import type { SubmitHandler } from 'react-hook-form';

export function AddTaxPaymentPage() {
  const navigate = useNavigate();
  const add = useAddTaxPayment();

  const onSubmit: SubmitHandler<AddTaxPayment> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Tax payment created successfully');
      navigate(`/tax-payments/${result.taxPaymentId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create tax payment'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Tax Payment"
          description="Create a new tax payment."
        />
        <AddTaxPaymentForm onSubmit={onSubmit} isPending={add.isPending} />
        <FormCardFooter
          formId="tax-payment-form"
          isPending={add.isPending}
          onCancel={() => navigate('/tax-payments')}
        />
      </Card>
    </div>
  );
}
