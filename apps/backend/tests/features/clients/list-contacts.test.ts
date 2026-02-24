import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  acme,
  addClient,
  johnDoe,
  janeDoe,
  addContact,
  listContacts,
  assertContact,
} from './client-dsl.js';
import { assertPage } from '../../assertions.js';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import { StatusCodes } from 'http-status-codes';

describe('List Contacts Endpoint', () => {
  test('should return paginated contacts for a client', async () => {
    const clientItem = await addClient(acme());
    const contact1 = await addContact(clientItem.clientId, johnDoe());
    const contact2 = await addContact(clientItem.clientId, janeDoe());

    const page = await listContacts(clientItem.clientId, {
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(2);
    const contactIds = page.items.map(c => c.contactId);
    assert.ok(contactIds.includes(contact1.contactId));
    assert.ok(contactIds.includes(contact2.contactId));
  });

  test('should return empty result for client with no contacts', async () => {
    const clientItem = await addClient(acme());
    const page = await listContacts(clientItem.clientId);
    assertPage(page).hasEmptyResult();
  });

  test('should return 404 for non-existent client', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    const hono = testClient(app);
    const response = await hono.api.clients[':clientId'].contacts.$get({
      param: { clientId: nonExistentId },
      query: {},
    });
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });

  test('should only return contacts belonging to the specified client', async () => {
    const client1 = await addClient(acme());
    const client2 = await addClient(acme());
    const contact1 = await addContact(client1.clientId, johnDoe());
    await addContact(client2.clientId, janeDoe());

    const page = await listContacts(client1.clientId);
    assertPage(page).hasItemsCount(1);
    assertContact(page.items[0]).isTheSameOf(contact1);
  });
});
