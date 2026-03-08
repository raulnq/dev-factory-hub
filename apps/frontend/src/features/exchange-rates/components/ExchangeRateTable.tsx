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
import { EditButton } from '@/components/EditButton';

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
              <TableCell className="font-medium">{item.date}</TableCell>
              <TableCell>{item.fromCurrency}</TableCell>
              <TableCell>{item.toCurrency}</TableCell>
              <TableCell>{item.rate.toFixed(4)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditButton
                    link={`/exchange-rates/${item.exchangeRateId}/edit`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
