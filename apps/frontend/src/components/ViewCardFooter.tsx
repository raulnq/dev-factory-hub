import { Button } from './ui/button';
import { CardFooter } from './ui/card';
import { Field } from './ui/field';

type ViewCardFooterProps = {
  cancelText?: string;
  onCancel?: () => void;
};

export function ViewCardFooter({
  cancelText = 'Cancel',
  onCancel,
}: ViewCardFooterProps) {
  return (
    <CardFooter className="border-t">
      <Field orientation="horizontal" className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      </Field>
    </CardFooter>
  );
}
