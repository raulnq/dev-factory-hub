import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { proformas } from './proforma.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listProformaSchema } from './schemas.js';
import { projects } from '#/features/clients/project.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listProformaSchema),
  async c => {
    const { pageNumber, pageSize, projectId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (projectId) filters.push(eq(proformas.projectId, projectId));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(proformas)
      .where(and(...filters));

    const items = await client
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
      .innerJoin(projects, eq(proformas.projectId, projects.projectId))
      .where(and(...filters))
      .orderBy(desc(proformas.startDate))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
