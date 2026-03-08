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
import { useClientsSuspense } from '../stores/useClients';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { TextTableCell } from '@/components/TextTableCell';
import { EditButton } from '@/components/EditButton';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-90">Name</TableHead>
        <TableHead className="min-w-30">Document Number</TableHead>
        <TableHead className="hidden md:table-cell min-w-30">Phone</TableHead>
        <TableHead className="hidden lg:table-cell min-w-60">Email</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ClientsSkeleton() {
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

export function ClientTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useClientsSuspense({ name, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.clientId}>
              <TextTableCell className="font-medium" value={item.name} />
              <TextTableCell value={item.documentNumber} />
              <TextTableCell value={item.phone} />
              <TextTableCell value={item.email} />
              <TableCell>
                <EditButton link={`/clients/${item.clientId}/edit`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
