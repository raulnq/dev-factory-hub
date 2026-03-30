import { useClientBalanceSummarySuspense } from '../stores/useClientBalance';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { Pagination } from '@/components/Pagination';
import { useSearchParams } from 'react-router';
import { NumberTableCell } from '@/components/NumberTableCell';
import { TextTableCell } from '@/components/TextTableCell';
import { LinkTableCell } from '@/components/LinkTableCell';
import { Skeleton } from '@/components/ui/skeleton';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Client</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Amount</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ClientBalanceSummarySkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 3 }).map((_, i) => (
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

export function ClientBalanceSummaryTable() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data: summary } = useClientBalanceSummarySuspense({
    pageSize: 10,
    pageNumber: pageNumber,
  });

  const rows = summary.items.flatMap(s =>
    s.balances.map(b => ({
      clientId: s.clientId,
      clientName: s.clientName,
      currency: b.currency,
      balance: b.balance,
    }))
  );

  if (rows.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.clientId}-${row.currency}-${index}`}>
              <LinkTableCell
                value={row.clientName}
                link={`/client-balance?clientId=${row.clientId}&currency=${row.currency}`}
              />
              <TextTableCell value={row.currency} />
              <NumberTableCell value={row.balance} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={summary.totalPages} />
    </div>
  );
}
