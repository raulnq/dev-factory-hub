import { test, describe } from 'node:test';
import {
  addCollection,
  createClient,
  collectionInput,
  getCollectionDownloadUrl,
} from './collection-dsl.js';
import { createNotFoundError } from '../../errors.js';
import { v7 } from 'uuid';

describe('Get Collection Download URL Endpoint', () => {
  test('should return 404 when collection has no file', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));

    await getCollectionDownloadUrl(
      created.collectionId,
      createNotFoundError(`Collection ${created.collectionId} has no file`)
    );
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await getCollectionDownloadUrl(
      nonExistentId,
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });
});
