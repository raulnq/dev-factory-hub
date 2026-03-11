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
import type { ZodType } from 'zod';
import type { ReactNode } from 'react';
import type { Resolver } from 'react-hook-form';
import { useId } from 'react';

type UncontrolledFormDialogProps<TData extends FieldValues> = {
  schema: ZodType<TData, TData>;
  defaultValues: DefaultValues<TData>;
  onSubmit: (data: TData) => Promise<void> | void;
  isPending: boolean;
  label: string;
  saveLabel: string;
  description?: string;
  children: (form: UseFormReturn<TData>) => ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export function UncontrolledFormDialog<TData extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  isPending,
  label,
  description,
  children,
  saveLabel,
  icon,
  disabled,
}: UncontrolledFormDialogProps<TData>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<TData>({
    resolver: zodResolver(schema) as Resolver<TData>,
    defaultValues,
  });

  const handleSubmit: SubmitHandler<TData> = async data => {
    await onSubmit(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultValues);
    }
    setDialogOpen(open);
  };
  const formId = useId();
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" disabled={disabled}>
          {icon}
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
              {saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
