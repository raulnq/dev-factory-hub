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
import { Check, X } from 'lucide-react';
import { useDocumentStatusSuspense } from '../stores/useReports';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { TextTableCell } from '@/components/TextTableCell';
import { DateTableCell } from '@/components/DateTableCell';
import { LinkTableCell } from '@/components/LinkTableCell';
import type { DocumentStatusItem } from '#/features/reports/schemas';

const COLUMN_COUNT = 5;

const TYPE_LABEL: Record<DocumentStatusItem['documentType'], string> = {
  Collection: 'Collection',
  Transaction: 'Transaction',
  MoneyExchange: 'Money Exchange',
  PayrollPayment: 'Payroll Payment',
};

const TYPE_EDIT_PATH: Record<DocumentStatusItem['documentType'], string> = {
  Collection: 'collections',
  Transaction: 'transactions',
  MoneyExchange: 'money-exchanges',
  PayrollPayment: 'payroll-payments',
};

function getEditLink(item: DocumentStatusItem): string {
  return `/${TYPE_EDIT_PATH[item.documentType]}/${item.entityId}/edit`;
}

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-36">Document Type</TableHead>
        <TableHead className="min-w-60">ID</TableHead>
        <TableHead className="min-w-30">Date</TableHead>
        <TableHead className="min-w-30">Status</TableHead>
        <TableHead className="min-w-20">Has Document</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function DocumentStatusSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
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

export function DocumentStatusTable() {
  const [searchParams] = useSearchParams();
  const now = new Date();
  const month = parseInt(
    searchParams.get('month') ?? String(now.getMonth() + 1),
    10
  );
  const year = parseInt(
    searchParams.get('year') ?? String(now.getFullYear()),
    10
  );
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);

  const { data } = useDocumentStatusSuspense({ month, year, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data.items.map(item => (
            <TableRow key={`${item.documentType}-${item.entityId}`}>
              <TextTableCell value={TYPE_LABEL[item.documentType]} />
              <LinkTableCell value={item.entityId} link={getEditLink(item)} />
              <DateTableCell value={item.entityDate} />
              <TextTableCell value={item.status} />
              <TableCell>
                {item.hasDocument ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
