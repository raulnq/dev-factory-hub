import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddInvoice } from '#/features/invoices/schemas';
import { useAddInvoice } from '../stores/useInvoices';
import { AddInvoiceForm } from '../components/AddInvoiceForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddInvoicePage() {
  const navigate = useNavigate();
  const add = useAddInvoice();

  const onSubmit: SubmitHandler<AddInvoice> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Invoice created successfully');
      navigate(`/invoices/${result.invoiceId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create invoice'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Invoice"
          description="Create a new invoice."
        />
        <AddInvoiceForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Invoice"
          isPending={add.isPending}
          onCancel={() => navigate('/invoices')}
        />
      </Card>
    </div>
  );
}
