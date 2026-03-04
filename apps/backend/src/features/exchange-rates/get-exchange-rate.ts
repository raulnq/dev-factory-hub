import { client } from '#/database/client.js';
import { notFoundError } from '#/extensions.js';
import { zValidator } from '#/validator.js';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { exchangeRates } from './exchange-rate.js';
import { exchangeRateSchema } from './schemas.js';

const paramSchema = exchangeRateSchema.pick({ exchangeRateId: true });

export const getRoute = new Hono().get(
  '/:exchangeRateId',
  zValidator('param', paramSchema),
  async c => {
    const { exchangeRateId } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.exchangeRateId, exchangeRateId))
      .limit(1);
    if (!item) {
      return notFoundError(c, `ExchangeRate ${exchangeRateId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
