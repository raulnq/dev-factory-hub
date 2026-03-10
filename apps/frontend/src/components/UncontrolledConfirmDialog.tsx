import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, type ReactNode } from 'react';

type UncontrolledConfirmDialogProps = {
  label: string;
  description: string;
  isPending: boolean;
  onConfirm: () => Promise<void> | void;
  icon?: ReactNode;
  disabled?: boolean;
};

export function UncontrolledConfirmDialog({
  label,
  description,
  isPending,
  onConfirm,
  icon,
  disabled,
}: UncontrolledConfirmDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleConfirm = async () => {
    await onConfirm();
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" disabled={disabled}>
          {icon}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
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
            {label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
