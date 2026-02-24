import { useState, Suspense } from 'react';
import { useSearchParams } from 'react-router';
import { Pencil, Trash2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ListCardHeader } from '@/components/ListCardHeader';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { ErrorFallback } from '@/components/ErrorFallback';
import {
  useContactsSuspense,
  useAddContact,
  useEditContact,
  useDeleteContact,
} from '../stores/useClients';
import {
  type AddContact,
  type EditContact,
  type Contact,
} from '#/features/clients/schemas';
import { AddContactButton } from './AddContactButton';
import { DeleteContactDialog } from './DeleteContactDialog';
import { EditContactDialog } from './EditContactDialog';

type ContactsSectionProps = {
  clientId: string;
};

export function ContactsSection({ clientId }: ContactsSectionProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Contact | null>(null);

  const addContactMutation = useAddContact(clientId);
  const editContactMutation = useEditContact(clientId);
  const deleteContactMutation = useDeleteContact(clientId);

  const openDeleteDialog = (contact: Contact) => {
    setSelectedRow(contact);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setSelectedRow(contact);
    setEditDialogOpen(true);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedRow(null);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedRow(null);
    }
  };

  const handleAdd = async (data: AddContact) => {
    try {
      await addContactMutation.mutateAsync(data);
      toast.success('Contact added successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add contact'
      );
    }
  };

  const handleEdit = async (data: EditContact) => {
    if (!selectedRow) return;
    try {
      await editContactMutation.mutateAsync({
        contactId: selectedRow.contactId,
        data,
      });
      toast.success('Contact updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update contact'
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await deleteContactMutation.mutateAsync({
        contactId: selectedRow.contactId,
      });
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete contact'
      );
    }
  };

  return (
    <>
      <Card>
        <ListCardHeader
          title="Contacts"
          description="Manage contacts for this client."
          renderAction={
            <AddContactButton
              onAdd={handleAdd}
              isPending={addContactMutation.isPending}
            />
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
                    message="Failed to load contacts"
                  />
                )}
              >
                <Suspense fallback={<ContactsSkeleton />}>
                  <ContactsTable
                    clientId={clientId}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>

      <EditContactDialog
        key={`${selectedRow?.contactId ?? 'new'}-contact-edit`}
        name={selectedRow?.name}
        email={selectedRow?.email}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onEdit={handleEdit}
        isPending={editContactMutation.isPending}
      />

      <DeleteContactDialog
        name={selectedRow?.name}
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDelete}
        isPending={deleteContactMutation.isPending}
      />
    </>
  );
}

function ContactsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
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

type ContactsTableProps = {
  clientId: string;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

function ContactsTable({ clientId, onEdit, onDelete }: ContactsTableProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('contactsPage') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useContactsSuspense(clientId, pageNumber);

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.contactId}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email ?? '—'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} pageParamName="contactsPage" />
      </div>
    </>
  );
}
