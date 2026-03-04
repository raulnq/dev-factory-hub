import { client } from '#/database/client.js';
import { notFoundError } from '#/extensions.js';
import { zValidator } from '#/validator.js';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { exchangeRates } from './exchange-rate.js';
import { editExchangeRateSchema, exchangeRateSchema } from './schemas.js';

const paramSchema = exchangeRateSchema.pick({ exchangeRateId: true });

export const editRoute = new Hono().put(
  '/:exchangeRateId',
  zValidator('param', paramSchema),
  zValidator('json', editExchangeRateSchema),
  async c => {
    const { exchangeRateId } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.exchangeRateId, exchangeRateId))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `ExchangeRate ${exchangeRateId} not found`);
    }
    const [item] = await client
      .update(exchangeRates)
      .set(data)
      .where(eq(exchangeRates.exchangeRateId, exchangeRateId))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
