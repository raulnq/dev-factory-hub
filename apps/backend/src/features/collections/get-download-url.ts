import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collectionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:collectionId/download-url',
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

    if (!existing.filePath) {
      return notFoundError(c, `Collection ${collectionId} has no file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
