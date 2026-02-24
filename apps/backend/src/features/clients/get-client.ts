import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = clientSchema.pick({ clientId: true });

export const getRoute = new Hono().get(
  '/:clientId',
  zValidator('param', schema),
  async c => {
    const { clientId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Client ${clientId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
