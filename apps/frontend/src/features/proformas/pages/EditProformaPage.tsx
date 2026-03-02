import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { EditProformaForm } from '../components/EditProformaForm';
import { ProformaItemsSection } from '../components/ProformaItemsSection';
import { ProformaSkeleton } from '../components/ProformaSkeleton';
import {
  useProformaSuspense,
  useEditProforma,
  useIssueProforma,
  useCancelProforma,
} from '../stores/useProformas';
import { toast } from 'sonner';
import type { EditProforma, IssueProforma } from '#/features/proformas/schemas';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '../utils/status-variants';
import { ProformaToolbar } from '../components/ProformaToolbar';

export function EditProformaPage() {
  const { proformaId } = useParams() as { proformaId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load proforma"
              />
            )}
          >
            <Suspense fallback={<ProformaSkeleton />}>
              <EditProformaInner
                proformaId={proformaId}
                onCancel={() => navigate('/proformas')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

function EditProformaInner({
  proformaId,
  onCancel,
}: {
  proformaId: string;
  onCancel: () => void;
}) {
  const { data: proforma } = useProformaSuspense(proformaId);
  const edit = useEditProforma(proformaId);
  const issue = useIssueProforma(proformaId);
  const cancel = useCancelProforma(proformaId);

  const handleSubmit = async (data: EditProforma) => {
    try {
      await edit.mutateAsync(data);
      toast.success('Project updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update');
    }
  };

  const handleIssue = async (data: IssueProforma) => {
    try {
      await issue.mutateAsync(data);
      toast.success('Project issued');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to issue');
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Project canceled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel');
    }
  };

  const isPending = edit.isPending || issue.isPending || cancel.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <FormCardHeader
          title={`Edit Proforma ${proforma.number}`}
          description="Update proforma details."
          renderAction={
            proforma.status && (
              <Badge variant={getStatusVariant(proforma.status)}>
                {proforma.status}
              </Badge>
            )
          }
        >
          <ProformaToolbar
            onCancel={handleCancel}
            onIssue={handleIssue}
            total={proforma.total}
            isPending={isPending}
            status={proforma.status}
          />
        </FormCardHeader>
        <EditProformaForm
          proforma={proforma}
          onSubmit={handleSubmit}
          isPending={edit.isPending}
        />
        <FormCardFooter
          formId={'proforma-form'}
          isPending={isPending}
          onCancel={onCancel}
        />
      </Card>

      <ProformaItemsSection proformaId={proformaId} status={proforma.status} />
    </div>
  );
}
