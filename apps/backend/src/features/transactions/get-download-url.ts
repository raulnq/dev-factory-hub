import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { transactions } from './transaction.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { transactionSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = transactionSchema.pick({ transactionId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:transactionId/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { transactionId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(transactions)
      .where(eq(transactions.transactionId, transactionId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Transaction ${transactionId} not found`);
    }

    if (!existing.filePath) {
      return notFoundError(c, `Transaction ${transactionId} has no file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
