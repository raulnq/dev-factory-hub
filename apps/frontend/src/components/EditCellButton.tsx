import { Link } from 'react-router';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';

type EditCellButtonProps = {
  link: string;
};

export function EditCellButton({ link }: EditCellButtonProps) {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link to={link}>
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  );
}
