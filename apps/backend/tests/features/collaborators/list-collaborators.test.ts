import { test, describe } from 'node:test';
import {
  addCollaborator,
  assertCollaborator,
  listCollaborators,
  alice,
} from './collaborator-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Collaborators Endpoint', () => {
  test('should filter collaborators by name', async () => {
    const item = await addCollaborator(alice());
    const page = await listCollaborators({
      name: item.name,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertCollaborator(page.items[0]).isTheSameOf(item);
  });

  test('should return empty items when no match', async () => {
    const page = await listCollaborators({
      name: 'nonexistent-collaborator-xyz',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });
});
