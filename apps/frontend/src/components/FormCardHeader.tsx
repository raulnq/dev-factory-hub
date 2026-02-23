import { CardDescription, CardTitle, CardHeader } from './ui/card';

type FormCardHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  renderAction?: React.ReactNode;
};

export function FormCardHeader({
  title,
  description,
  children,
  renderAction,
}: FormCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">{title}</CardTitle>
            {renderAction && <div className="flex gap-2">{renderAction}</div>}
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </CardHeader>
  );
}
