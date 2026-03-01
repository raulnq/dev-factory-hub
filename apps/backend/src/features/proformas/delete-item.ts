import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformaItems, proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { proformaItemSchema } from './schemas.js';
import { eq, and } from 'drizzle-orm';
import { notFoundError, conflictError } from '#/extensions.js';

const paramSchema = proformaItemSchema.pick({
  proformaId: true,
  proformaItemId: true,
});

export const deleteItemRoute = new Hono().delete(
  '/:proformaId/items/:proformaItemId',
  zValidator('param', paramSchema),
  async c => {
    const { proformaId, proformaItemId } = c.req.valid('param');

    const [proforma] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!proforma) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    if (proforma.status !== 'Pending') {
      return conflictError(c, 'Proforma must be Pending');
    }

    const [item] = await client
      .select()
      .from(proformaItems)
      .where(
        and(
          eq(proformaItems.proformaItemId, proformaItemId),
          eq(proformaItems.proformaId, proformaId)
        )
      )
      .limit(1);

    if (!item) {
      return notFoundError(c, `Item ${proformaItemId} not found`);
    }

    await client.transaction(async tx => {
      await tx
        .delete(proformaItems)
        .where(eq(proformaItems.proformaItemId, proformaItemId));

      const subtotal = Number(proforma.subtotal) - Number(item.amount);
      const total =
        subtotal +
        Number(proforma.expenses) -
        Number(proforma.discount) +
        Number(proforma.taxes);

      await tx
        .update(proformas)
        .set({ subtotal, total })
        .where(eq(proformas.proformaId, proformaId));
    });

    return c.body(null, StatusCodes.NO_CONTENT);
  }
);
