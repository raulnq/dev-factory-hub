import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CancelInvoiceButtonProps = {
  disabled: boolean;
  onCancel: () => void;
};

export function CancelInvoiceButton({
  disabled,
  onCancel,
}: CancelInvoiceButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = () => {
    onCancel();
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        size="sm"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cancel
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this invoice? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Cancel Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
