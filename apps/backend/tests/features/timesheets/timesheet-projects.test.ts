import { test, describe } from 'node:test';
import {
  addTimesheet,
  addProjectToTimesheet,
  listTimesheetProjects,
  deleteTimesheetProject,
  weekly,
  createCollaborator,
  createRole,
  completeTimesheet,
} from './timesheet-dsl.js';
import { addClient, acme, addProject, webApp } from '../clients/client-dsl.js';
import { createConflictError } from '../../errors.js';
import assert from 'node:assert';

describe('Timesheet Projects Endpoint', () => {
  async function setup() {
    const cid = await createCollaborator();
    const rid = await createRole();
    const ts = await addTimesheet(
      weekly({ collaboratorId: cid, collaboratorRoleId: rid })
    );

    const client = await addClient(acme());
    const p = await addProject(client.clientId, webApp());

    return { ts, project: p };
  }

  test('should add project and generate zero-hour worklogs', async () => {
    const { ts, project } = await setup();
    await addProjectToTimesheet(ts.timesheetId, project.projectId);

    const projects = await listTimesheetProjects(ts.timesheetId);
    assert.strictEqual(projects.length, 1);
    assert.strictEqual(projects[0].projectId, project.projectId);
    // 7 days in '2021-01-01' to '2021-01-07'
    assert.strictEqual(projects[0].worklogs.length, 7);
    assert.ok(
      projects[0].worklogs.every((l: { hours: number }) => l.hours === 0)
    );
  });

  test('should reject duplicate project', async () => {
    const { ts, project } = await setup();
    await addProjectToTimesheet(ts.timesheetId, project.projectId);
    await addProjectToTimesheet(
      ts.timesheetId,
      project.projectId,
      createConflictError('Project already added to this timesheet')
    );
  });

  test('should delete project and its worklogs', async () => {
    const { ts, project } = await setup();
    await addProjectToTimesheet(ts.timesheetId, project.projectId);
    await deleteTimesheetProject(ts.timesheetId, project.projectId);

    const projects = await listTimesheetProjects(ts.timesheetId);
    assert.strictEqual(projects.length, 0);
  });

  test('should reject modifications on completed timesheet', async () => {
    const { ts, project } = await setup();
    await completeTimesheet(ts.timesheetId);

    await addProjectToTimesheet(
      ts.timesheetId,
      project.projectId,
      createConflictError('Cannot add projects to a completed timesheet')
    );

    await deleteTimesheetProject(
      ts.timesheetId,
      project.projectId,
      createConflictError('Cannot remove projects from a completed timesheet')
    );
  });
});
