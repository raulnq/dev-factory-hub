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
import { useTaxPaymentsSuspense } from '../stores/useTaxPayments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { getStatusVariant } from '../utils/status-variants';
import { NumberTableCell } from '@/components/NumberTableCell';
import { DateTableCell } from '@/components/DateTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditButton } from '@/components/EditButton';
import { TextTableCell } from '@/components/TextTableCell';

const currentYear = new Date().getFullYear();

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-20">Year</TableHead>
        <TableHead className="min-w-20">Month</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Total</TableHead>
        <TableHead className="min-w-30">Paid At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function TaxPaymentsSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 7 }).map((_, i) => (
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

export function TaxPaymentTable() {
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const year = yearParam ? Number(yearParam) : currentYear;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useTaxPaymentsSuspense({ year, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.taxPaymentId}>
              <TextTableCell
                className="font-medium"
                value={item.year.toString()}
              />
              <TextTableCell value={item.month.toString()} />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={item.total} />
              <DateTableCell value={item.paidAt} />
              <BadgeTableCell variant={getStatusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditButton link={`/tax-payments/${item.taxPaymentId}/edit`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
