import { UncontrolledFileUploadDialog } from '@/components/UncontrolledFileUploadDialog';

type PayrollPaymentUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => Promise<void> | void;
};

export function PayrollPaymentUploadAction({
  disabled,
  isPending,
  onUpload,
}: PayrollPaymentUploadActionProps) {
  return (
    <UncontrolledFileUploadDialog
      title="Upload File"
      description="Upload a PDF or image file for this payroll payment."
      label="Upload"
      disabled={disabled}
      isPending={isPending}
      onUpload={onUpload}
    />
  );
}
