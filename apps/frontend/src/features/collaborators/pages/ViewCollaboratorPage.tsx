import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useCollaboratorSuspense } from '../stores/useCollaborators';
import { ViewCollaboratorCard } from '../components/ViewCollaboratorCard';
import { CollaboratorSkeleton } from '../components/CollaboratorSkeleton';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { EditButton } from '@/components/EditButton';

export function ViewCollaboratorPage() {
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View Collaborator"
          description="View collaborator record details."
        >
          <EditButton
            className="sm:self-start"
            link={`/collaborators/${collaboratorId!}/edit`}
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
                  message="Failed to load collaborator"
                />
              )}
            >
              <Suspense fallback={<CollaboratorSkeleton />}>
                <InnerCollaborator collaboratorId={collaboratorId!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/collaborators')} />
      </Card>
    </div>
  );
}

type InnerCollaboratorProps = {
  collaboratorId: string;
};

function InnerCollaborator({ collaboratorId }: InnerCollaboratorProps) {
  const { data } = useCollaboratorSuspense(collaboratorId);
  return <ViewCollaboratorCard collaborator={data} />;
}
