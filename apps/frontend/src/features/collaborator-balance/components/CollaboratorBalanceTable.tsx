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
import { useCollaboratorBalanceSuspense } from '../stores/useCollaboratorBalance';
import { NoMatchingItems } from '@/components/NoMatchingItems';

export function CollaboratorBalanceSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issued At</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 8 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[70px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[120px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[200px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[80px] ml-auto" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-[80px] ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CollaboratorBalanceTable() {
  const [searchParams] = useSearchParams();
  const currency = searchParams.get('currency') ?? '';
  const collaboratorId = searchParams.get('collaboratorId') ?? '';
  const startDate = searchParams.get('startDate') ?? undefined;
  const endDate = searchParams.get('endDate') ?? undefined;

  const { data } = useCollaboratorBalanceSuspense({
    currency,
    collaboratorId,
    startDate,
    endDate,
  });

  if (data.entries.length === 0) return <NoMatchingItems />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issued At</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.entries.map((entry, index) => (
          <TableRow key={index}>
            <TableCell className="whitespace-nowrap">
              {entry.issuedAt}
            </TableCell>
            <TableCell>
              <Badge
                variant={entry.type === 'Income' ? 'default' : 'destructive'}
              >
                {entry.type}
              </Badge>
            </TableCell>
            <TableCell>{entry.name}</TableCell>
            <TableCell>{entry.description}</TableCell>
            <TableCell className="text-right font-mono">
              {entry.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {entry.balance.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-right font-semibold">
            Final Balance ({currency})
          </TableCell>
          <TableCell className="text-right font-mono font-semibold">
            {data.finalBalance.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
