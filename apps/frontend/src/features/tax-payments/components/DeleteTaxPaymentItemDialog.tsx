import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DeleteTaxPaymentItemDialogProps = {
  itemType: string | undefined;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
};

export function DeleteTaxPaymentItemDialog({
  itemType,
  open,
  isPending,
  onOpenChange,
  onDelete,
}: DeleteTaxPaymentItemDialogProps) {
  const handleSubmit = async () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the item{' '}
            {itemType ? `"${itemType}"` : ''}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
