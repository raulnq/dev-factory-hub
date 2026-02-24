import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addClientSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addClientSchema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(clients)
      .values({ ...data, clientId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
