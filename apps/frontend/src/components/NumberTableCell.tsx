import type { ComponentProps } from 'react';
import { TableCell } from './ui/table';

type NumberTableCellProps = {
  value: number | null | undefined;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
} & ComponentProps<typeof TableCell>;

function formatNumber(
  value: number | null | undefined,
  locale: string,
  min: number,
  max: number
): string {
  if (value === null || value === undefined || isNaN(value)) return '-';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(value);
}

export function NumberTableCell({
  value,
  locale = navigator.language,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  ...props
}: NumberTableCellProps) {
  return (
    <TableCell {...props}>
      {formatNumber(
        value,
        locale,
        minimumFractionDigits,
        maximumFractionDigits
      )}
    </TableCell>
  );
}
