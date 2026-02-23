# Pages Templates

All pages wrap content in a single `Card` and use shared card components. No per-feature header components.

## List Page (`pages/List<Entity>Page.tsx`)

Single `Card` with `ListCardHeader` (title + add button + search as children) + `CardContent` wrapping triple-layer table.

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

export function List<Entity>Page() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="<Entities>"
          description="Search your <entities>."
          addLink="/<entities>/new"
          addText="Add <Entity>"
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

Single `Card` with `FormCardHeader` + form component + `FormCardFooter`. Page owns the Card — form only renders fields.

```tsx
import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { Add<Entity> } from '#/features/<entities>/schemas';
import { useAdd<Entity> } from '../stores/use<Entities>';
import { Add<Entity>Form } from '../components/Add<Entity>Form';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

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
      <Card>
        <FormCardHeader
          title="Add <Entity>"
          description="Create a new <entity>."
        />
        <Add<Entity>Form isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save <Entity>"
          cancelText="Cancel"
          onCancel={() => navigate('/<entities>')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
```

## Edit Page (`pages/Edit<Entity>Page.tsx`)

**Inner component pattern**: Single `Card` with `FormCardHeader` + error boundary wrapping inner component + `FormCardFooter` outside the boundary.

```tsx
import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Edit<Entity> } from '#/features/<entities>/schemas';
import { useEdit<Entity>, use<Entity>Suspense } from '../stores/use<Entities>';
import { Edit<Entity>Form } from '../components/Edit<Entity>Form';
import { <Entity>Skeleton } from '../components/<Entity>Skeleton';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
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
      <Card>
        <FormCardHeader
          title="Edit <Entity>"
          description="Edit an existing <entity>."
        />
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
                  <entityId>={<entityId>!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save <Entity>"
          cancelText="Cancel"
          onCancel={() => navigate('/<entities>')}
          isPending={edit.isPending}
        />
      </Card>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
};

function Inner<Entity>({ isPending, onSubmit, <entityId> }: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return (
    <Edit<Entity>Form isPending={isPending} onSubmit={onSubmit} <entity>={data} />
  );
}
```

## View Page (`pages/View<Entity>Page.tsx`)

Same inner component pattern. `ViewCardHeader` includes an Edit button via `children`. `ViewCardFooter` has only a Cancel button.

```tsx
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { use<Entity>Suspense } from '../stores/use<Entities>';
import { View<Entity>Card } from '../components/View<Entity>Card';
import { <Entity>Skeleton } from '../components/<Entity>Skeleton';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ErrorFallback } from '@/components/ErrorFallback';

export function View<Entity>Page() {
  const { <entityId> } = useParams<{ <entityId>: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View <Entity>"
          description="View an existing <entity>."
        >
          <Button className="sm:self-start" asChild>
            <Link to={`/<entities>/${<entityId>!}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </ViewCardHeader>
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
                <Inner<Entity> <entityId>={<entityId>!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/<entities>')} />
      </Card>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
};

function Inner<Entity>({ <entityId> }: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return <View<Entity>Card <entity>={data} />;
}
```
