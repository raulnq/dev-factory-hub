import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  collaboratorPaymentSchema,
  confirmCollaboratorPaymentSchema,
} from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollaboratorPaymentWithRelations } from './get-collaborator-payment.js';

const paramSchema = collaboratorPaymentSchema.pick({
  collaboratorPaymentId: true,
});

export const confirmRoute = new Hono().post(
  '/:collaboratorPaymentId/confirm',
  zValidator('param', paramSchema),
  zValidator('json', confirmCollaboratorPaymentSchema),
  async c => {
    const { collaboratorPaymentId } = c.req.valid('param');
    const { confirmedAt, number } = c.req.valid('json');

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

    if (existing.status !== 'Paid') {
      return conflictError(
        c,
        `Cannot confirm collaborator payment with status "${existing.status}". Must be "Paid".`
      );
    }

    await client
      .update(collaboratorPayments)
      .set({ status: 'Confirmed', confirmedAt, number })
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
