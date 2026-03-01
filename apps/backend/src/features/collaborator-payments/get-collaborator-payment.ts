import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collaboratorPaymentSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { collaborators } from '#/features/collaborators/collaborator.js';

const paramSchema = collaboratorPaymentSchema.pick({
  collaboratorPaymentId: true,
});

export const getRoute = new Hono().get(
  '/:collaboratorPaymentId',
  zValidator('param', paramSchema),
  async c => {
    const { collaboratorPaymentId } = c.req.valid('param');
    const [item] = await getCollaboratorPaymentWithRelations()
      .where(
        eq(collaboratorPayments.collaboratorPaymentId, collaboratorPaymentId)
      )
      .limit(1);

    if (!item) {
      return notFoundError(
        c,
        `CollaboratorPayment ${collaboratorPaymentId} not found`
      );
    }
    return c.json(item, StatusCodes.OK);
  }
);

export function getCollaboratorPaymentWithRelations() {
  return client
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
    );
}
