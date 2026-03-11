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
import { useId } from 'react';

type FormCardProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  readOnly?: boolean;
  children: React.ReactNode;
  isPending?: boolean;
  saveText?: string;
  cancelText?: string;
  title: string;
  description: string;
  onCancel: () => void;
  renderTitleSuffix?: React.ReactNode;
  renderAction?: React.ReactNode;
};

export function FormCard({
  onSubmit,
  readOnly = false,
  children,
  onCancel,
  title,
  description,
  renderTitleSuffix,
  renderAction,
  isPending = false,
  cancelText = 'Cancel',
  saveText = 'Save',
}: FormCardProps) {
  const formId = useId();
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">{title}</CardTitle>
              {renderTitleSuffix && (
                <div className="flex gap-2">{renderTitleSuffix}</div>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
          {renderAction && <div className="flex gap-2">{renderAction}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {!readOnly && (
          <form id={formId} onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        )}
        {readOnly && <div className="space-y-4">{children}</div>}
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal" className="flex justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          {!readOnly && (
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
