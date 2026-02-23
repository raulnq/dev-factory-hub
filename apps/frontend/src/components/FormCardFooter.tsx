import { Button } from './ui/button';
import { CardFooter } from './ui/card';
import { Field } from './ui/field';

type FormCardFooterProps = {
  isPending?: boolean;
  formId: string;
  saveText?: string;
  cancelText?: string;
  onCancel?: () => void;
};

export function FormCardFooter({
  isPending = false,
  formId,
  saveText = 'Save',
  cancelText = 'Cancel',
  onCancel,
}: FormCardFooterProps) {
  return (
    <CardFooter className="border-t">
      <Field orientation="horizontal" className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button type="submit" form={formId} disabled={isPending}>
          {saveText}
        </Button>
      </Field>
    </CardFooter>
  );
}
