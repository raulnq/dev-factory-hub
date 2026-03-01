import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  ConfirmCollection,
  EditCollection,
} from '#/features/collections/schemas';
import {
  useCollectionSuspense,
  useEditCollection,
  useConfirmCollection,
  useCancelCollection,
  useUploadCollection,
  useCollectionDownloadUrl,
} from '../stores/useCollections';
import { EditCollectionForm } from '../components/EditCollectionForm';
import { CollectionSkeleton } from '../components/CollectionSkeleton';
import { CollectionToolbar } from '../components/CollectionToolbar';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Badge } from '@/components/ui/badge';
import type { BadgeProps } from '@/components/ui/badge';

function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'Pending':
      return 'default';
    case 'Confirmed':
      return 'secondary';
    case 'Canceled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function EditCollectionPage() {
  const { collectionId } = useParams() as { collectionId: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load collection"
                />
              )}
            >
              <Suspense fallback={<CollectionSkeleton />}>
                <EditCollectionInner
                  collectionId={collectionId}
                  onCancel={() => navigate('/collections')}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Card>
    </div>
  );
}

type EditCollectionInnerProps = {
  collectionId: string;
  onCancel: () => void;
};

function EditCollectionInner({
  collectionId,
  onCancel,
}: EditCollectionInnerProps) {
  const { data: collection } = useCollectionSuspense(collectionId);
  const edit = useEditCollection(collectionId);
  const confirm = useConfirmCollection(collectionId);
  const cancel = useCancelCollection(collectionId);
  const upload = useUploadCollection(collectionId);
  const downloadUrl = useCollectionDownloadUrl(collectionId);

  const handleSubmit: SubmitHandler<EditCollection> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Collection updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update collection'
      );
    }
  };

  const handleConfirm = async (data: ConfirmCollection) => {
    try {
      await confirm.mutateAsync(data);
      toast.success('Collection confirmed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to confirm collection'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('Collection canceled');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel collection'
      );
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload.mutateAsync(file);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadUrl.mutateAsync();
      window.open(result.url, '_blank');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get download URL'
      );
    }
  };

  const isPending =
    edit.isPending ||
    confirm.isPending ||
    cancel.isPending ||
    upload.isPending ||
    downloadUrl.isPending;

  const isEditable = collection.status === 'Pending';

  return (
    <>
      <FormCardHeader
        title="Edit Collection"
        description="Update collection details."
        renderAction={
          <Badge variant={statusVariant(collection.status)}>
            {collection.status}
          </Badge>
        }
      >
        <CollectionToolbar
          status={collection.status}
          filePath={collection.filePath}
          isPending={isPending}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </FormCardHeader>
      <EditCollectionForm
        collection={collection}
        isPending={edit.isPending}
        onSubmit={handleSubmit}
      />
      <FormCardFooter
        formId={isEditable ? 'form' : undefined}
        saveText="Save Collection"
        cancelText="Back"
        onCancel={onCancel}
        isPending={isPending}
      />
    </>
  );
}
