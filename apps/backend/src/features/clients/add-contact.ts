import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { contacts } from './contact.js';
import { clients } from './client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { addContactSchema, clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const addContactRoute = new Hono().post(
  '/:clientId/contacts',
  zValidator('param', paramSchema),
  zValidator('json', addContactSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${clientId} not found`);
    }

    const [item] = await client
      .insert(contacts)
      .values({ ...data, contactId: v7(), clientId })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
