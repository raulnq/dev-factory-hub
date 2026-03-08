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
import { useProformasSuspense } from '../stores/useProformas';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { getStatusVariant } from '../utils/status-variants';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { EditButton } from '@/components/EditButton';
import { TextTableCell } from '@/components/TextTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-30">Number</TableHead>
        <TableHead className="min-w-60">Project</TableHead>
        <TableHead className="min-w-30">Start Date</TableHead>
        <TableHead className="min-w-30">End Date</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Total</TableHead>
        <TableHead className="min-w-30">Completed At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ProformasSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 9 }).map((_, i) => (
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

export function ProformaTable() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useProformasSuspense({ projectId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.proformaId}>
              <TextTableCell className="font-medium" value={item.number} />
              <TextTableCell value={item.projectName} />
              <DateTableCell value={item.startDate} />
              <DateTableCell value={item.endDate} />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={item.total} />
              <DateTableCell value={item.issuedAt} />
              <BadgeTableCell variant={getStatusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <TableCell>
                <EditButton link={`/proformas/${item.proformaId}/edit`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
