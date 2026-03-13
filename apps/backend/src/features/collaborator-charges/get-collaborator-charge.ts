import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { eq } from 'drizzle-orm';
import { client } from '#/database/client.js';
import { collaboratorCharges } from './collaborator-charge.js';
import { collaborators } from '#/features/collaborators/collaborator.js';
import { notFoundError } from '#/extensions.js';

export const getCollaboratorChargeWithRelations = () =>
  client
    .select({
      collaboratorChargeId: collaboratorCharges.collaboratorChargeId,
      collaboratorId: collaboratorCharges.collaboratorId,
      collaboratorName: collaborators.name,
      description: collaboratorCharges.description,
      amount: collaboratorCharges.amount,
      currency: collaboratorCharges.currency,
      status: collaboratorCharges.status,
      issuedAt: collaboratorCharges.issuedAt,
      canceledAt: collaboratorCharges.canceledAt,
      createdAt: collaboratorCharges.createdAt,
    })
    .from(collaboratorCharges)
    .innerJoin(
      collaborators,
      eq(collaboratorCharges.collaboratorId, collaborators.collaboratorId)
    );

export const getRoute = new Hono().get('/:id', async c => {
  const id = c.req.param('id');

  const [item] = await getCollaboratorChargeWithRelations()
    .where(eq(collaboratorCharges.collaboratorChargeId, id))
    .limit(1);

  if (!item) {
    return notFoundError(c, `Collaborator Charge ${id} not found`);
  }

  return c.json(item, StatusCodes.OK);
});
