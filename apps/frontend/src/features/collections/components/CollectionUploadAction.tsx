import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type CollectionUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function CollectionUploadAction({
  disabled,
  isPending,
  onUpload,
}: CollectionUploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this collection."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
