import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { clients } from '#/features/clients/client.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collectionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

export function getCollectionWithRelations() {
  return client
    .select({
      collectionId: collections.collectionId,
      clientId: collections.clientId,
      clientName: clients.name,
      currency: collections.currency,
      total: collections.total,
      commission: collections.commission,
      taxes: collections.taxes,
      status: collections.status,
      confirmedAt: collections.confirmedAt,
      createdAt: collections.createdAt,
      canceledAt: collections.canceledAt,
      filePath: collections.filePath,
      contentType: collections.contentType,
    })
    .from(collections)
    .leftJoin(clients, eq(collections.clientId, clients.clientId));
}

export const getRoute = new Hono().get(
  '/:collectionId',
  zValidator('param', paramSchema),
  async c => {
    const { collectionId } = c.req.valid('param');
    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `Collection ${collectionId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
