import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addCollection,
  createClient,
  collectionInput,
  listCollections,
} from './collection-dsl.js';

describe('List Collections Endpoint', () => {
  test('should return paginated list', async () => {
    const client = await createClient();
    await addCollection(collectionInput(client.clientId));

    const page = await listCollections({ pageNumber: 1, pageSize: 10 });

    assert.ok(page.items.length >= 1);
    assert.ok(typeof page.totalCount === 'number');
    assert.ok(typeof page.pageNumber === 'number');
    assert.ok(typeof page.pageSize === 'number');
  });

  test('should filter by clientId', async () => {
    const client = await createClient();
    await addCollection(collectionInput(client.clientId));
    await addCollection(collectionInput(client.clientId));

    const otherClient = await createClient();
    await addCollection(collectionInput(otherClient.clientId));

    const page = await listCollections({
      pageNumber: 1,
      pageSize: 10,
      clientId: client.clientId,
    });

    assert.ok(page.items.length >= 2);
    for (const item of page.items) {
      assert.strictEqual(item.clientId, client.clientId);
    }
  });

  test('should return empty list when no matching collections', async () => {
    const client = await createClient();

    const page = await listCollections({
      pageNumber: 1,
      pageSize: 10,
      clientId: client.clientId,
    });

    assert.strictEqual(page.items.length, 0);
  });

  test('should return collections ordered by createdAt descending', async () => {
    const client = await createClient();
    const first = await addCollection(
      collectionInput(client.clientId, { total: 100 })
    );
    const second = await addCollection(
      collectionInput(client.clientId, { total: 200 })
    );
    const third = await addCollection(
      collectionInput(client.clientId, { total: 300 })
    );

    const page = await listCollections({
      pageNumber: 1,
      pageSize: 10,
      clientId: client.clientId,
    });

    const ids = page.items.map(i => i.collectionId);
    assert.ok(
      ids.indexOf(third.collectionId) < ids.indexOf(second.collectionId)
    );
    assert.ok(
      ids.indexOf(second.collectionId) < ids.indexOf(first.collectionId)
    );
  });
});
