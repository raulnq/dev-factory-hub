import { test, describe } from 'node:test';
import {
  addCollection,
  assertCollection,
  cancelCollection,
  confirmCollection,
  confirmCollectionInput,
  createClient,
  collectionInput,
} from './collection-dsl.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Confirm Collection', () => {
  test('should transition Pending to Confirmed and set confirmedAt', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const input = confirmCollectionInput();
    const item = await confirmCollection(created.collectionId, input);

    assertCollection(item)
      .hasStatus('Confirmed')
      .hasConfirmedAt(input.confirmedAt);
  });

  test('should return 409 when collection is not Pending', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    await confirmCollection(created.collectionId, confirmCollectionInput());

    await confirmCollection(
      created.collectionId,
      confirmCollectionInput(),
      createConflictError(
        'Cannot confirm collection with status "Confirmed". Must be in "Pending" status.'
      )
    );
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await confirmCollection(
      nonExistentId,
      confirmCollectionInput(),
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });

  test('should return 422 for missing confirmedAt', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    await confirmCollection(
      created.collectionId,
      { confirmedAt: undefined } as Parameters<typeof confirmCollection>[1],
      createValidationError([validationError.requiredString('confirmedAt')])
    );
  });
});

describe('Cancel Collection', () => {
  test('should cancel a Pending collection and set canceledAt', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const item = await cancelCollection(created.collectionId);

    assertCollection(item).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should cancel a Confirmed collection', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    await confirmCollection(created.collectionId, confirmCollectionInput());

    const item = await cancelCollection(created.collectionId);
    assertCollection(item).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should return 409 when already Canceled', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    await cancelCollection(created.collectionId);

    await cancelCollection(
      created.collectionId,
      createConflictError(
        'Cannot cancel collection with status "Canceled". Already canceled.'
      )
    );
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await cancelCollection(
      nonExistentId,
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });
});
