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
  confirmCollectionSchema,
  type ConfirmCollection,
} from '#/features/collections/schemas';

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canConfirm = status === 'Pending';
  const canCancel = status !== 'Canceled';
  const canUpload = status === 'Pending' || status === 'Confirmed';
  const canDownload = filePath !== null && filePath !== '';

  const confirmForm = useForm<ConfirmCollection>({
    resolver: zodResolver(confirmCollectionSchema),
    defaultValues: {
      confirmedAt: new Date().toISOString().split('T')[0],
    },
  });

  const handleConfirm: SubmitHandler<ConfirmCollection> = data => {
    onConfirm(data);
    setConfirmDialogOpen(false);
    confirmForm.reset();
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
        onClick={() => setConfirmDialogOpen(true)}
        disabled={isPending || !canConfirm}
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Confirm
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

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Collection</DialogTitle>
            <DialogDescription>
              Enter the confirmation date to mark this collection as confirmed.
            </DialogDescription>
          </DialogHeader>
          <form
            id="confirm-collection-form"
            onSubmit={confirmForm.handleSubmit(handleConfirm)}
          >
            <Controller
              name="confirmedAt"
              control={confirmForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmedAt">
                    Confirmation Date
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmedAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
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
                setConfirmDialogOpen(false);
                confirmForm.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="confirm-collection-form"
              disabled={isPending}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this collection? This action
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
              Cancel Collection
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
              Upload a PDF or image file for this collection.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="collection-file">File</FieldLabel>
            <input
              ref={fileInputRef}
              id="collection-file"
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
