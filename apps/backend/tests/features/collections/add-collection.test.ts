import { test, describe } from 'node:test';
import {
  addCollection,
  assertCollection,
  createClient,
  collectionInput,
} from './collection-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Add Collection Endpoint', () => {
  test('should create a collection with Pending status', async () => {
    const client = await createClient();
    const input = collectionInput(client.clientId);
    const item = await addCollection(input);

    assertCollection(item)
      .hasStatus('Pending')
      .hasCurrency('USD')
      .hasTotal(1000)
      .hasCommission(100)
      .hasTaxes(50)
      .hasConfirmedAt(null)
      .hasCanceledAt(false)
      .hasClientName(client.name);
  });

  test('should return 404 when client does not exist', async () => {
    const unknownClientId = v7();
    await addCollection(
      collectionInput(unknownClientId),
      createNotFoundError(`Client ${unknownClientId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing clientId',
        input: {
          clientId: undefined,
          currency: 'USD',
          total: 100,
          commission: 10,
          taxes: 5,
        },
        expectedError: createValidationError([
          validationError.requiredString('clientId'),
        ]),
      },
      {
        name: 'should reject invalid clientId',
        input: {
          clientId: 'not-a-uuid',
          currency: 'USD',
          total: 100,
          commission: 10,
          taxes: 5,
        },
        expectedError: createValidationError([
          validationError.invalidUuid('clientId'),
        ]),
      },
      {
        name: 'should reject negative total',
        input: {
          clientId: v7(),
          currency: 'USD',
          total: -1,
          commission: 10,
          taxes: 5,
        },
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
        input: {
          clientId: v7(),
          currency: 'USD',
          total: 100,
          commission: -1,
          taxes: 5,
        },
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
        input: {
          clientId: v7(),
          currency: 'USD',
          total: 100,
          commission: 10,
          taxes: -1,
        },
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
        await addCollection(
          input as Parameters<typeof addCollection>[0],
          expectedError
        );
      });
    }
  });
});
