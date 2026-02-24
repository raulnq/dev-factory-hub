import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editClientSchema, clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const editRoute = new Hono().put(
  '/:clientId',
  zValidator('param', paramSchema),
  zValidator('json', editClientSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);

    if (existing.length === 0) {
      return notFoundError(c, `Client ${clientId} not found`);
    }

    const [item] = await client
      .update(clients)
      .set(data)
      .where(eq(clients.clientId, clientId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
