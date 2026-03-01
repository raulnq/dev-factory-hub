import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { collaboratorPaymentSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollaboratorPaymentWithRelations } from './get-collaborator-payment.js';

const paramSchema = collaboratorPaymentSchema.pick({
  collaboratorPaymentId: true,
});

export const cancelRoute = new Hono().post(
  '/:collaboratorPaymentId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { collaboratorPaymentId } = c.req.valid('param');

    const [existing] = await client
      .select()
      .from(collaboratorPayments)
      .where(
        eq(collaboratorPayments.collaboratorPaymentId, collaboratorPaymentId)
      )
      .limit(1);

    if (!existing) {
      return notFoundError(
        c,
        `CollaboratorPayment ${collaboratorPaymentId} not found`
      );
    }

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel collaborator payment with status "${existing.status}". Already canceled.`
      );
    }

    await client
      .update(collaboratorPayments)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(
        eq(collaboratorPayments.collaboratorPaymentId, collaboratorPaymentId)
      );

    const [item] = await getCollaboratorPaymentWithRelations()
      .where(
        eq(collaboratorPayments.collaboratorPaymentId, collaboratorPaymentId)
      )
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
