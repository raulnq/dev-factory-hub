import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { zValidator } from '#/validator.js';
import { addCollaboratorChargeSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { getCollaboratorChargeWithRelations } from './get-collaborator-charge.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addCollaboratorChargeSchema),
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

    const [inserted] = await client
      .insert(collaboratorCharges)
      .values({
        ...data,
        collaboratorChargeId: v7(),
        status: 'Pending',
      })
      .returning();

    const [item] = await getCollaboratorChargeWithRelations()
      .where(
        eq(
          collaboratorCharges.collaboratorChargeId,
          inserted.collaboratorChargeId
        )
      )
      .limit(1);

    return c.json(item, StatusCodes.CREATED);
  }
);
