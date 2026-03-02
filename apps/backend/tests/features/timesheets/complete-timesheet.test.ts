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

    const completed = await completeTimesheet(ts.timesheetId, {
      completedAt: '2025-06-15',
    });
    assertTimesheet(completed).isCompleted().hasCompletedAt('2025-06-15');
  });

  test('should store the provided completedAt date', async () => {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );

    const completed = await completeTimesheet(ts.timesheetId, {
      completedAt: '2024-03-01',
    });
    assertTimesheet(completed).hasCompletedAt('2024-03-01');
  });

  test('should reject already completed timesheet', async () => {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );

    await completeTimesheet(ts.timesheetId, { completedAt: '2025-06-15' });
    await completeTimesheet(
      ts.timesheetId,
      { completedAt: '2025-06-15' },
      createConflictError('Timesheet is already completed')
    );
  });
});
