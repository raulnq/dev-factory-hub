import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useCollaboratorRoleSuspense } from '../stores/useCollaboratorRoles';
import { ViewCollaboratorRoleCard } from '../components/ViewCollaboratorRoleCard';
import { CollaboratorRoleSkeleton } from '../components/CollaboratorRoleSkeleton';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { EditButton } from '@/components/EditButton';

export function ViewCollaboratorRolePage() {
  const { collaboratorRoleId } = useParams<{ collaboratorRoleId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View Collaborator Role"
          description="View collaborator role record details."
        >
          <EditButton
            className="sm:self-start"
            link={`/collaborator-roles/${collaboratorRoleId!}/edit`}
          >
            Edit
          </EditButton>
        </ViewCardHeader>

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
                  collaboratorRoleId={collaboratorRoleId!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/collaborator-roles')} />
      </Card>
    </div>
  );
}

type InnerCollaboratorRoleProps = {
  collaboratorRoleId: string;
};

function InnerCollaboratorRole({
  collaboratorRoleId,
}: InnerCollaboratorRoleProps) {
  const { data } = useCollaboratorRoleSuspense(collaboratorRoleId);
  return <ViewCollaboratorRoleCard collaboratorRole={data} />;
}
