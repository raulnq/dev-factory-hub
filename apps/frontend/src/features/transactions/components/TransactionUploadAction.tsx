import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type TransactionUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function TransactionUploadAction({
  disabled,
  isPending,
  onUpload,
}: TransactionUploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this transaction."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
