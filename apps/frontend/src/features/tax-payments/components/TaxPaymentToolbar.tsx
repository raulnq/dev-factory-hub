import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  payTaxPaymentSchema,
  type PayTaxPayment,
} from '#/features/tax-payments/schemas';

type TaxPaymentToolbarProps = {
  status: string;
  isPending: boolean;
  onPay: (data: PayTaxPayment) => void;
  onCancel: () => void;
};

export function TaxPaymentToolbar({
  status,
  isPending,
  onPay,
  onCancel,
}: TaxPaymentToolbarProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const canPay = status === 'Pending';
  const canCancel = status !== 'Canceled';

  const payForm = useForm<PayTaxPayment>({
    resolver: zodResolver(payTaxPaymentSchema),
    defaultValues: {
      paidAt: new Date().toISOString().split('T')[0],
      number: '',
    },
  });

  const handlePay: SubmitHandler<PayTaxPayment> = data => {
    onPay(data);
    setPayDialogOpen(false);
    payForm.reset();
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setPayDialogOpen(true)}
        disabled={isPending || !canPay}
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Pay
      </Button>

      <Button
        type="button"
        onClick={() => setCancelDialogOpen(true)}
        disabled={isPending || !canCancel}
        variant="destructive"
        size="sm"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cancel
      </Button>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Paid</DialogTitle>
            <DialogDescription>
              Enter the payment date and number to mark this tax payment as
              paid.
            </DialogDescription>
          </DialogHeader>
          <form
            id="pay-tax-payment-form"
            onSubmit={payForm.handleSubmit(handlePay)}
            className="space-y-4"
          >
            <Controller
              name="paidAt"
              control={payForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="paidAt">Payment Date</FieldLabel>
                  <Input
                    {...field}
                    id="paidAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="number"
              control={payForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="number">Number</FieldLabel>
                  <Input
                    {...field}
                    id="number"
                    placeholder="Payment number"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPayDialogOpen(false);
                payForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="pay-tax-payment-form">
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Tax Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this tax payment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onCancel();
                setCancelDialogOpen(false);
              }}
              disabled={isPending}
            >
              Cancel Tax Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
