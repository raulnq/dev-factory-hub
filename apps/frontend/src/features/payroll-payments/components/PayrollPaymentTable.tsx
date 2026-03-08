import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import type { BadgeProps } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePayrollPaymentsSuspense } from '../stores/usePayrollPayments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Paid':
      return 'secondary';
    case 'PensionPaid':
      return 'outline';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Collaborator</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Net Salary</TableHead>
        <TableHead className="min-w-30">Pension</TableHead>
        <TableHead className="min-w-30">Gross Salary</TableHead>
        <TableHead className="min-w-30">Paid At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function PayrollPaymentsSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 8 }).map((_, i) => (
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

export function PayrollPaymentTable() {
  const [searchParams] = useSearchParams();
  const collaboratorId = searchParams.get('collaboratorId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = usePayrollPaymentsSuspense({ collaboratorId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.payrollPaymentId}>
              <TextTableCell
                className="font-medium"
                value={item.collaboratorName}
              />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={Number(item.netSalary)} />
              <NumberTableCell value={Number(item.pensionAmount)} />
              <NumberTableCell value={Number(item.grossSalary)} />
              <DateTableCell value={item.paidAt} />
              <BadgeTableCell variant={statusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditCellButton
                  link={`/payroll-payments/${item.payrollPaymentId}/edit`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
