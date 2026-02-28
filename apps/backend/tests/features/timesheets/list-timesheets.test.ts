import { describe, it } from 'node:test';
import { addTimesheet, listTimesheets, weekly } from './timesheet-dsl.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';
import {
  addCollaboratorRole,
  junior,
} from '../collaborator-roles/collaborator-role-dsl.js';
import assert from 'node:assert';
import { faker } from '@faker-js/faker';

describe('List Timesheets Endpoint', () => {
  it('should list timesheets with collaborator and role names', async () => {
    // Given
    const collName = `Collab ${faker.string.uuid()}`;
    const roleName = `Role ${faker.string.uuid()}`;

    const collaborator = await addCollaborator(alice({ name: collName }));
    const role = await addCollaboratorRole(junior({ name: roleName }));

    const ts = await addTimesheet(
      weekly({
        collaboratorId: collaborator.collaboratorId,
        collaboratorRoleId: role.collaboratorRoleId,
      })
    );

    // When
    const page = await listTimesheets({
      pageNumber: 1,
      pageSize: 10,
      collaboratorId: collaborator.collaboratorId,
    });

    // Then
    const found = page.items.find(item => item.timesheetId === ts.timesheetId);
    assert.ok(found, 'Timesheet not found in list');
    assert.strictEqual(found.collaboratorName, collName);
    assert.strictEqual(found.collaboratorRoleName, roleName);
  });
});
