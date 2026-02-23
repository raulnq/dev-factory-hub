import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const todoSchema = z.object({
  todoId: z.uuidv7(),
  name: z.string().min(1).max(1024),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;

export const addTodoSchema = todoSchema.omit({ todoId: true, completed: true });

export type AddTodo = z.infer<typeof addTodoSchema>;

export const editTodoSchema = todoSchema.pick({ name: true, completed: true });

export type EditTodo = z.infer<typeof editTodoSchema>;

export const listTodosSchema = paginationSchema.extend({
  name: z.string().optional(),
  completed: z.boolean().optional(),
});

export type ListTodos = z.infer<typeof listTodosSchema>;
