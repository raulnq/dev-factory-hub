import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { proformaItems, proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addProformaItemSchema, proformaSchema } from './schemas.js';
import { eq } from 'drizzle-orm';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const addItemRoute = new Hono().post(
  '/:proformaId/items',
  zValidator('param', paramSchema),
  zValidator('json', addProformaItemSchema),
  async c => {
    const { proformaId } = c.req.valid('param');
    const data = c.req.valid('json');

    const [proforma] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!proforma) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    if (proforma.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot add items to proforma with status. Must be "Pending".`
      );
    }

    const result = await client.transaction(async tx => {
      const [item] = await tx
        .insert(proformaItems)
        .values({
          ...data,
          proformaItemId: v7(),
          proformaId,
        })
        .returning();

      const subtotal = Number(proforma.subtotal) + data.amount;
      const total =
        subtotal +
        Number(proforma.expenses) -
        Number(proforma.discount) +
        Number(proforma.taxes);

      await tx
        .update(proformas)
        .set({ subtotal, total })
        .where(eq(proformas.proformaId, proformaId));

      return item;
    });

    return c.json(result, StatusCodes.CREATED);
  }
);
