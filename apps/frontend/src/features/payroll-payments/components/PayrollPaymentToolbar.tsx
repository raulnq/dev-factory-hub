import { useRef, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Coins, XCircle, Upload, Download } from 'lucide-react';
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
  payPayrollPaymentSchema,
  payPensionPayrollPaymentSchema,
  type PayPayrollPayment,
  type PayPensionPayrollPayment,
} from '#/features/payroll-payments/schemas';

type PayrollPaymentToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onPay: (data: PayPayrollPayment) => void;
  onPayPension: (data: PayPensionPayrollPayment) => void;
  onCancel: () => void;
  onUpload: (file: File) => void;
  onDownload: () => void;
};

export function PayrollPaymentToolbar({
  status,
  filePath,
  isPending,
  onPay,
  onPayPension,
  onCancel,
  onUpload,
  onDownload,
}: PayrollPaymentToolbarProps) {
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payPensionDialogOpen, setPayPensionDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canPay = status === 'Pending';
  const canPayPension = status === 'Paid';
  const canCancel = status !== 'Canceled';
  const canUpload =
    status === 'Pending' || status === 'Paid' || status === 'PensionPaid';
  const canDownload = filePath !== null && filePath !== '';

  const payForm = useForm<PayPayrollPayment>({
    resolver: zodResolver(payPayrollPaymentSchema),
    defaultValues: {
      paidAt: new Date().toISOString().split('T')[0],
    },
  });

  const payPensionForm = useForm<PayPensionPayrollPayment>({
    resolver: zodResolver(payPensionPayrollPaymentSchema),
    defaultValues: {
      pensionPaidAt: new Date().toISOString().split('T')[0],
      pensionAmount: 0,
    },
  });

  const handlePay: SubmitHandler<PayPayrollPayment> = data => {
    onPay(data);
    setPayDialogOpen(false);
    payForm.reset();
  };

  const handlePayPension: SubmitHandler<PayPensionPayrollPayment> = data => {
    onPayPension(data);
    setPayPensionDialogOpen(false);
    payPensionForm.reset();
  };

  const handleUploadOpen = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadDialogOpen(true);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    setUploadDialogOpen(false);
    setSelectedFile(null);
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
        onClick={() => setPayPensionDialogOpen(true)}
        disabled={isPending || !canPayPension}
        variant="secondary"
        size="sm"
      >
        <Coins className="h-4 w-4 mr-2" />
        Pay Pension
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

      <Button
        type="button"
        onClick={handleUploadOpen}
        disabled={isPending || !canUpload}
        variant="secondary"
        size="sm"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>

      <Button
        type="button"
        onClick={onDownload}
        disabled={isPending || !canDownload}
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Paid</DialogTitle>
            <DialogDescription>
              Enter the payment date to mark this payroll payment as paid.
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

      {/* Pay Pension Dialog */}
      <Dialog
        open={payPensionDialogOpen}
        onOpenChange={setPayPensionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Pension</DialogTitle>
            <DialogDescription>
              Enter the pension payment date and amount.
            </DialogDescription>
          </DialogHeader>
          <form
            id="pay-pension-form"
            onSubmit={payPensionForm.handleSubmit(handlePayPension)}
          >
            <div className="space-y-4">
              <Controller
                name="pensionPaidAt"
                control={payPensionForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pensionPaidAt">
                      Pension Payment Date
                    </FieldLabel>
                    <Input
                      {...field}
                      id="pensionPaidAt"
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
                name="pensionAmount"
                control={payPensionForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="pensionAmount">
                      Pension Amount
                    </FieldLabel>
                    <Input
                      {...field}
                      id="pensionAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.value ?? ''}
                      onChange={e => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                      placeholder="0.00"
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
                setPayPensionDialogOpen(false);
                payPensionForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="pay-pension-form">
              Pay Pension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Payroll Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this payroll payment? This action
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
              Cancel Payroll Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload a PDF or image file for this payroll payment.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="payroll-payment-file">File</FieldLabel>
            <input
              ref={fileInputRef}
              id="payroll-payment-file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </Field>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={isPending || !selectedFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
