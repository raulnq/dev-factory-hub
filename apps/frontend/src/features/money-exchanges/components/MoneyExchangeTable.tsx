import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMoneyExchangesSuspense } from '../stores/useMoneyExchanges';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { NumberTableCell } from '@/components/NumberTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import type { BadgeProps } from '@/components/ui/badge';
import { DateTableCell } from '@/components/DateTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Issued':
      return 'secondary';
    case 'Canceled':
      return 'destructive';
    default:
      return 'outline';
  }
}

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-20">From</TableHead>
        <TableHead className="min-w-20">To</TableHead>
        <TableHead className="min-w-30">Rate</TableHead>
        <TableHead className="min-w-30">From Amount</TableHead>
        <TableHead className="min-w-30">To Amount</TableHead>
        <TableHead className="min-w-30">From Taxes</TableHead>
        <TableHead className="min-w-30">To Taxes</TableHead>
        <TableHead className="min-w-30">Issued At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function MoneyExchangesSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton className="h-8" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function MoneyExchangeTable() {
  const [searchParams] = useSearchParams();
  const fromCurrency = searchParams.get('fromCurrency') ?? undefined;
  const toCurrency = searchParams.get('toCurrency') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);

  const { data } = useMoneyExchangesSuspense({
    fromCurrency,
    toCurrency,
    pageNumber,
  });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.moneyExchangeId}>
              <TextTableCell
                className="font-medium"
                value={item.fromCurrency}
              />
              <TextTableCell value={item.toCurrency} />
              <NumberTableCell
                value={Number(item.rate)}
                maximumFractionDigits={4}
                minimumFractionDigits={4}
              />
              <NumberTableCell value={Number(item.fromAmount)} />
              <NumberTableCell value={Number(item.toAmount)} />
              <NumberTableCell value={Number(item.fromTaxes)} />
              <NumberTableCell value={Number(item.toTaxes)} />
              <DateTableCell value={item.issuedAt} />
              <BadgeTableCell variant={statusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditCellButton
                  link={`/money-exchanges/${item.moneyExchangeId}/edit`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
