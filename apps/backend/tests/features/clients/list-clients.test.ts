import { describe, test } from 'node:test';
import { acme, addClient, assertClient, listClients } from './client-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Clients Endpoint', () => {
  test('should filter clients by name', async () => {
    const created = await addClient(acme());
    const page = await listClients({
      name: created.name,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertClient(page.items[0]).isTheSameOf(created);
  });

  test('should return empty result when no clients match filter', async () => {
    const page = await listClients({
      name: 'nonexistent-client-xyz-99999',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });
});
