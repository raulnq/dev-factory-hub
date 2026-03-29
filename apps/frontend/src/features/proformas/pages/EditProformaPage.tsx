import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ProformaEditForm } from '../components/ProformaEditForm';
import { ProformaItemsSection } from '../components/ProformaItemsSection';
import { ProformaSkeleton } from '../components/ProformaSkeleton';
import {
  useProformaSuspense,
  useEditProforma,
  useIssueProforma,
  useCancelProforma,
  useProformaDownloadUrl,
} from '../stores/useProformas';
import { toast } from 'sonner';
import type { EditProforma, IssueProforma } from '#/features/proformas/schemas';

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
  const downloadUrl = useProformaDownloadUrl(proformaId);

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

  const handleDownload = async () => {
    try {
      const result = await downloadUrl.mutateAsync();
      window.open(result.url, '_blank');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to download PDF'
      );
    }
  };

  const isPending =
    edit.isPending ||
    issue.isPending ||
    cancel.isPending ||
    downloadUrl.isPending;

  return (
    <div className="space-y-6">
      <ProformaEditForm
        proforma={proforma}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isPending={isPending}
        onProformaCancel={handleCancel}
        onProformaIssue={handleIssue}
        onProformaDownload={handleDownload}
      />

      <ProformaItemsSection proformaId={proformaId} status={proforma.status} />
    </div>
  );
}
