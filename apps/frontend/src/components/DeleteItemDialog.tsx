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

type DeleteItemDialogProps = {
  title: string;
  description: string;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void> | void;
};

export function DeleteItemDialog({
  title,
  description,
  open,
  isPending,
  onOpenChange,
  onDelete,
}: DeleteItemDialogProps) {
  const handleConfirm = async () => {
    await onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
