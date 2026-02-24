import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  acme,
  addClient,
  johnDoe,
  addContact,
  deleteContact,
  listContacts,
} from './client-dsl.js';
import { createNotFoundError } from '../../errors.js';

describe('Delete Contact Endpoint', () => {
  test('should delete an existing contact', async () => {
    const clientItem = await addClient(acme());
    const contact = await addContact(clientItem.clientId, johnDoe());
    await deleteContact(clientItem.clientId, contact.contactId);
    const page = await listContacts(clientItem.clientId);
    assert.strictEqual(page.totalCount, 0);
  });

  test('should return 404 for non-existent contact', async () => {
    const clientItem = await addClient(acme());
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await deleteContact(
      clientItem.clientId,
      nonExistentId,
      createNotFoundError(`Contact ${nonExistentId} not found`)
    );
  });
});
