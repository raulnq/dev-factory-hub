import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditCollaborator } from '#/features/collaborators/schemas';
import {
  useEditCollaborator,
  useCollaboratorSuspense,
} from '../stores/useCollaborators';
import { EditCollaboratorForm } from '../components/EditCollaboratorForm';
import { CollaboratorSkeleton } from '../components/CollaboratorSkeleton';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditCollaboratorPage() {
  const navigate = useNavigate();
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const edit = useEditCollaborator(collaboratorId!);

  const onSubmit: SubmitHandler<EditCollaborator> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Collaborator updated successfully');
      navigate('/collaborators');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save collaborator'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Edit Collaborator"
          description="Update an existing collaborator record."
        />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load collaborator"
                />
              )}
            >
              <Suspense fallback={<CollaboratorSkeleton />}>
                <InnerCollaborator
                  isPending={edit.isPending}
                  onSubmit={onSubmit}
                  collaboratorId={collaboratorId!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save Collaborator"
          cancelText="Cancel"
          onCancel={() => navigate('/collaborators')}
          isPending={edit.isPending}
        />
      </Card>
    </div>
  );
}

type InnerCollaboratorProps = {
  collaboratorId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditCollaborator>;
};

function InnerCollaborator({
  isPending,
  onSubmit,
  collaboratorId,
}: InnerCollaboratorProps) {
  const { data } = useCollaboratorSuspense(collaboratorId);
  return (
    <EditCollaboratorForm
      isPending={isPending}
      onSubmit={onSubmit}
      collaborator={data}
    />
  );
}
