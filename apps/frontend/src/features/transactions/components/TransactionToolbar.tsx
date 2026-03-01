import { useRef, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, XCircle, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  issueTransactionSchema,
  type IssueTransaction,
} from '#/features/transactions/schemas';

type TransactionToolbarProps = {
  status: string;
  filePath: string | null;
  isPending: boolean;
  onIssue: (data: IssueTransaction) => void;
  onCancel: () => void;
  onUpload: (file: File) => void;
  onDownload: () => void;
};

export function TransactionToolbar({
  status,
  filePath,
  isPending,
  onIssue,
  onCancel,
  onUpload,
  onDownload,
}: TransactionToolbarProps) {
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canIssue = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Issued';
  const canDownload = filePath !== null && filePath !== '';

  const issueForm = useForm<IssueTransaction>({
    resolver: zodResolver(issueTransactionSchema),
    defaultValues: {
      issuedAt: new Date().toISOString().split('T')[0],
      number: '',
    },
  });

  const handleIssue: SubmitHandler<IssueTransaction> = data => {
    onIssue(data);
    setIssueDialogOpen(false);
    issueForm.reset();
  };

  const handleUploadOpen = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadDialogOpen(true);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIssueDialogOpen(true)}
        disabled={isPending || !canIssue}
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Issue
      </Button>

      <Button
        type="button"
        onClick={() => setCancelDialogOpen(true)}
        disabled={isPending || !canCancel}
        variant="destructive"
        size="sm"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cancel
      </Button>

      <Button
        type="button"
        onClick={handleUploadOpen}
        disabled={isPending || !canUpload}
        variant="secondary"
        size="sm"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>

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

      {/* Issue Dialog */}
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Transaction</DialogTitle>
            <DialogDescription>
              Enter the issue date and number to mark this transaction as
              issued.
            </DialogDescription>
          </DialogHeader>
          <form
            id="issue-transaction-form"
            onSubmit={issueForm.handleSubmit(handleIssue)}
            className="space-y-4"
          >
            <Controller
              name="issuedAt"
              control={issueForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="issuedAt">Issue Date</FieldLabel>
                  <Input
                    {...field}
                    id="issuedAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="number"
              control={issueForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="issueNumber">Number</FieldLabel>
                  <Input
                    {...field}
                    id="issueNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder="TXN-001"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIssueDialogOpen(false);
                issueForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="issue-transaction-form">
              Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onCancel();
                setCancelDialogOpen(false);
              }}
              disabled={isPending}
            >
              Cancel Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload a PDF or image file for this transaction.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="transaction-file">File</FieldLabel>
            <input
              ref={fileInputRef}
              id="transaction-file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </Field>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={isPending || !selectedFile}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
