import { Hono } from 'hono';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { collections } from './collection.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collectionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { uploadFile, deleteFile } from './s3-client.js';
import { getCollectionWithRelations } from './get-collection.js';

const paramSchema = collectionSchema.pick({ collectionId: true });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => ALLOWED_MIME_TYPES.includes(file.type), {
      message: 'File type must be a PDF or image',
    })
    .refine(file => file.name.length <= 250, {
      message: 'File name must not exceed 250 characters',
    }),
});

export const uploadRoute = new Hono().post(
  '/:collectionId/upload',
  zValidator('param', paramSchema),
  zValidator('form', formSchema),
  async c => {
    const { collectionId } = c.req.valid('param');
    const { file } = c.req.valid('form');

    const [existing] = await client
      .select()
      .from(collections)
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Collection ${collectionId} not found`);
    }

    if (existing.filePath) {
      await deleteFile(existing.filePath);
    }

    const filePath = await uploadFile(file, collectionId);

    await client
      .update(collections)
      .set({ filePath, contentType: file.type })
      .where(eq(collections.collectionId, collectionId));

    const [item] = await getCollectionWithRelations()
      .where(eq(collections.collectionId, collectionId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
