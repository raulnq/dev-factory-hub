import { TableCell } from './ui/table';
import type { ComponentProps, ReactNode } from 'react';

type ActionTableCellProps = {
  children: ReactNode;
} & ComponentProps<typeof TableCell>;

export function ActionTableCell({ children, ...props }: ActionTableCellProps) {
  return (
    <TableCell {...props}>
      <div className="flex gap-2">{children}</div>
    </TableCell>
  );
}
