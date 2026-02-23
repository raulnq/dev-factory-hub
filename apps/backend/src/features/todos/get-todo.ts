import { Hono } from 'hono';
import { todos } from './todo.js';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { todoSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = todoSchema.pick({ todoId: true });

export const getRoute = new Hono().get(
  '/:todoId',
  zValidator('param', schema),
  async c => {
    const { todoId } = c.req.valid('param');
    const [todo] = await client
      .select()
      .from(todos)
      .where(eq(todos.todoId, todoId))
      .limit(1);
    if (!todo) {
      return notFoundError(c, `Todo ${todoId} not found`);
    }
    return c.json(todo, StatusCodes.OK);
  }
);
