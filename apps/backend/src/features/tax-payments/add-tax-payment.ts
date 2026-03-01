import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { taxPayments } from './tax-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addTaxPaymentSchema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addTaxPaymentSchema),
  async c => {
    const data = c.req.valid('json');

    const [item] = await client
      .insert(taxPayments)
      .values({
        ...data,
        taxPaymentId: v7(),
        status: 'Pending',
        total: 0,
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
