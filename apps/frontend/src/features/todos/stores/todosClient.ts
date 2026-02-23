import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddTodo,
  EditTodo,
  Todo,
  ListTodos,
} from '#/features/todos/schemas';

export async function listTodos(
  params?: ListTodos,
  token?: string | null
): Promise<Page<Todo>> {
  const response = await client.api.todos.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch stores');
  }
  return response.json();
}

export async function getTodo(
  todoId: string,
  token?: string | null
): Promise<Todo> {
  const response = await client.api.todos[':todoId'].$get(
    { param: { todoId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch todo');
  }
  return response.json();
}

export async function addTodo(
  data: AddTodo,
  token?: string | null
): Promise<Todo> {
  const response = await client.api.todos.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add todo');
  }
  return response.json();
}

export async function editTodo(
  todoId: string,
  data: EditTodo,
  token?: string | null
): Promise<Todo> {
  const response = await client.api.todos[':todoId'].$put(
    {
      param: { todoId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update todo');
  }
  return response.json();
}
