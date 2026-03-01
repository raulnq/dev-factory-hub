import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { clients } from '#/features/clients/client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addCollectionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { eq } from 'drizzle-orm';
import { getCollectionWithRelations } from './get-collection.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addCollectionSchema),
  async c => {
    const data = c.req.valid('json');

    const [existingClient] = await client
      .select()
      .from(clients)
      .where(eq(clients.clientId, data.clientId))
      .limit(1);

    if (!existingClient) {
      return notFoundError(c, `Client ${data.clientId} not found`);
    }

    const collectionId = v7();
    await client.insert(collections).values({
      collectionId,
      clientId: data.clientId,
      currency: data.currency,
      total: data.total,
      commission: data.commission,
      taxes: data.taxes,
      status: 'Pending',
      confirmedAt: null,
      canceledAt: null,
      filePath: null,
      contentType: null,
    });

    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    return c.json(item, StatusCodes.CREATED);
  }
);
