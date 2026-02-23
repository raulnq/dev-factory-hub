import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { todos } from './todo.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addTodoSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addTodoSchema),
  async c => {
    const data = c.req.valid('json');
    const [todo] = await client
      .insert(todos)
      .values({ ...data, completed: false, todoId: v7() })
      .returning();
    return c.json(todo, StatusCodes.CREATED);
  }
);
