import { test, describe } from 'node:test';
import {
  addTimesheet,
  addProjectToTimesheet,
  listTimesheetProjects,
  editWorklog,
  weekly,
  createCollaborator,
  createRole,
  completeTimesheet,
} from './timesheet-dsl.js';
import { addClient, acme, addProject, webApp } from '../clients/client-dsl.js';
import { createConflictError, createValidationError } from '../../errors.js';
import assert from 'node:assert';

describe('Worklogs Endpoint', () => {
  async function setup() {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );
    const client = await addClient(acme());
    const p = await addProject(client.clientId, webApp());
    await addProjectToTimesheet(ts.timesheetId, p.projectId);
    return { ts, project: p };
  }

  test('should update worklog hours', async () => {
    const { ts, project } = await setup();
    const date = '2021-01-01';
    await editWorklog(ts.timesheetId, project.projectId, date, { hours: 8.5 });

    const projects = await listTimesheetProjects(ts.timesheetId);
    const log = projects[0].worklogs.find(
      (l: { date: string }) => l.date === date
    );
    assert.strictEqual(log?.hours, 8.5);
  });

  test('should reject negative hours', async () => {
    const { ts, project } = await setup();
    await editWorklog(
      ts.timesheetId,
      project.projectId,
      '2021-01-01',
      { hours: -1 },
      createValidationError([
        {
          path: 'hours',
          message: 'Too small: expected number to be >=0',
          code: 'too_small',
        },
      ])
    );
  });

  test('should reject update on completed timesheet', async () => {
    const { ts, project } = await setup();
    await completeTimesheet(ts.timesheetId);
    await editWorklog(
      ts.timesheetId,
      project.projectId,
      '2021-01-01',
      { hours: 5 },
      createConflictError('Cannot edit worklogs of a completed timesheet')
    );
  });
});
