import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';

import type { BadgeProps } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTransactionsSuspense } from '../stores/useTransactions';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditButton } from '@/components/EditButton';

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
        <TableHead className="min-w-30">Type</TableHead>
        <TableHead className="min-w-60">Description</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Subtotal</TableHead>
        <TableHead className="min-w-30">Taxes</TableHead>
        <TableHead className="min-w-30">Total</TableHead>
        <TableHead className="min-w-30">Issued At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function TransactionsSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 9 }).map((_, i) => (
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

export function TransactionTable() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') ?? undefined;
  const description = searchParams.get('description') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useTransactionsSuspense({ type, description, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.transactionId}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.currency}</TableCell>
              <NumberTableCell value={item.subtotal} />
              <NumberTableCell value={item.taxes} />
              <NumberTableCell value={item.total} />
              <DateTableCell value={item.issuedAt} />
              <BadgeTableCell variant={statusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditButton link={`/transactions/${item.transactionId}/edit`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </div>
  );
}
