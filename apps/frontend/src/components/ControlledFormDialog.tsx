import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import type { ZodType } from 'zod';
import type { ReactNode } from 'react';
import type { Resolver } from 'react-hook-form';
import { useId } from 'react';

type ControlledFormDialogProps<TData extends FieldValues> = {
  schema: ZodType<TData, TData>;
  defaultValues: DefaultValues<TData>;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TData) => Promise<void> | void;
  label: string;
  saveLabel: string;
  description?: string;
  children: (form: UseFormReturn<TData>) => ReactNode;
};

export function ControlledFormDialog<TData extends FieldValues>({
  schema,
  defaultValues,
  open,
  isPending,
  onOpenChange,
  onSubmit,
  label,
  saveLabel,
  description,
  children,
}: ControlledFormDialogProps<TData>) {
  const form = useForm<TData>({
    resolver: zodResolver(schema) as Resolver<TData>,
    defaultValues,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues);
    }
    onOpenChange(open);
  };

  const handleSubmit: SubmitHandler<TData> = async data => {
    await onSubmit(data);
    handleOpenChange(false);
  };
  const formId = useId();
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              {saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
