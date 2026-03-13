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
import { useCollaboratorChargesSuspense } from '../stores/useCollaboratorCharges';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { DateTableCell } from '@/components/DateTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
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
        <TableHead className="min-w-80">Description</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Amount</TableHead>
        <TableHead className="min-w-30">Issued At</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CollaboratorChargesSkeleton() {
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

export function CollaboratorChargeTable() {
  const [searchParams] = useSearchParams();
  const collaboratorId = searchParams.get('collaboratorId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useCollaboratorChargesSuspense({
    collaboratorId,
    pageNumber,
  });

  if (data.items.length === 0) return <NoMatchingItems />;
  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.collaboratorChargeId}>
              <TextTableCell
                className="font-medium"
                value={item.collaboratorName}
              />
              <TextTableCell value={item.description} />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={item.amount} />
              <DateTableCell value={item.issuedAt} />
              <BadgeTableCell variant={getStatusVariant(item.status)}>
                {item.status}
              </BadgeTableCell>
              <ActionTableCell>
                <EditCellButton
                  link={`/collaborator-charges/${item.collaboratorChargeId}/edit`}
                />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
