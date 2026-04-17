import { Hono } from 'hono';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { invoiceSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { uploadFile, deleteFile } from './s3-client.js';

const paramSchema = invoiceSchema.pick({ invoiceId: true });

const MAX_FILE_SIZE = 50 * 1024 * 1024;
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
  '/:invoiceId/upload',
  zValidator('param', paramSchema),
  zValidator('form', formSchema),
  async c => {
    const { invoiceId } = c.req.valid('param');
    const { file } = c.req.valid('form');

    const [existing] = await client
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Invoice ${invoiceId} not found`);
    }

    if (existing.status === 'Canceled') {
      return conflictError(c, `Cannot upload file to a canceled invoice.`);
    }

    if (existing.filePath) {
      await deleteFile(existing.filePath);
    }

    const filePath = await uploadFile(file, invoiceId);

    const [item] = await client
      .update(invoices)
      .set({ filePath, contentType: file.type })
      .where(eq(invoices.invoiceId, invoiceId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
