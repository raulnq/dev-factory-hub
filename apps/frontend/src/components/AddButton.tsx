import { Link } from 'react-router';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

type AddButtonProps = {
  link: string;
  text: string;
};

export function AddButton({ link, text }: AddButtonProps) {
  return (
    <Button className="sm:self-start" asChild>
      <Link to={link}>
        <Plus className="h-4 w-4 mr-2" />
        {text}
      </Link>
    </Button>
  );
}
