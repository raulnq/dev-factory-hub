import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { zValidator } from '#/validator.js';
import { editCollaboratorChargeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getCollaboratorChargeWithRelations } from './get-collaborator-charge.js';

export const editRoute = new Hono().patch(
  '/:collaboratorChargeId',
  zValidator('json', editCollaboratorChargeSchema),
  async c => {
    const collaboratorChargeId = c.req.param('collaboratorChargeId');
    const data = c.req.valid('json');

    const [existing] = await client
      .select()
      .from(collaboratorCharges)
      .where(eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId))
      .limit(1);

    if (!existing) {
      return notFoundError(
        c,
        `Collaborator Charge ${collaboratorChargeId} not found`
      );
    }

    await client
      .update(collaboratorCharges)
      .set(data)
      .where(
        eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId)
      );

    const [item] = await getCollaboratorChargeWithRelations()
      .where(eq(collaboratorCharges.collaboratorChargeId, collaboratorChargeId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
