import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { CardTitle, CardHeader, CardDescription } from './ui/card';
import { Link } from 'react-router';

type ListCardHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  addLink?: string;
  addText?: string;
  renderAction?: React.ReactNode;
};

export function ListCardHeader({
  title,
  description,
  children,
  addLink,
  addText,
  renderAction,
}: ListCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {renderAction ? (
          renderAction
        ) : addLink && addText ? (
          <Button className="sm:self-start" asChild>
            <Link to={addLink}>
              <Plus className="h-4 w-4 mr-2" />
              {addText}
            </Link>
          </Button>
        ) : null}
      </div>
      {children}
    </CardHeader>
  );
}
