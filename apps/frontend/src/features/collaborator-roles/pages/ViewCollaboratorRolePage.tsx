import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useCollaboratorRoleSuspense } from '../stores/useCollaboratorRoles';
import { CollaboratorRoleViewCard } from '../components/CollaboratorRoleViewCard';
import { CollaboratorRoleSkeleton } from '../components/CollaboratorRoleSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewCollaboratorRolePage() {
  const { collaboratorRoleId } = useParams<{ collaboratorRoleId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
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
                onCancel={() => navigate('/collaborator-roles')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerCollaboratorRoleProps = {
  collaboratorRoleId: string;
  onCancel: () => void;
};

function InnerCollaboratorRole({
  collaboratorRoleId,
  onCancel,
}: InnerCollaboratorRoleProps) {
  const { data } = useCollaboratorRoleSuspense(collaboratorRoleId);
  return (
    <CollaboratorRoleViewCard collaboratorRole={data} onCancel={onCancel} />
  );
}
