# Pages Templates

Pages are thin wrappers that handle routing, mutations, error boundaries, and navigation. Form/view components render `FormCard` directly — pages do NOT wrap content in `Card`.

## List Page (`pages/List<Entity>Page.tsx`)

Single `Card` with `ListCardHeader` (title + `AddButton` via `renderAction` + search as children) + `CardContent` wrapping triple-layer table.

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  <Entities>Skeleton,
  <Entity>Table,
} from '../components/<Entity>Table';
import { <Entity>SearchBar } from '../components/<Entity>SearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function List<Entity>Page() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="<Entities>"
          description="Manage your <entities>."
          renderAction={
            <AddButton link="/<entities>/new" text="Add <Entity>" />
          }
        >
          <<Entity>SearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load <entities>"
                  />
                )}
              >
                <Suspense fallback={<<Entities>Skeleton />}>
                  <<Entity>Table />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Add Page (`pages/Add<Entity>Page.tsx`)

Page renders the form component directly — no Card wrapping. The form component renders `FormCard` internally.

```tsx
import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { Add<Entity> } from '#/features/<entities>/schemas';
import { useAdd<Entity> } from '../stores/use<Entities>';
import { <Entity>AddForm } from '../components/<Entity>AddForm';

export function Add<Entity>Page() {
  const navigate = useNavigate();
  const add = useAdd<Entity>();

  const onSubmit: SubmitHandler<Add<Entity>> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('<Entity> created successfully');
      navigate(`/<entities>/${result.<entityId>}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save <entity>'
      );
    }
  };

  return (
    <div className="space-y-4">
      <<Entity>AddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/<entities>')}
      />
    </div>
  );
}
```

## Edit Page — Simple (`pages/Edit<Entity>Page.tsx`)

**Inner component pattern**: Error boundary wraps inner component that fetches entity data. For simple features (no state transitions), the page manages the mutation and passes props down.

```tsx
import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Edit<Entity> } from '#/features/<entities>/schemas';
import {
  useEdit<Entity>,
  use<Entity>Suspense,
} from '../stores/use<Entities>';
import { <Entity>EditForm } from '../components/<Entity>EditForm';
import { <Entity>Skeleton } from '../components/<Entity>Skeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function Edit<Entity>Page() {
  const navigate = useNavigate();
  const { <entityId> } = useParams<{ <entityId>: string }>();
  const edit = useEdit<Entity>(<entityId>!);

  const onSubmit: SubmitHandler<Edit<Entity>> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('<Entity> updated successfully');
      navigate('/<entities>');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save <entity>'
      );
    }
  };

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load <entity>"
              />
            )}
          >
            <Suspense fallback={<<Entity>Skeleton />}>
              <Inner<Entity>
                isPending={edit.isPending}
                onSubmit={onSubmit}
                onCancel={() => navigate('/<entities>')}
                <entityId>={<entityId>!}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
  onCancel: () => void;
};

function Inner<Entity>({
  isPending,
  onSubmit,
  onCancel,
  <entityId>,
}: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return (
    <<Entity>EditForm
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
      <entity>={data}
    />
  );
}
```

## Edit Page — With State Transitions (`pages/Edit<Entity>Page.tsx`)

For features with workflow state transitions, the **inner component manages its own mutations** and handlers. It receives only `entityId` and `onCancel`, and computes a combined `isPending` from all mutations.

```tsx
import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Confirm<Entity>,
  Edit<Entity>,
} from '#/features/<entities>/schemas';
import {
  use<Entity>Suspense,
  useEdit<Entity>,
  useConfirm<Entity>,
  useCancel<Entity>,
  useUpload<Entity>,
} from '../stores/use<Entities>';
import { <Entity>EditForm } from '../components/<Entity>EditForm';
import { <Entity>Skeleton } from '../components/<Entity>Skeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function Edit<Entity>Page() {
  const { <entityId> } = useParams() as { <entityId>: string };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load <entity>"
              />
            )}
          >
            <Suspense fallback={<<Entity>Skeleton />}>
              <Edit<Entity>Inner
                <entityId>={<entityId>}
                onCancel={() => navigate('/<entities>')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type Edit<Entity>InnerProps = {
  <entityId>: string;
  onCancel: () => void;
};

function Edit<Entity>Inner({
  <entityId>,
  onCancel,
}: Edit<Entity>InnerProps) {
  const { data: <entity> } = use<Entity>Suspense(<entityId>);
  const edit = useEdit<Entity>(<entityId>);
  const confirm = useConfirm<Entity>(<entityId>);
  const cancel = useCancel<Entity>(<entityId>);
  const upload = useUpload<Entity>(<entityId>);

  const handleSubmit: SubmitHandler<Edit<Entity>> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('<Entity> updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update <entity>'
      );
    }
  };

  const handleConfirm = async (data: Confirm<Entity>) => {
    try {
      await confirm.mutateAsync(data);
      toast.success('<Entity> confirmed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to confirm <entity>'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await cancel.mutateAsync();
      toast.success('<Entity> canceled');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel <entity>'
      );
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await upload.mutateAsync(file);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  const isPending =
    edit.isPending ||
    confirm.isPending ||
    cancel.isPending ||
    upload.isPending;

  return (
    <<Entity>EditForm
      <entity>={<entity>}
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      on<Entity>Confirm={handleConfirm}
      on<Entity>Cancel={handleCancel}
      on<Entity>Upload={handleUpload}
    />
  );
}
```

Key differences from the simple edit page:

- Inner component receives only `entityId` and `onCancel` (not `isPending`/`onSubmit`)
- Inner creates all mutation hooks and defines handlers with try/catch/toast
- Combined `isPending` from all mutations
- Edit form receives action callbacks (e.g., `on<Entity>Confirm`, `on<Entity>Cancel`)

## View Page (`pages/View<Entity>Page.tsx`)

Same inner component pattern. No Card wrapping — `<Entity>ViewCard` renders `FormCard` internally.

```tsx
import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { use<Entity>Suspense } from '../stores/use<Entities>';
import { <Entity>ViewCard } from '../components/<Entity>ViewCard';
import { <Entity>Skeleton } from '../components/<Entity>Skeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function View<Entity>Page() {
  const { <entityId> } = useParams<{ <entityId>: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load <entity>"
              />
            )}
          >
            <Suspense fallback={<<Entity>Skeleton />}>
              <Inner<Entity>
                <entityId>={<entityId>!}
                onCancel={() => navigate('/<entities>')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
  onCancel: () => void;
};

function Inner<Entity>({ <entityId>, onCancel }: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return <<Entity>ViewCard <entity>={data} onCancel={onCancel} />;
}
```
