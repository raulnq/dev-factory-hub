import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import {
  addTaxPaymentItemSchema,
  type AddTaxPaymentItem,
} from '#/features/tax-payments/schemas';

const ITEM_TYPES = [
  'ESSALUD',
  'REGIMENMYPE',
  'CUARTACATEGORIA',
  'RENTA',
] as const;

type AddTaxPaymentItemButtonProps = {
  onAdd: (data: AddTaxPaymentItem) => void;
  isPending: boolean;
};

export function AddTaxPaymentItemButton({
  onAdd,
  isPending,
}: AddTaxPaymentItemButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<AddTaxPaymentItem>({
    resolver: zodResolver(addTaxPaymentItemSchema),
    defaultValues: { type: 'ESSALUD', amount: 0 },
  });

  const handleSubmit: SubmitHandler<AddTaxPaymentItem> = async data => {
    onAdd(data);
    handleOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setDialogOpen(open);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Add a new item to this tax payment.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-tax-payment-item-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_TYPES.map(t => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="amount">Amount</FieldLabel>
                    <Input
                      {...field}
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.value ?? ''}
                      onChange={e => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                      placeholder="0.00"
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                form="add-tax-payment-item-form"
                disabled={isPending}
              >
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
