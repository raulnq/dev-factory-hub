import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Plus } from 'lucide-react';
import type { ZodType } from 'zod';
import type { ReactNode } from 'react';
import type { Resolver } from 'react-hook-form';

type AddItemDialogProps<TData extends FieldValues> = {
  schema: ZodType<TData, TData>;
  defaultValues: DefaultValues<TData>;
  formId?: string;
  onAdd: (data: TData) => Promise<void> | void;
  isPending: boolean;
  label: string;
  description?: string;
  children: (form: UseFormReturn<TData>) => ReactNode;
};

export function AddItemDialog<TData extends FieldValues>({
  schema,
  defaultValues,
  onAdd,
  isPending,
  label,
  description,
  children,
  formId = "item-form'",
}: AddItemDialogProps<TData>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<TData>({
    resolver: zodResolver(schema) as Resolver<TData>,
    defaultValues,
  });

  const handleSubmit: SubmitHandler<TData> = async data => {
    await onAdd(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          id={formId}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {children(form)}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form={formId} disabled={isPending}>
              {label}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
