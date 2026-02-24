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
  useProjectsSuspense,
  useAddProject,
  useEditProject,
  useDeleteProject,
} from '../stores/useClients';
import {
  type AddProject,
  type EditProject,
  type Project,
} from '#/features/clients/schemas';
import { AddProjectButton } from './AddProjectButton';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { EditProjectDialog } from './EditProjectDialog';

type ProjectsSectionProps = {
  clientId: string;
};

export function ProjectsSection({ clientId }: ProjectsSectionProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Project | null>(null);

  const addProjectMutation = useAddProject(clientId);
  const editProjectMutation = useEditProject(clientId);
  const deleteProjectMutation = useDeleteProject(clientId);

  const openDeleteDialog = (project: Project) => {
    setSelectedRow(project);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setSelectedRow(project);
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

  const handleAdd = async (data: AddProject) => {
    try {
      await addProjectMutation.mutateAsync(data);
      toast.success('Project added successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add project'
      );
    }
  };

  const handleEdit = async (data: EditProject) => {
    if (!selectedRow) return;
    try {
      await editProjectMutation.mutateAsync({
        projectId: selectedRow.projectId,
        data,
      });
      toast.success('Project updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update project'
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await deleteProjectMutation.mutateAsync({
        projectId: selectedRow.projectId,
      });
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete project'
      );
    }
  };

  return (
    <>
      <Card>
        <ListCardHeader
          title="Projects"
          description="Manage projects for this client."
          renderAction={
            <AddProjectButton
              onAdd={handleAdd}
              isPending={addProjectMutation.isPending}
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
                    message="Failed to load projects"
                  />
                )}
              >
                <Suspense fallback={<ProjectsSkeleton />}>
                  <ProjectsTable
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

      <EditProjectDialog
        key={`${selectedRow?.projectId ?? 'new'}-project-edit`}
        name={selectedRow?.name}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onEdit={handleEdit}
        isPending={editProjectMutation.isPending}
      />

      <DeleteProjectDialog
        name={selectedRow?.name}
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDelete}
        isPending={deleteProjectMutation.isPending}
      />
    </>
  );
}

function ProjectsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
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
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type ProjectsTableProps = {
  clientId: string;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

function ProjectsTable({ clientId, onEdit, onDelete }: ProjectsTableProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('projectsPage') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useProjectsSuspense(clientId, pageNumber);

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.projectId}>
              <TableCell className="font-medium">{item.name}</TableCell>
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
        <Pagination totalPages={data.totalPages} pageParamName="projectsPage" />
      </div>
    </>
  );
}
