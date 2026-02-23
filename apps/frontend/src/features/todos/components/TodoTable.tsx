import { Link, useSearchParams } from 'react-router';
import { Search, Pencil, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTodosSuspense } from '../stores/useTodos';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';

export function TodosSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-[100px]">Completed</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TodoTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const { data } = useTodosSuspense({ name: name });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Completed</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map(todo => (
            <TableRow key={todo.todoId}>
              <TableCell className="font-medium">
                <Link to={`/todos/${todo.todoId}`} className="hover:underline">
                  {todo.name}
                </Link>
              </TableCell>
              <TableCell>
                {todo.completed ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                    Yes
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-4 w-4" />
                    No
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/todos/${todo.todoId}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/todos/${todo.todoId}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
