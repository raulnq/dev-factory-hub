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
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';

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
  const exchangeCurrencyTo =
    searchParams.get('exchangeCurrencyTo') ?? undefined;

  const { data } = useCollaboratorBalanceSuspense({
    currency,
    collaboratorId,
    startDate,
    endDate,
    exchangeCurrencyTo,
  });

  if (data.entries.length === 0) return <NoMatchingItems />;

  const showConverted = !!exchangeCurrencyTo;

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
          {showConverted && (
            <>
              <TableHead className="text-right">
                Amount ({exchangeCurrencyTo})
              </TableHead>
              <TableHead className="text-right">
                Balance ({exchangeCurrencyTo})
              </TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
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
            <TableCell>{entry.name}</TableCell>
            <TableCell>{entry.description}</TableCell>
            <NumberTableCell value={entry.amount} />
            <NumberTableCell value={entry.balance} />
            {showConverted && (
              <>
                <NumberTableCell value={entry.convertedAmount ?? 0} />
                <NumberTableCell value={entry.convertedBalance ?? 0} />
              </>
            )}
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
          {showConverted && (
            <>
              <TableCell className="text-right font-semibold">
                Final Balance ({exchangeCurrencyTo})
              </TableCell>
              <NumberTableCell
                value={data.finalConvertedBalance ?? 0}
                className="text-right font-mono font-semibold"
              />
            </>
          )}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
