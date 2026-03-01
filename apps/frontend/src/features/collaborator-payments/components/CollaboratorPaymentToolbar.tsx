import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, CheckSquare, XCircle } from 'lucide-react';
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
  payCollaboratorPaymentSchema,
  confirmCollaboratorPaymentSchema,
  type PayCollaboratorPayment,
  type ConfirmCollaboratorPayment,
} from '#/features/collaborator-payments/schemas';

type CollaboratorPaymentToolbarProps = {
  status: string;
  isPending: boolean;
  onPay: (data: PayCollaboratorPayment) => void;
  onConfirm: (data: ConfirmCollaboratorPayment) => void;
  onCancel: () => void;
};

export function CollaboratorPaymentToolbar({
  status,
  isPending,
  onPay,
  onConfirm,
  onCancel,
}: CollaboratorPaymentToolbarProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const canPay = status === 'Pending';
  const canConfirm = status === 'Paid';
  const canCancel = status !== 'Canceled';

  const payForm = useForm<PayCollaboratorPayment>({
    resolver: zodResolver(payCollaboratorPaymentSchema),
    defaultValues: {
      paidAt: new Date().toISOString().split('T')[0],
    },
  });

  const confirmForm = useForm<ConfirmCollaboratorPayment>({
    resolver: zodResolver(confirmCollaboratorPaymentSchema),
    defaultValues: {
      confirmedAt: new Date().toISOString().split('T')[0],
      number: '',
    },
  });

  const handlePay: SubmitHandler<PayCollaboratorPayment> = data => {
    onPay(data);
    setPayDialogOpen(false);
    payForm.reset();
  };

  const handleConfirm: SubmitHandler<ConfirmCollaboratorPayment> = data => {
    onConfirm(data);
    setConfirmDialogOpen(false);
    confirmForm.reset();
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
        onClick={() => setConfirmDialogOpen(true)}
        disabled={isPending || !canConfirm}
        variant="secondary"
        size="sm"
      >
        <CheckSquare className="h-4 w-4 mr-2" />
        Confirm
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
              Enter the payment date to mark this payment as paid.
            </DialogDescription>
          </DialogHeader>
          <form id="pay-form" onSubmit={payForm.handleSubmit(handlePay)}>
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
            <Button type="submit" form="pay-form">
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Enter the confirmation date and reference number.
            </DialogDescription>
          </DialogHeader>
          <form
            id="confirm-form"
            onSubmit={confirmForm.handleSubmit(handleConfirm)}
          >
            <div className="space-y-4">
              <Controller
                name="confirmedAt"
                control={confirmForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmedAt">
                      Confirmation Date
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmedAt"
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
                control={confirmForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="number">Reference Number</FieldLabel>
                    <Input
                      {...field}
                      id="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Reference number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                confirmForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="confirm-form">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this payment? This action cannot
              be undone.
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
            >
              Cancel Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
