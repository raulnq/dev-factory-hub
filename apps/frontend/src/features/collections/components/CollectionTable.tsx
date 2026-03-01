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
import { useCollectionsSuspense } from '../stores/useCollections';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';

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

export function CollectionsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Taxes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Taxes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.collectionId}>
              <TableCell className="font-medium">
                {item.clientName ?? ''}
              </TableCell>
              <TableCell>{item.currency}</TableCell>
              <TableCell>{Number(item.total).toFixed(2)}</TableCell>
              <TableCell>{Number(item.commission).toFixed(2)}</TableCell>
              <TableCell>{Number(item.taxes).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/collections/${item.collectionId}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
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
