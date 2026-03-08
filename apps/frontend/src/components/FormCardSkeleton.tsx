import { CardContent, CardFooter } from '@/components/ui/card';
import { Field } from './ui/field';
import { Skeleton } from './ui/skeleton';

type FormCardContentProps = {
  children: React.ReactNode;
};

export function FormCardSkeleton({ children }: FormCardContentProps) {
  return (
    <>
      <CardContent>
        <div className="space-y-4">{children}</div>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal" className="flex justify-end">
          <Skeleton className="h-9 w-22.5" />
          <Skeleton className="h-9 w-22.5" />
        </Field>
      </CardFooter>
    </>
  );
}
