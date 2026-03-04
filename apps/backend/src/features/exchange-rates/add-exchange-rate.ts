import { client } from '#/database/client.js';
import { zValidator } from '#/validator.js';
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { v7 } from 'uuid';
import { exchangeRates } from './exchange-rate.js';
import { addExchangeRateSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addExchangeRateSchema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(exchangeRates)
      .values({ ...data, exchangeRateId: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
