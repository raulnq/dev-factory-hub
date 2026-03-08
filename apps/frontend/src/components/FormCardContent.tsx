import { CardContent, CardFooter } from '@/components/ui/card';
import { Field } from './ui/field';
import { Button } from './ui/button';

type FormCardContentProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  formId?: string;
  isPending: boolean;
  saveText?: string;
  cancelText?: string;
  onCancel: () => void;
};

export function FormCardContent({
  onSubmit,
  children,
  isPending,
  onCancel,
  formId = 'formId',
  cancelText = 'Cancel',
  saveText = 'Save',
}: FormCardContentProps) {
  return (
    <>
      <CardContent>
        <form id={formId} onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          {formId && (
            <Button type="submit" form={formId} disabled={isPending}>
              {saveText}
            </Button>
          )}
        </Field>
      </CardFooter>
    </>
  );
}
