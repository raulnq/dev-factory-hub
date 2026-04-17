import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { invoices } from './invoice.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { invoiceSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = invoiceSchema.pick({ invoiceId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:invoiceId/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { invoiceId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceId, invoiceId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Invoice ${invoiceId} not found`);
    }

    if (!existing.filePath) {
      return notFoundError(c, `Invoice ${invoiceId} has no file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
