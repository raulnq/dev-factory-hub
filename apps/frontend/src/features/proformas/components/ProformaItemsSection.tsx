import { Suspense, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useAddProformaItem,
  useDeleteProformaItem,
  useProformaItemsSuspense,
} from '../stores/useProformas';
import { DeleteItemDialog } from './DeleteItemDialog';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { useSearchParams } from 'react-router';
import { ListCardHeader } from '@/components/ListCardHeader';
import { AddItemButton } from './AddItemButton';
import type {
  AddProformaItem,
  ProformaItem,
} from '#/features/proformas/schemas';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

export function ProformaItemsSection({
  proformaId,
  status,
}: {
  proformaId: string;
  status: string;
}) {
  const isPending = status === 'Pending';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProformaItem | null>(null);
  const del = useDeleteProformaItem(proformaId);
  const add = useAddProformaItem(proformaId);
  const handleAdd = async (data: AddProformaItem) => {
    try {
      await add.mutateAsync(data);
      toast.success('Item added');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add item'
      );
    }
  };

  const openDeleteDialog = (item: ProformaItem) => {
    setSelectedRow(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedRow(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await del.mutateAsync(selectedRow.proformaItemId);
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete item'
      );
    }
  };

  return (
    <Card>
      <ListCardHeader
        title="Items"
        description="Manage items for this proforma."
        renderAction={
          isPending ? (
            <AddItemButton onAdd={handleAdd} isPending={add.isPending} />
          ) : null
        }
      />
      <CardContent>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load items"
                />
              )}
            >
              <Suspense fallback={<ItemsSkeleton />}>
                <ItemsTable
                  proformaId={proformaId}
                  onDelete={openDeleteDialog}
                  canDelete={isPending}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </CardContent>

      <DeleteItemDialog
        description={selectedRow?.description}
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDelete}
        isPending={del.isPending}
      />
    </Card>
  );
}

function ItemsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
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

type ItemsTableProps = {
  proformaId: string;
  onDelete: (data: ProformaItem) => void;
  canDelete: boolean;
};

function ItemsTable({ proformaId, onDelete, canDelete }: ItemsTableProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useProformaItemsSuspense({ proformaId, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.proformaItemId}>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell className="text-right">{item.amount}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
