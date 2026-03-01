import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { timesheets } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { addTimesheetSchema } from './schemas.js';
import { notFoundError } from '#/extensions.js';
import { collaborators } from '../collaborators/collaborator.js';
import { collaboratorRoles } from '../collaborator-roles/collaborator-role.js';
import { eq } from 'drizzle-orm';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', addTimesheetSchema),
  async c => {
    const data = c.req.valid('json');

    // Validate dependencies first to maintain error priority
    const [existingCollaborator] = await client
      .select()
      .from(collaborators)
      .where(eq(collaborators.collaboratorId, data.collaboratorId))
      .limit(1);

    if (!existingCollaborator) {
      return notFoundError(c, `Collaborator ${data.collaboratorId} not found`);
    }

    const [existingRole] = await client
      .select()
      .from(collaboratorRoles)
      .where(eq(collaboratorRoles.collaboratorRoleId, data.collaboratorRoleId))
      .limit(1);

    if (!existingRole) {
      return notFoundError(
        c,
        `Collaborator Role ${data.collaboratorRoleId} not found`
      );
    }

    const [item] = await client
      .insert(timesheets)
      .values({
        ...data,
        timesheetId: v7(),
        status: 'Pending',
        feeRate: existingRole.feeRate,
        costRate: existingRole.costRate,
        currency: existingRole.currency,
        createdAt: new Date(),
      })
      .returning();

    return c.json(item, StatusCodes.CREATED);
  }
);
