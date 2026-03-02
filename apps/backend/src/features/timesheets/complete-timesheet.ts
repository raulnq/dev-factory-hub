import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { timesheets } from './timesheet.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { timesheetSchema, completeTimesheetSchema } from './schemas.js';
import { notFoundError, conflictError } from '#/extensions.js';
import { getTimesheetWithRelations } from './get-timesheet.js';

const paramSchema = timesheetSchema.pick({ timesheetId: true });

export const completeRoute = new Hono().post(
  '/:timesheetId/complete',
  zValidator('param', paramSchema),
  zValidator('json', completeTimesheetSchema),
  async c => {
    const { timesheetId } = c.req.valid('param');
    const { completedAt } = c.req.valid('json');

    const [timesheet] = await client
      .select()
      .from(timesheets)
      .where(eq(timesheets.timesheetId, timesheetId))
      .limit(1);

    if (!timesheet) {
      return notFoundError(c, `Timesheet ${timesheetId} not found`);
    }

    if (timesheet.status === 'Completed') {
      return conflictError(c, 'Timesheet is already completed');
    }

    await client
      .update(timesheets)
      .set({
        status: 'Completed',
        completedAt,
      })
      .where(eq(timesheets.timesheetId, timesheetId));

    const [item] = await getTimesheetWithRelations()
      .where(eq(timesheets.timesheetId, timesheetId))
      .limit(1);

    return c.json(item, StatusCodes.OK);
  }
);
