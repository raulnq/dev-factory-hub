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
import { TextTableCell } from '@/components/TextTableCell';

function InnerTableHeader({
  exchangeCurrencyTo,
}: {
  exchangeCurrencyTo?: string;
}) {
  const showConverted = !!exchangeCurrencyTo;
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-30">Issued At</TableHead>
        <TableHead className="min-w-20">Type</TableHead>
        <TableHead className="min-w-40">Name</TableHead>
        <TableHead className="min-w-60">Description</TableHead>
        <TableHead className="text-right min-w-30">Amount</TableHead>
        <TableHead className="text-right min-w-30">Balance</TableHead>
        {showConverted && (
          <>
            <TableHead className="text-right min-w-30">
              Amount ({exchangeCurrencyTo})
            </TableHead>
            <TableHead className="text-right min-w-30">
              Balance ({exchangeCurrencyTo})
            </TableHead>
          </>
        )}
      </TableRow>
    </TableHeader>
  );
}

export function CollaboratorBalanceSkeleton() {
  const [searchParams] = useSearchParams();
  const exchangeCurrencyTo =
    searchParams.get('exchangeCurrencyTo') ?? undefined;
  const colCount = exchangeCurrencyTo ? 8 : 6;

  return (
    <Table>
      <InnerTableHeader exchangeCurrencyTo={exchangeCurrencyTo} />
      <TableBody>
        {Array.from({ length: 8 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: colCount }).map((_, i) => (
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
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader exchangeCurrencyTo={exchangeCurrencyTo} />
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
              <NumberTableCell className="text-right" value={entry.amount} />
              <NumberTableCell className="text-right" value={entry.balance} />

              {showConverted && (
                <>
                  <NumberTableCell
                    className="text-right"
                    value={entry.convertedAmount ?? 0}
                  />
                  <NumberTableCell
                    className="text-right"
                    value={entry.convertedBalance ?? 0}
                  />
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
    </div>
  );
}
