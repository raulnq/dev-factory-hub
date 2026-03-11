import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useCollaboratorSuspense } from '../stores/useCollaborators';
import { CollaboratorViewCard } from '../components/CollaboratorViewCard';
import { CollaboratorSkeleton } from '../components/CollaboratorSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewCollaboratorPage() {
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
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
                message="Failed to load collaborator"
              />
            )}
          >
            <Suspense fallback={<CollaboratorSkeleton />}>
              <InnerCollaborator
                collaboratorId={collaboratorId!}
                onCancel={() => navigate('/collaborators')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerCollaboratorProps = {
  collaboratorId: string;
  onCancel: () => void;
};

function InnerCollaborator({
  collaboratorId,
  onCancel,
}: InnerCollaboratorProps) {
  const { data } = useCollaboratorSuspense(collaboratorId);
  return <CollaboratorViewCard collaborator={data} onCancel={onCancel} />;
}
