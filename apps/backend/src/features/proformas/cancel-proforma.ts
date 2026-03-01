import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { proformaSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getProformaWithRelations } from './get-proforma.js';

const paramSchema = proformaSchema.pick({ proformaId: true });

export const cancelRoute = new Hono().post(
  '/:proformaId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { proformaId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(proformas)
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!existing) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }

    if (existing.status !== 'Pending' && existing.status !== 'Issued') {
      return conflictError(
        c,
        `Cannot cancel proforma with status "${existing.status}". Must be "Pending" or "Issued".`
      );
    }

    await client
      .update(proformas)
      .set({
        status: 'Canceled',
        cancelledAt: new Date(),
      })
      .where(eq(proformas.proformaId, proformaId));

    const [item] = await getProformaWithRelations()
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
