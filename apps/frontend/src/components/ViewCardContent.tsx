import { CardContent } from '@/components/ui/card';

type ViewCardContentProps = {
  children: React.ReactNode;
};

export function ViewCardContent({ children }: ViewCardContentProps) {
  return (
    <CardContent>
      <div className="space-y-4">{children}</div>
    </CardContent>
  );
}
