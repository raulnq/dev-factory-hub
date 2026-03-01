import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collectionSchema, confirmCollectionSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollectionWithRelations } from './get-collection.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

export const confirmRoute = new Hono().post(
  '/:collectionId/confirm',
  zValidator('param', paramSchema),
  zValidator('json', confirmCollectionSchema),
  async c => {
    const { collectionId } = c.req.valid('param');
    const { confirmedAt } = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Collection ${collectionId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot confirm collection with status "${existing.status}". Must be in "Pending" status.`
      );
    }

    await client
      .update(collections)
      .set({ status: 'Confirmed', confirmedAt })
      .where(eq(collections.collectionId, collectionId));

    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
