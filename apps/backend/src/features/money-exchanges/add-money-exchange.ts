import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { moneyExchanges } from './money-exchange.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addMoneyExchangeSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addMoneyExchangeSchema),
  async c => {
    const data = c.req.valid('json');

    const [item] = await client
      .insert(moneyExchanges)
      .values({
        ...data,
        moneyExchangeId: v7(),
        status: 'Pending',
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
