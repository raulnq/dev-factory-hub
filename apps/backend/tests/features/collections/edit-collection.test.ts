import { test, describe } from 'node:test';
import {
  addCollection,
  assertCollection,
  createClient,
  collectionInput,
  editCollection,
  editCollectionInput,
} from './collection-dsl.js';
import { createNotFoundError, createValidationError } from '../../errors.js';
import { v7 } from 'uuid';

describe('Edit Collection Endpoint', () => {
  test('should update currency, total, commission, and taxes', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const input = editCollectionInput();
    const item = await editCollection(created.collectionId, input);

    assertCollection(item)
      .hasCurrency('EUR')
      .hasTotal(2000)
      .hasCommission(200)
      .hasTaxes(100)
      .hasClientName(client.name);
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await editCollection(
      nonExistentId,
      editCollectionInput(),
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject negative total',
        input: editCollectionInput({ total: -1 }),
        expectedError: createValidationError([
          {
            path: 'total',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject negative commission',
        input: editCollectionInput({ commission: -1 }),
        expectedError: createValidationError([
          {
            path: 'commission',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject negative taxes',
        input: editCollectionInput({ taxes: -1 }),
        expectedError: createValidationError([
          {
            path: 'taxes',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const client = await createClient();
        const created = await addCollection(collectionInput(client.clientId));
        await editCollection(created.collectionId, input, expectedError);
      });
    }
  });
});
