import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { moneyExchangeSchema, issueMoneyExchangeSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = moneyExchangeSchema.pick({ moneyExchangeId: true });

export const issueRoute = new Hono().post(
  '/:moneyExchangeId/issue',
  zValidator('param', paramSchema),
  zValidator('json', issueMoneyExchangeSchema),
  async c => {
    const { moneyExchangeId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(moneyExchanges)
      .where(eq(moneyExchanges.moneyExchangeId, moneyExchangeId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `MoneyExchange ${moneyExchangeId} not found`);
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot issue money exchange with status "${existing.status}". Must be "Pending".`
      );
    }

    const [item] = await client
      .update(moneyExchanges)
      .set({ status: 'Issued', issuedAt: data.issuedAt })
      .where(eq(moneyExchanges.moneyExchangeId, moneyExchangeId))
      .returning();

    return c.json(item, StatusCodes.OK);
  }
);
