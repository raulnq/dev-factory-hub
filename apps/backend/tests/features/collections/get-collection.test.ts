import { test, describe } from 'node:test';
import {
  addCollection,
  assertCollection,
  createClient,
  collectionInput,
  getCollection,
} from './collection-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Get Collection Endpoint', () => {
  test('should return collection with clientName', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const item = await getCollection(created.collectionId);

    assertCollection(item)
      .hasStatus('Pending')
      .hasCurrency('USD')
      .hasClientName(client.name);
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await getCollection(
      nonExistentId,
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });

  test('should return 422 for invalid UUID param', async () => {
    await getCollection(
      'not-a-uuid' as string,
      createValidationError([validationError.invalidUuid('collectionId')])
    );
  });
});
