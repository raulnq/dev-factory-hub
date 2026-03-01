import { Link, useSearchParams } from 'react-router';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';
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

export function MoneyExchangesSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>From Amount</TableHead>
          <TableHead>To Amount</TableHead>
          <TableHead>From Taxes</TableHead>
          <TableHead>To Taxes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            ))}
            <TableCell>
              <Skeleton className="h-8 w-8" />
            </TableCell>
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>From Amount</TableHead>
            <TableHead>To Amount</TableHead>
            <TableHead>From Taxes</TableHead>
            <TableHead>To Taxes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.moneyExchangeId}>
              <TableCell className="font-medium">{item.fromCurrency}</TableCell>
              <TableCell>{item.toCurrency}</TableCell>
              <TableCell>{Number(item.rate).toFixed(4)}</TableCell>
              <TableCell>{Number(item.fromAmount).toFixed(2)}</TableCell>
              <TableCell>{Number(item.toAmount).toFixed(2)}</TableCell>
              <TableCell>{Number(item.fromTaxes).toFixed(2)}</TableCell>
              <TableCell>{Number(item.toTaxes).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/money-exchanges/${item.moneyExchangeId}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
