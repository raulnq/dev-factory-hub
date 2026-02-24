import { describe, test } from 'node:test';
import {
  acme,
  addClient,
  webApp,
  mobileApp,
  addProject,
  editProject,
  assertProject,
} from './client-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Edit Project Endpoint', () => {
  test('should update a project name', async () => {
    const clientItem = await addClient(acme());
    const project = await addProject(clientItem.clientId, webApp());
    const newInput = mobileApp();
    const updated = await editProject(
      clientItem.clientId,
      project.projectId,
      newInput
    );
    assertProject(updated).hasName(newInput.name);
  });

  test('should return 404 for non-existent project', async () => {
    const clientItem = await addClient(acme());
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editProject(
      clientItem.clientId,
      nonExistentId,
      webApp(),
      createNotFoundError(`Project ${nonExistentId} not found`)
    );
  });

  test('should reject invalid project UUID format', async () => {
    const clientItem = await addClient(acme());
    await editProject(
      clientItem.clientId,
      'invalid-uuid',
      webApp(),
      createValidationError([validationError.invalidUuid('projectId')])
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
        const project = await addProject(clientItem.clientId, webApp());
        await editProject(
          clientItem.clientId,
          project.projectId,
          input,
          expectedError
        );
      });
    }
  });
});
