import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { proformaSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { projects } from '#/features/clients/project.js';

const schema = proformaSchema.pick({ proformaId: true });

export const getRoute = new Hono().get(
  '/:proformaId',
  zValidator('param', schema),
  async c => {
    const { proformaId } = c.req.valid('param');
    const [item] = await getProformaWithRelations()
      .where(eq(proformas.proformaId, proformaId))
      .limit(1);

    if (!item) {
      return notFoundError(c, `Proforma ${proformaId} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getProformaWithRelations() {
  return client
    .select({
      proformaId: proformas.proformaId,
      projectId: proformas.projectId,
      projectName: projects.name,
      currency: proformas.currency,
      startDate: proformas.startDate,
      endDate: proformas.endDate,
      number: proformas.number,
      status: proformas.status,
      total: proformas.total,
      subtotal: proformas.subtotal,
      expenses: proformas.expenses,
      discount: proformas.discount,
      taxes: proformas.taxes,
      createdAt: proformas.createdAt,
      issuedAt: proformas.issuedAt,
      cancelledAt: proformas.cancelledAt,
      notes: proformas.notes,
    })
    .from(proformas)
    .innerJoin(projects, eq(proformas.projectId, projects.projectId));
}
