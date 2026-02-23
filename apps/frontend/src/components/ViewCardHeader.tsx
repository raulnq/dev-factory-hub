import { CardDescription, CardTitle, CardHeader } from './ui/card';

type ViewCardHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function ViewCardHeader({
  title,
  description,
  children,
}: ViewCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </CardHeader>
  );
}
