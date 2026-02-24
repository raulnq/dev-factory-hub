import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { contacts } from './contact.js';
import { clients } from './client.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count } from 'drizzle-orm';
import { listContactsSchema, clientSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = clientSchema.pick({ clientId: true });

export const listContactsRoute = new Hono().get(
  '/:clientId/contacts',
  zValidator('param', paramSchema),
  zValidator('query', listContactsSchema),
  async c => {
    const { clientId } = c.req.valid('param');
    const { pageNumber, pageSize } = c.req.valid('query');
    const offset = (pageNumber - 1) * pageSize;

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${clientId} not found`);
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(contacts)
      .where(eq(contacts.clientId, clientId));

    const items = await client
      .select()
      .from(contacts)
      .where(eq(contacts.clientId, clientId))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
