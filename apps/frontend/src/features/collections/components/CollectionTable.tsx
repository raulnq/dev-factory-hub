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
import { useCollectionsSuspense } from '../stores/useCollections';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Confirmed':
      return 'outline';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Client</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Total</TableHead>
        <TableHead className="min-w-30">Commission</TableHead>
        <TableHead className="min-w-30">Taxes</TableHead>
        <TableHead className="min-w-30">Confirmed At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CollectionsSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 8 }).map((_, i) => (
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

export function CollectionTable() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useCollectionsSuspense({ clientId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.collectionId}>
              <TextTableCell className="font-medium" value={item.clientName} />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={Number(item.total)} />
              <NumberTableCell value={Number(item.commission)} />
              <NumberTableCell value={Number(item.taxes)} />
              <DateTableCell value={item.confirmedAt} />
              <BadgeTableCell variant={statusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditCellButton
                  link={`/collections/${item.collectionId}/edit`}
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
