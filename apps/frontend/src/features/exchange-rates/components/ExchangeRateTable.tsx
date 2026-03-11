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
import { useExchangeRatesSuspense } from '../stores/useExchangeRates';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-30">Date</TableHead>
        <TableHead className="min-w-20">From</TableHead>
        <TableHead className="min-w-20">To</TableHead>
        <TableHead className="min-w-30">Rate</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ExchangeRatesSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 5 }).map((_, i) => (
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

export function ExchangeRateTable() {
  const [searchParams] = useSearchParams();
  const fromCurrency = searchParams.get('fromCurrency') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useExchangeRatesSuspense({ fromCurrency, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.exchangeRateId}>
              <TextTableCell className="font-medium" value={item.date} />
              <TextTableCell value={item.fromCurrency} />
              <TextTableCell value={item.toCurrency} />
              <NumberTableCell
                value={item.rate}
                minimumFractionDigits={4}
                maximumFractionDigits={4}
              />
              <ActionTableCell>
                <EditCellButton
                  link={`/exchange-rates/${item.exchangeRateId}/edit`}
                />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
