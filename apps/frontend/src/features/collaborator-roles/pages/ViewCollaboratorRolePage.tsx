import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useCollaboratorRoleSuspense } from '../stores/useCollaboratorRoles';
import { ViewCollaboratorRoleCard } from '../components/ViewCollaboratorRoleCard';
import { CollaboratorRoleSkeleton } from '../components/CollaboratorRoleSkeleton';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ErrorFallback } from '@/components/ErrorFallback';

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
          <Button className="sm:self-start" asChild>
            <Link to={`/collaborator-roles/${collaboratorRoleId!}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
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
