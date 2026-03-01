import { Link, useSearchParams } from 'react-router';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollaboratorPaymentsSuspense } from '../stores/useCollaboratorPayments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import type { BadgeProps } from '@/components/ui/badge';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Paid':
      return 'secondary';
    case 'Confirmed':
      return 'outline';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function CollaboratorPaymentsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Collaborator</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Gross Salary</TableHead>
          <TableHead>Withholding</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Status</TableHead>
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
              <Skeleton className="h-8 w-[40px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[40px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CollaboratorPaymentTable() {
  const [searchParams] = useSearchParams();
  const collaboratorId = searchParams.get('collaboratorId') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useCollaboratorPaymentsSuspense({
    collaboratorId,
    pageNumber,
  });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collaborator</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Gross Salary</TableHead>
            <TableHead>Withholding</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.collaboratorPaymentId}>
              <TableCell className="font-medium">
                {item.collaboratorName}
              </TableCell>
              <TableCell>{item.currency}</TableCell>
              <TableCell>{Number(item.grossSalary).toFixed(2)}</TableCell>
              <TableCell>{Number(item.withholding).toFixed(2)}</TableCell>
              <TableCell>{Number(item.netSalary).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    to={`/collaborator-payments/${item.collaboratorPaymentId}/edit`}
                  >
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
