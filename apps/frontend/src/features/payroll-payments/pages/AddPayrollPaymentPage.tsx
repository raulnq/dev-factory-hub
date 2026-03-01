import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddPayrollPayment } from '#/features/payroll-payments/schemas';
import { useAddPayrollPayment } from '../stores/usePayrollPayments';
import { AddPayrollPaymentForm } from '../components/AddPayrollPaymentForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddPayrollPaymentPage() {
  const navigate = useNavigate();
  const add = useAddPayrollPayment();

  const onSubmit: SubmitHandler<AddPayrollPayment> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Payroll payment created successfully');
      navigate(`/payroll-payments/${result.payrollPaymentId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save payroll payment'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Payroll Payment"
          description="Create a new payroll payment."
        />
        <AddPayrollPaymentForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Payroll Payment"
          cancelText="Cancel"
          onCancel={() => navigate('/payroll-payments')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
