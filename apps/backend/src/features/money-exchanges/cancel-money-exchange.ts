import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { moneyExchangeSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = moneyExchangeSchema.pick({ moneyExchangeId: true });

export const cancelRoute = new Hono().post(
  '/:moneyExchangeId/cancel',
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

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel money exchange with status "Canceled". Already canceled.`
      );
    }

    const [item] = await client
      .update(moneyExchanges)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(eq(moneyExchanges.moneyExchangeId, moneyExchangeId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
