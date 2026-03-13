import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { zValidator } from '#/validator.js';
import { collaboratorChargeSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getCollaboratorChargeWithRelations } from './get-collaborator-charge.js';

const paramSchema = collaboratorChargeSchema.pick({
  collaboratorChargeId: true,
});

export const cancelRoute = new Hono().post(
  '/:collaboratorChargeId/cancel',
  zValidator('param', paramSchema),
  async c => {
    const { collaboratorChargeId } = c.req.valid('param');

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

    if (existing.status === 'Canceled') {
      return conflictError(
        c,
        `Cannot cancel collaborator charge with status "${existing.status}". Already canceled.`
      );
    }

    await client
      .update(collaboratorCharges)
      .set({ status: 'Canceled', canceledAt: new Date() })
      .where(
        eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId)
      );

    const [item] = await getCollaboratorChargeWithRelations()
      .where(eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
