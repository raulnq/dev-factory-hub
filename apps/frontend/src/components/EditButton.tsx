import { Link } from 'react-router';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';

type EditButtonProps = {
  link: string;
  text: string;
};

export function EditButton({ link, text }: EditButtonProps) {
  return (
    <Button className="sm:self-start" asChild>
      <Link to={link}>
        <Pencil className="h-4 w-4 mr-2" />
        {text}
      </Link>
    </Button>
  );
}
