import { TableCell } from './ui/table';
import type { ComponentProps } from 'react';

type TextTableCellProps = {
  value: string | null | undefined;
} & ComponentProps<typeof TableCell>;

export function TextTableCell({ value, ...props }: TextTableCellProps) {
  return <TableCell {...props}>{value ?? '-'}</TableCell>;
}
