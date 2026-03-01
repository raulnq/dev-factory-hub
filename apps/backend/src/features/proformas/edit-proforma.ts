import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { editProformaSchema, proformaSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getProformaWithRelations } from './get-proforma.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const editRoute = new Hono().put(
  '/:proformaId',
  zValidator('param', paramSchema),
  zValidator('json', editProformaSchema),
  async c => {
    const { proformaId } = c.req.valid('param');
    const { expenses, discount, taxes, notes } = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    const subtotal = Number(existing.subtotal);
    const total = subtotal + expenses - discount + taxes;

    await client
      .update(proformas)
      .set({ expenses, discount, taxes, notes, total })
      .where(eq(proformas.proformaId, proformaId));

    const [item] = await getProformaWithRelations()
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
