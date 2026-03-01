import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addProformaSchema } from './schemas.js';
import { count, eq } from 'drizzle-orm';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addProformaSchema),
  async c => {
    const data = c.req.valid('json');

    const yyyymmdd = data.endDate.replace(/-/g, '');

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(proformas)
      .where(eq(proformas.endDate, data.endDate));

    const nextNumber = `${yyyymmdd}-${totalCount + 1}`;

    const [item] = await client
      .insert(proformas)
      .values({
        ...data,
        proformaId: v7(),
        number: nextNumber,
        status: 'Pending',
        subtotal: 0,
        expenses: 0,
        discount: 0,
        taxes: 0,
        total: 0,
      })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
