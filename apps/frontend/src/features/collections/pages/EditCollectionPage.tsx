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
import { CollectionEditForm } from '../components/CollectionEditForm';
import { CollectionSkeleton } from '../components/CollectionSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditCollectionPage() {
  const { collectionId } = useParams() as { collectionId: string };
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

  return (
    <CollectionEditForm
      collection={collection}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onCollectionConfirm={handleConfirm}
      onCollectionCancel={handleCancel}
      onCollectionUpload={handleUpload}
      onCollectionDownload={handleDownload}
    />
  );
}
