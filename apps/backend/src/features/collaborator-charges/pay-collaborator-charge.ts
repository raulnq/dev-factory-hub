import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { zValidator } from '#/validator.js';
import {
  collaboratorChargeSchema,
  payCollaboratorChargeSchema,
} from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollaboratorChargeWithRelations } from './get-collaborator-charge.js';

const paramSchema = collaboratorChargeSchema.pick({
  collaboratorChargeId: true,
});

export const payRoute = new Hono().post(
  '/:collaboratorChargeId/pay',
  zValidator('param', paramSchema),
  zValidator('json', payCollaboratorChargeSchema),
  async c => {
    const { collaboratorChargeId } = c.req.valid('param');
    const { issuedAt } = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(collaboratorCharges)
      .where(eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId))
      .limit(1);

    if (!existing) {
      return notFoundError(
        c,
        `CollaboratorCharge ${collaboratorChargeId} not found`
      );
    }

    if (existing.status !== 'Pending') {
      return conflictError(
        c,
        `Cannot issue collaborator charge with status "${existing.status}". Must be "Pending".`
      );
    }

    await client
      .update(collaboratorCharges)
      .set({ status: 'Issued', issuedAt })
      .where(
        eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId)
      );

    const [item] = await getCollaboratorChargeWithRelations()
      .where(eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
