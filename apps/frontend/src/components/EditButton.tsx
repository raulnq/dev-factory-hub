import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type EditButtonProps = {
  link: string;
  className?: string;
  children?: ReactNode;
};

export function EditButton({ link, className, children }: EditButtonProps) {
  return (
    <Button
      variant={children ? 'default' : 'ghost'}
      size={children ? 'default' : 'icon'}
      className={className}
      asChild
    >
      <Link to={link}>
        <Pencil className={cn('h-4 w-4', children && 'mr-2')} />
        {children}
      </Link>
    </Button>
  );
}
