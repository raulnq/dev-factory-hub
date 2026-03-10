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
import { useCollaboratorRolesSuspense } from '../stores/useCollaboratorRoles';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { NumberTableCell } from '@/components/NumberTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';
import { ViewCellButton } from '@/components/ViewCellButton';
import { LinkTableCell } from '@/components/LinkTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Name</TableHead>
        <TableHead className="min-w-20">Currency</TableHead>
        <TableHead className="min-w-30">Fee Rate</TableHead>
        <TableHead className="min-w-30">Cost Rate</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CollaboratorRolesSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 5 }).map((_, i) => (
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

export function CollaboratorRoleTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useCollaboratorRolesSuspense({ name, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.collaboratorRoleId}>
              <LinkTableCell
                className="font-medium"
                link={`/collaborator-roles/${item.collaboratorRoleId}`}
                value={item.name}
              />
              <TextTableCell value={item.currency} />
              <NumberTableCell value={item.feeRate} />
              <NumberTableCell value={item.costRate} />
              <TableCell>
                <div className="flex gap-2">
                  <ViewCellButton
                    link={`/collaborator-roles/${item.collaboratorRoleId}`}
                  />
                  <EditCellButton
                    link={`/collaborator-roles/${item.collaboratorRoleId}/edit`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
