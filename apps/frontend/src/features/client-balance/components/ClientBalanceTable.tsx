import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClientBalanceSuspense } from '../stores/useClientBalance';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { TextTableCell } from '@/components/TextTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-30">Issued At</TableHead>
        <TableHead className="min-w-20">Type</TableHead>
        <TableHead className="min-w-40">Name</TableHead>
        <TableHead className="min-w-60">Description</TableHead>
        <TableHead className="text-right min-w-30">Amount</TableHead>
        <TableHead className="text-right min-w-30">Balance</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ClientBalanceSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 8 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton className="h-5" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ClientBalanceTable() {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') ?? '';
  const clientId = searchParams.get('clientId') ?? '';
  const startDate = searchParams.get('startDate') ?? undefined;
  const endDate = searchParams.get('endDate') ?? undefined;

  const { data } = useClientBalanceSuspense({
    currency,
    clientId,
    startDate,
    endDate,
  });

  if (data.entries.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.entries.map((entry, index) => (
            <TableRow key={index}>
              <DateTableCell value={entry.issuedAt} />
              <TableCell>
                <Badge
                  variant={entry.type === 'Income' ? 'default' : 'destructive'}
                >
                  {entry.type}
                </Badge>
              </TableCell>
              <TextTableCell value={entry.name} />
              <TextTableCell value={entry.description} />
              <NumberTableCell value={entry.amount} />
              <NumberTableCell value={entry.balance} />
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right font-semibold">
              Final Balance ({currency})
            </TableCell>
            <NumberTableCell
              value={data.finalBalance}
              className="text-right font-mono font-semibold"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
