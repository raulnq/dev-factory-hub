import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditTodo } from '#/features/todos/schemas';
import { useEditTodo, useTodoSuspense } from '../stores/useTodos';
import { EditTodoForm } from '../components/EditTodoForm';
import { TodoSkeleton } from '../components/TodoSkeleton';
import { Card } from '@/components/ui/card';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditTodoPage() {
  const navigate = useNavigate();
  const { todoId } = useParams<{ todoId: string }>();
  const edit = useEditTodo(todoId!);

  const onSubmit: SubmitHandler<EditTodo> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Todo updated successfully');
      navigate('/todos');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save todo'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Edit Todo"
          description="Edit an existing todo item."
        />
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
                <InnerTodo
                  isPending={edit.isPending}
                  onSubmit={onSubmit}
                  todoId={todoId!}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <FormCardFooter
          formId="form"
          saveText="Save Todo"
          cancelText="Cancel"
          onCancel={() => navigate('/todos')}
          isPending={edit.isPending}
        />
      </Card>
    </div>
  );
}

type InnerTodoProps = {
  todoId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditTodo>;
};

function InnerTodo({ isPending, onSubmit, todoId }: InnerTodoProps) {
  const { data } = useTodoSuspense(todoId);
  return <EditTodoForm isPending={isPending} onSubmit={onSubmit} todo={data} />;
}
