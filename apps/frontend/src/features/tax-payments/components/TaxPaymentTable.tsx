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
import { useTaxPaymentsSuspense } from '../stores/useTaxPayments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { getStatusVariant } from '../utils/status-variants';

const currentYear = new Date().getFullYear();

export function TaxPaymentsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Month</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[40px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[60px]" />
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

export function TaxPaymentTable() {
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const year = yearParam ? Number(yearParam) : currentYear;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useTaxPaymentsSuspense({ year, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.taxPaymentId}>
              <TableCell className="font-medium">{item.year}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>{item.currency}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/tax-payments/${item.taxPaymentId}/edit`}>
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
