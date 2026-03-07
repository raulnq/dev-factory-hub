import { CardTitle, CardHeader, CardDescription } from './ui/card';

type ListCardHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  renderAction?: React.ReactNode;
};

export function ListCardHeader({
  title,
  description,
  children,
  renderAction,
}: ListCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {renderAction ? renderAction : null}
      </div>
      {children}
    </CardHeader>
  );
}
