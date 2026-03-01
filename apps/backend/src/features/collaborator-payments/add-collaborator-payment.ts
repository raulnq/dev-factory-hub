import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addCollaboratorPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { eq } from 'drizzle-orm';
import { getCollaboratorPaymentWithRelations } from './get-collaborator-payment.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addCollaboratorPaymentSchema),
  async c => {
    const data = c.req.valid('json');

    const [collaborator] = await client
      .select()
      .from(collaborators)
      .where(eq(collaborators.collaboratorId, data.collaboratorId))
      .limit(1);

    if (!collaborator) {
      return notFoundError(c, `Collaborator ${data.collaboratorId} not found`);
    }

    const withholding =
      Math.round(
        data.grossSalary *
          (Number(collaborator.withholdingPercentage) / 100) *
          100
      ) / 100;
    const netSalary = Math.round((data.grossSalary - withholding) * 100) / 100;

    const [inserted] = await client
      .insert(collaboratorPayments)
      .values({
        ...data,
        collaboratorPaymentId: v7(),
        withholding,
        netSalary,
        status: 'Pending',
      })
      .returning();

    const [item] = await getCollaboratorPaymentWithRelations()
      .where(
        eq(
          collaboratorPayments.collaboratorPaymentId,
          inserted.collaboratorPaymentId
        )
      )
      .limit(1);

    return c.json(item, StatusCodes.CREATED);
  }
);
