import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditCollaboratorRole } from '#/features/collaborator-roles/schemas';
import {
  useEditCollaboratorRole,
  useCollaboratorRoleSuspense,
} from '../stores/useCollaboratorRoles';
import { EditCollaboratorRoleForm } from '../components/EditCollaboratorRoleForm';
import { CollaboratorRoleSkeleton } from '../components/CollaboratorRoleSkeleton';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditCollaboratorRolePage() {
  const navigate = useNavigate();
  const { collaboratorRoleId } = useParams<{ collaboratorRoleId: string }>();
  const edit = useEditCollaboratorRole(collaboratorRoleId!);

  const onSubmit: SubmitHandler<EditCollaboratorRole> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Collaborator role updated successfully');
      navigate('/collaborator-roles');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save collaborator role'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Edit Collaborator Role"
          description="Update an existing collaborator role record."
        />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load collaborator role"
                />
              )}
            >
              <Suspense fallback={<CollaboratorRoleSkeleton />}>
                <InnerCollaboratorRole
                  isPending={edit.isPending}
                  onSubmit={onSubmit}
                  collaboratorRoleId={collaboratorRoleId!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save Role"
          cancelText="Cancel"
          onCancel={() => navigate('/collaborator-roles')}
          isPending={edit.isPending}
        />
      </Card>
    </div>
  );
}

type InnerCollaboratorRoleProps = {
  collaboratorRoleId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaboratorRole>;
};

function InnerCollaboratorRole({
  isPending,
  onSubmit,
  collaboratorRoleId,
}: InnerCollaboratorRoleProps) {
  const { data } = useCollaboratorRoleSuspense(collaboratorRoleId);
  return (
    <EditCollaboratorRoleForm
      isPending={isPending}
      onSubmit={onSubmit}
      collaboratorRole={data}
    />
  );
}
