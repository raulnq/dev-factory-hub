import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { collaboratorPayments } from './collaborator-payment.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import {
  editCollaboratorPaymentSchema,
  collaboratorPaymentSchema,
} from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getCollaboratorPaymentWithRelations } from './get-collaborator-payment.js';

const paramSchema = collaboratorPaymentSchema.pick({
  collaboratorPaymentId: true,
});

export const editRoute = new Hono().put(
  '/:collaboratorPaymentId',
  zValidator('param', paramSchema),
  zValidator('json', editCollaboratorPaymentSchema),
  async c => {
    const { collaboratorPaymentId } = c.req.valid('param');
    const { currency, grossSalary, withholding } = c.req.valid('json');

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

    const netSalary = Math.round((grossSalary - withholding) * 100) / 100;

    await client
      .update(collaboratorPayments)
      .set({ currency, grossSalary, withholding, netSalary })
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
