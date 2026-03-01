import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collectionSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollectionWithRelations } from './get-collection.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

export const cancelRoute = new Hono().post(
  '/:collectionId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { collectionId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Collection ${collectionId} not found`);
    }

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel collection with status "Canceled". Already canceled.`
      );
    }

    await client
      .update(collections)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(eq(collections.collectionId, collectionId));

    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
