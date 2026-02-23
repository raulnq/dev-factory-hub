import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { todos } from './todo.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editTodoSchema, todoSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = todoSchema.pick({ todoId: true });

export const editRoute = new Hono().put(
  '/:todoId',
  zValidator('param', paramSchema),
  zValidator('json', editTodoSchema),
  async c => {
    const { todoId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(todos)
      .where(eq(todos.todoId, todoId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Todo ${todoId} not found`);
    }
    const [todo] = await client
      .update(todos)
      .set(data)
      .where(eq(todos.todoId, todoId))
      .returning();
    return c.json(todo, StatusCodes.OK);
  }
);
