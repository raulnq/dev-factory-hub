import { Link } from 'react-router';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

type ViewCellButtonProps = {
  link: string;
};

export function ViewCellButton({ link }: ViewCellButtonProps) {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link to={link}>
        <Search className="h-4 w-4" />
      </Link>
    </Button>
  );
}
