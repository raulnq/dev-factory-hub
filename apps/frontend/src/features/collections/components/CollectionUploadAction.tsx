import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';

type CollectionUploadActionProps = {
  disabled: boolean;
  isPending: boolean;
  onUpload: (file: File) => void;
};

export function CollectionUploadAction({
  disabled,
  isPending,
  onUpload,
}: CollectionUploadActionProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={disabled || isPending}
          variant="secondary"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
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
            onClick={() => handleOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !selectedFile}
            type="button"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
