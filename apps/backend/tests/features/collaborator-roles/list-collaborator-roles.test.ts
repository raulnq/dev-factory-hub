import { test, describe } from 'node:test';
import {
  addCollaboratorRole,
  assertCollaboratorRole,
  listCollaboratorRoles,
  junior,
} from './collaborator-role-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Collaborator Roles Endpoint', () => {
  test('should filter collaborator roles by name', async () => {
    const item = await addCollaboratorRole(junior());
    const page = await listCollaboratorRoles({
      name: item.name,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertCollaboratorRole(page.items[0]).isTheSameOf(item);
  });

  test('should return empty items when no match', async () => {
    const page = await listCollaboratorRoles({
      name: 'nonexistent-role-xyz',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });
});
