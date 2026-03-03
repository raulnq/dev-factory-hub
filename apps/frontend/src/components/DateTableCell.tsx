import type { ComponentProps } from 'react';
import { TableCell } from './ui/table';

type DateTableCellProp = {
  value: string | Date | null | undefined;
} & ComponentProps<typeof TableCell>;

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '--/--/----';

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else {
    const [year, month, day] = value.split('-');
    date = new Date(Number(year), Number(month) - 1, Number(day));
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function DateTableCell({ value, ...props }: DateTableCellProp) {
  return <TableCell {...props}>{formatDate(value)}</TableCell>;
}
