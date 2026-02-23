import { CardContent } from '@/components/ui/card';

type FormCardContentProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  formId: string;
};

export function FormCardContent({
  onSubmit,
  children,
  formId,
}: FormCardContentProps) {
  return (
    <CardContent>
      <form id={formId} onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </CardContent>
  );
}
