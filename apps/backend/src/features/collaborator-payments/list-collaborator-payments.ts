import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, count, SQL, and, desc } from 'drizzle-orm';
import { listCollaboratorPaymentsSchema } from './schemas.js';
import { collaborators } from '#/features/collaborators/collaborator.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', listCollaboratorPaymentsSchema),
  async c => {
    const { pageNumber, pageSize, collaboratorId } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (collaboratorId) {
      filters.push(eq(collaboratorPayments.collaboratorId, collaboratorId));
    }

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(collaboratorPayments)
      .where(and(...filters));

    const items = await client
      .select({
        collaboratorPaymentId: collaboratorPayments.collaboratorPaymentId,
        collaboratorId: collaboratorPayments.collaboratorId,
        collaboratorName: collaborators.name,
        currency: collaboratorPayments.currency,
        grossSalary: collaboratorPayments.grossSalary,
        withholding: collaboratorPayments.withholding,
        netSalary: collaboratorPayments.netSalary,
        status: collaboratorPayments.status,
        paidAt: collaboratorPayments.paidAt,
        confirmedAt: collaboratorPayments.confirmedAt,
        canceledAt: collaboratorPayments.canceledAt,
        createdAt: collaboratorPayments.createdAt,
        number: collaboratorPayments.number,
      })
      .from(collaboratorPayments)
      .innerJoin(
        collaborators,
        eq(collaboratorPayments.collaboratorId, collaborators.collaboratorId)
      )
      .where(and(...filters))
      .orderBy(desc(collaboratorPayments.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
