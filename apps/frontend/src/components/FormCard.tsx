import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field } from './ui/field';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

type FormCardProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  formId?: string;
  isPending?: boolean;
  saveText?: string;
  cancelText?: string;
  title: string;
  description: string;
  onCancel: () => void;
  renderTitleAction?: React.ReactNode;
  renderHeaderAction?: React.ReactNode;
};

export function FormCard({
  onSubmit,
  children,
  onCancel,
  title,
  description,
  renderTitleAction,
  renderHeaderAction,
  isPending = false,
  formId = 'formId',
  cancelText = 'Cancel',
  saveText = 'Save',
}: FormCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">{title}</CardTitle>
              {renderTitleAction && (
                <div className="flex gap-2">{renderTitleAction}</div>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          {renderHeaderAction && (
            <div className="flex gap-2">{renderHeaderAction}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {onSubmit && (
          <form id={formId} onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        )}
        {!onSubmit && <div className="space-y-4">{children}</div>}
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          {onSubmit && (
            <Button type="submit" form={formId} disabled={isPending}>
              {saveText}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}

type FormCardContentProps = {
  children: React.ReactNode;
};

export function FormSkeleton({ children }: FormCardContentProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">
                  <Skeleton className="h-5.5 w-50" />
                </CardTitle>
              </div>
              <CardDescription>
                <Skeleton className="h-5.5 w-75" />
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">{children}</div>
        </CardContent>
        <CardFooter className="border-t">
          <Field orientation="horizontal" className="flex justify-end">
            <Skeleton className="h-9 w-22.5" />
            <Skeleton className="h-9 w-22.5" />
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
