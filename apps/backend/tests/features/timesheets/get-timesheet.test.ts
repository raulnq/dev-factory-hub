import { describe, it } from 'node:test';
import { addTimesheet, assertTimesheet, weekly } from './timesheet-dsl.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';
import {
  addCollaboratorRole,
  junior,
} from '../collaborator-roles/collaborator-role-dsl.js';
import { getTimesheet } from './timesheet-dsl.js';
import assert from 'node:assert';

describe('Get Timesheet Endpoint', () => {
  it('should return a timesheet with collaborator and role names', async () => {
    // Given
    const collaborator = await addCollaborator(
      alice({ name: 'Alice Timesheet' })
    );
    const role = await addCollaboratorRole(
      junior({ name: 'Junior Developer' })
    );

    const timesheet = await addTimesheet(
      weekly({
        collaboratorId: collaborator.collaboratorId,
        collaboratorRoleId: role.collaboratorRoleId,
      })
    );

    // When
    const item = await getTimesheet(timesheet.timesheetId);

    // Then
    assertTimesheet(item)
      .hasCollaboratorName('Alice Timesheet')
      .hasCollaboratorRoleName('Junior Developer');

    assert.strictEqual(item.timesheetId, timesheet.timesheetId);
    assert.strictEqual(item.collaboratorId, collaborator.collaboratorId);
    assert.strictEqual(item.collaboratorRoleId, role.collaboratorRoleId);
  });
});
