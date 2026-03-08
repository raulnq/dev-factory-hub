import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { Field } from './ui/field';

type ViewCardContentProps = {
  children: React.ReactNode;
  cancelText?: string;
  onCancel: () => void;
};

export function ViewCardContent({
  children,
  onCancel,
  cancelText = 'Cancel',
}: ViewCardContentProps) {
  return (
    <>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
        </Field>
      </CardFooter>
    </>
  );
}
