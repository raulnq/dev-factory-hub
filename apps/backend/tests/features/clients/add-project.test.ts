import { describe, test } from 'node:test';
import {
  acme,
  addClient,
  webApp,
  addProject,
  assertProject,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Add Project Endpoint', () => {
  test('should create a project for an existing client', async () => {
    const clientItem = await addClient(acme());
    const input = webApp();
    const project = await addProject(clientItem.clientId, input);
    assertProject(project).hasName(input.name).hasClientId(clientItem.clientId);
  });

  test('should return 404 when client does not exist', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await addProject(
      nonExistentId,
      webApp(),
      createNotFoundError(`Client ${nonExistentId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty project name',
        input: webApp({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject project name longer than 500 characters',
        input: webApp({ name: bigText(501) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 500),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const clientItem = await addClient(acme());
        await addProject(clientItem.clientId, input, expectedError);
      });
    }
  });
});
