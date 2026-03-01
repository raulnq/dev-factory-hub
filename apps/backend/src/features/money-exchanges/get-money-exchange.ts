import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { moneyExchangeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = moneyExchangeSchema.pick({ moneyExchangeId: true });

export const getRoute = new Hono().get(
  '/:moneyExchangeId',
  zValidator('param', paramSchema),
  async c => {
    const { moneyExchangeId } = c.req.valid('param');

    const [item] = await client
      .select()
      .from(moneyExchanges)
      .where(eq(moneyExchanges.moneyExchangeId, moneyExchangeId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `MoneyExchange ${moneyExchangeId} not found`);
    }

    return c.json(item, StatusCodes.OK);
  }
);
