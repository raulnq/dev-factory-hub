import { Link, useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollaboratorsSuspense } from '../stores/useCollaborators';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { EditCellButton } from '@/components/EditCellButton';
import { TextTableCell } from '@/components/TextTableCell';
import { ViewCellButton } from '@/components/ViewCellButton';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Name</TableHead>
        <TableHead className="min-w-60">Email</TableHead>
        <TableHead className="min-w-30">Withholding %</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function CollaboratorsSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: 4 }).map((_, i) => (
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

export function CollaboratorTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useCollaboratorsSuspense({ name, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.collaboratorId}>
              <TableCell className="font-medium">
                <Link
                  to={`/collaborators/${item.collaboratorId}`}
                  className="hover:underline"
                >
                  {item.name}
                </Link>
              </TableCell>
              <TextTableCell value={item.email} />
              <TableCell>{item.withholdingPercentage}%</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <ViewCellButton
                    link={`/collaborators/${item.collaboratorId}`}
                  />
                  <EditCellButton
                    link={`/collaborators/${item.collaboratorId}/edit`}
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
