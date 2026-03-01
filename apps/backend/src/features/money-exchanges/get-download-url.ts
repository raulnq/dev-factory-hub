import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { moneyExchangeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = moneyExchangeSchema.pick({ moneyExchangeId: true });

export const getDownloadUrlRoute = new Hono().get(
  '/:moneyExchangeId/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { moneyExchangeId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(moneyExchanges)
      .where(eq(moneyExchanges.moneyExchangeId, moneyExchangeId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `MoneyExchange ${moneyExchangeId} not found`);
    }

    if (!existing.filePath) {
      return notFoundError(c, `MoneyExchange ${moneyExchangeId} has no file`);
    }

    const url = await getPresignedDownloadUrl(existing.filePath, 900);
    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
