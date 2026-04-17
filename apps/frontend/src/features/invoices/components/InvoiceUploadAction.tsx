import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type InvoiceUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function InvoiceUploadAction({
  disabled,
  isPending,
  onUpload,
}: InvoiceUploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this invoice."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
