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
import { useTimesheetsSuspense } from '../stores/useTimesheets';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';
import { getStatusVariant } from '../utils/status-variants';
import { ActionTableCell } from '@/components/ActionTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Collaborator</TableHead>
        <TableHead className="min-w-40">Role</TableHead>
        <TableHead className="min-w-30">Start Date</TableHead>
        <TableHead className="min-w-30">End Date</TableHead>
        <TableHead className="min-w-30">Completed At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function TimesheetsSkeleton() {
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

export function TimesheetTable() {
  const [searchParams] = useSearchParams();
  const collaboratorId = searchParams.get('collaboratorId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useTimesheetsSuspense({ collaboratorId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.timesheetId}>
              <TextTableCell
                className="font-medium"
                value={item.collaboratorName}
              />
              <TextTableCell value={item.collaboratorRoleName} />
              <DateTableCell value={item.startDate} />
              <DateTableCell value={item.endDate} />
              <DateTableCell value={item.completedAt} />
              <BadgeTableCell variant={getStatusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <ActionTableCell>
                <EditCellButton link={`/timesheets/${item.timesheetId}/edit`} />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
