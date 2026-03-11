import { Navigate, useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorFallback } from '@/components/ErrorFallback';
import type { EditClient } from '#/features/clients/schemas';
import { useEditClient, useClientSuspense } from '../stores/useClients';
import { ClientEditForm } from '../components/ClientEditForm';
import { ClientSkeleton } from '../components/ClientSkeleton';
import { ProjectsSection } from '../components/ProjectsSection';
import { ContactsSection } from '../components/ContactsSection';

export function EditClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const edit = useEditClient(clientId ?? '');
  if (!clientId) return <Navigate to="/clients" replace />;
  const onSubmit: SubmitHandler<EditClient> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Client updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save client'
      );
    }
  };

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load client"
              />
            )}
          >
            <Suspense fallback={<ClientSkeleton />}>
              <InnerClient
                isPending={edit.isPending}
                onSubmit={onSubmit}
                clientId={clientId!}
                onCancel={() => navigate('/clients')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProjectsSection clientId={clientId!} />
        <ContactsSection clientId={clientId!} />
      </div>
    </div>
  );
}

type InnerClientProps = {
  clientId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditClient>;
  onCancel: () => void;
};

function InnerClient({
  isPending,
  onSubmit,
  clientId,
  onCancel,
}: InnerClientProps) {
  const { data } = useClientSuspense(clientId);
  return (
    <ClientEditForm
      isPending={isPending}
      onSubmit={onSubmit}
      client={data}
      onCancel={onCancel}
    />
  );
}
