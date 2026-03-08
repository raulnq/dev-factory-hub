import { Link, useSearchParams } from 'react-router';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
import { EditButton } from '@/components/EditButton';
import { TextTableCell } from '@/components/TextTableCell';

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
              <TableCell className="font-medium">
                <Link
                  to={`/collaborator-roles/${item.collaboratorRoleId}`}
                  className="hover:underline"
                >
                  {item.name}
                </Link>
              </TableCell>
              <TextTableCell value={item.currency} />
              <NumberTableCell value={item.feeRate} />
              <NumberTableCell value={item.costRate} />
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/collaborator-roles/${item.collaboratorRoleId}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <EditButton
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
