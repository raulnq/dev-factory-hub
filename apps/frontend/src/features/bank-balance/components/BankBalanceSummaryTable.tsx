import { useBankBalanceSummarySuspense } from '../stores/useBankBalance';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { NumberTableCell } from '@/components/NumberTableCell';
import { LinkTableCell } from '@/components/LinkTableCell';
import { Skeleton } from '@/components/ui/skeleton';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Balance</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function BankBalanceSummarySkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 2 }).map((_, i) => (
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

export function BankBalanceSummaryTable() {
  const { data: summary } = useBankBalanceSummarySuspense({
    pageSize: 10,
    pageNumber: 1,
  });

  const rows = summary.items;

  if (rows.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.currency}>
              <LinkTableCell
                value={row.currency}
                link={`/bank-balance?currency=${row.currency}`}
              />
              <NumberTableCell value={row.balance} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
