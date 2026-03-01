import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  collaboratorPaymentSchema,
  payCollaboratorPaymentSchema,
} from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollaboratorPaymentWithRelations } from './get-collaborator-payment.js';

const paramSchema = collaboratorPaymentSchema.pick({
  collaboratorPaymentId: true,
});

export const payRoute = new Hono().post(
  '/:collaboratorPaymentId/pay',
  zValidator('param', paramSchema),
  zValidator('json', payCollaboratorPaymentSchema),
  async c => {
    const { collaboratorPaymentId } = c.req.valid('param');
    const { paidAt } = c.req.valid('json');

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

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot pay collaborator payment with status "${existing.status}". Must be "Pending".`
      );
    }

    await client
      .update(collaboratorPayments)
      .set({ status: 'Paid', paidAt })
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
