import { Badge, type BadgeProps } from './ui/badge';
import { TableCell } from './ui/table';
import type { ComponentProps, ReactNode } from 'react';

type BadgeTableCellProps = {
  variant: BadgeProps['variant'];
  children: ReactNode;
} & ComponentProps<typeof TableCell>;

export function BadgeTableCell({
  children,
  variant,
  ...props
}: BadgeTableCellProps) {
  return (
    <TableCell>
      <Badge variant={variant} {...props}>
        {children}
      </Badge>
    </TableCell>
  );
}
