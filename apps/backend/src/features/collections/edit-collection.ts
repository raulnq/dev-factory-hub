import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editCollectionSchema, collectionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getCollectionWithRelations } from './get-collection.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

export const editRoute = new Hono().put(
  '/:collectionId',
  zValidator('param', paramSchema),
  zValidator('json', editCollectionSchema),
  async c => {
    const { collectionId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Collection ${collectionId} not found`);
    }

    await client
      .update(collections)
      .set(data)
      .where(eq(collections.collectionId, collectionId));

    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
