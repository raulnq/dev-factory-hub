import { test, describe } from 'node:test';
import {
  addTimesheet,
  completeTimesheet,
  assertTimesheet,
  weekly,
  createCollaborator,
  createRole,
} from './timesheet-dsl.js';
import { createConflictError } from '../../errors.js';

describe('Complete Timesheet Endpoint', () => {
  test('should complete a pending timesheet', async () => {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );

    const completed = await completeTimesheet(ts.timesheetId);
    assertTimesheet(completed).isCompleted();
  });

  test('should reject already completed timesheet', async () => {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );

    await completeTimesheet(ts.timesheetId);
    await completeTimesheet(
      ts.timesheetId,
      createConflictError('Timesheet is already completed')
    );
  });
});
