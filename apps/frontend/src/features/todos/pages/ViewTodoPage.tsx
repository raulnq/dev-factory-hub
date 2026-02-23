import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useTodoSuspense } from '../stores/useTodos';
import { ViewTodoCard } from '../components/ViewTodoCard';
import { TodoSkeleton } from '../components/TodoSkeleton';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewTodoPage() {
  const { todoId } = useParams<{ todoId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View Todo"
          description="View an existing todo item."
        >
          <Button className="sm:self-start" asChild>
            <Link to={`/todos/${todoId!}/edit`}>
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
                  message="Failed to load todo"
                />
              )}
            >
              <Suspense fallback={<TodoSkeleton />}>
                <InnerTodo todoId={todoId!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/todos')} />
      </Card>
    </div>
  );
}

type InnerTodoProps = {
  todoId: string;
};

function InnerTodo({ todoId }: InnerTodoProps) {
  const { data } = useTodoSuspense(todoId);
  return <ViewTodoCard todo={data} />;
}
