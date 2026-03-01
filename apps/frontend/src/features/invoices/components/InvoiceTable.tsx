import { Link, useSearchParams } from 'react-router';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvoicesSuspense } from '../stores/useInvoices';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import type { BadgeProps } from '@/components/ui/badge';

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

export function InvoicesSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Subtotal</TableHead>
          <TableHead>Taxes</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[40px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
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

export function InvoiceTable() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useInvoicesSuspense({ clientId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Taxes</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.invoiceId}>
              <TableCell className="font-medium">
                {item.clientName ?? '—'}
              </TableCell>
              <TableCell>{item.currency}</TableCell>
              <TableCell>{item.subtotal.toFixed(2)}</TableCell>
              <TableCell>{item.taxes.toFixed(2)}</TableCell>
              <TableCell>{item.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/invoices/${item.invoiceId}/edit`}>
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
