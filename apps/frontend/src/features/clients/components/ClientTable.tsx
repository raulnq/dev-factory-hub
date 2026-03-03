import { Link, useSearchParams } from 'react-router';
import { Pencil } from 'lucide-react';
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
import { useClientsSuspense } from '../stores/useClients';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { TextTableCell } from '@/components/TextTableCell';

export function ClientsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Document Number</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[70%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[70%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[70%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Document Number</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.clientId}>
              <TextTableCell className="font-medium" value={item.name} />
              <TextTableCell value={item.documentNumber} />
              <TextTableCell value={item.phone} />
              <TextTableCell value={item.email} />
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/clients/${item.clientId}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
