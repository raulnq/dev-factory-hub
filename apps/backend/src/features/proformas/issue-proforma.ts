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

export const issueRoute = new Hono().post(
  '/:proformaId/issue',
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

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot issue proforma with status "${existing.status}". Must be "Pending".`
      );
    }

    if (Number(existing.total) <= 0) {
      return conflictError(
        c,
        `Cannot issue proforma with total "${existing.total}". Must be greater than 0.`
      );
    }

    await client
      .update(proformas)
      .set({
        status: 'Issued',
        issuedAt: new Date(),
      })
      .where(eq(proformas.proformaId, proformaId));

    const [item] = await getProformaWithRelations()
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
