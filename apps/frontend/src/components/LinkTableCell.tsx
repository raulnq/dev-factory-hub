import { Link } from 'react-router';
import { TableCell } from './ui/table';
import type { ComponentProps } from 'react';

type LinkTableCellProps = {
  value: string | null | undefined;
  link: string;
} & ComponentProps<typeof TableCell>;

export function LinkTableCell({ value, link, ...props }: LinkTableCellProps) {
  return (
    <TableCell {...props}>
      <Link to={link} className="hover:underline">
        {value}
      </Link>
    </TableCell>
  );
}
