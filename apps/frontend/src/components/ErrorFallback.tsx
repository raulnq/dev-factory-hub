import { Button } from '@/components/ui/button';

type ErrorFallbackProps = {
  resetErrorBoundary: () => void;
  message?: string;
};

export function ErrorFallback({
  resetErrorBoundary,
  message,
}: ErrorFallbackProps) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">{message}</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}
