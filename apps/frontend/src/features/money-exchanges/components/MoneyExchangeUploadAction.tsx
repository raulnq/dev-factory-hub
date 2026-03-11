import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type MoneyExchangeUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function MoneyExchangeUploadAction({
  disabled,
  isPending,
  onUpload,
}: MoneyExchangeUploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this money exchange."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
