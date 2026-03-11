import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConfirmCollection } from '#/features/collections/schemas';
import { CollectionConfirmAction } from './CollectionConfirmAction';
import { CollectionCancelAction } from './CollectionCancelAction';
import { CollectionUploadAction } from './CollectionUploadAction';

type CollectionToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onConfirm: (data: ConfirmCollection) => void;
  onCancel: () => void;
  onUpload: (file: File) => void;
  onDownload: () => void;
};

export function CollectionToolbar({
  status,
  filePath,
  isPending,
  onConfirm,
  onCancel,
  onUpload,
  onDownload,
}: CollectionToolbarProps) {
  const canConfirm = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Confirmed';
  const canDownload = filePath !== null && filePath !== '';

  return (
    <>
      <CollectionConfirmAction
        disabled={!canConfirm}
        isPending={isPending}
        onConfirm={onConfirm}
      />

      <CollectionCancelAction
        disabled={!canCancel}
        isPending={isPending}
        onCancel={onCancel}
      />

      <CollectionUploadAction
        disabled={!canUpload}
        isPending={isPending}
        onUpload={onUpload}
      />

      <Button
        type="button"
        onClick={onDownload}
        disabled={isPending || !canDownload}
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </>
  );
}
