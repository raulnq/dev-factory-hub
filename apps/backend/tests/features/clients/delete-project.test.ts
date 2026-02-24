import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  acme,
  addClient,
  webApp,
  addProject,
  deleteProject,
  listProjects,
} from './client-dsl.js';
import { createNotFoundError } from '../../errors.js';

describe('Delete Project Endpoint', () => {
  test('should delete an existing project', async () => {
    const clientItem = await addClient(acme());
    const project = await addProject(clientItem.clientId, webApp());
    await deleteProject(clientItem.clientId, project.projectId);
    const page = await listProjects(clientItem.clientId);
    assert.strictEqual(page.totalCount, 0);
  });

  test('should return 404 for non-existent project', async () => {
    const clientItem = await addClient(acme());
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await deleteProject(
      clientItem.clientId,
      nonExistentId,
      createNotFoundError(`Project ${nonExistentId} not found`)
    );
  });
});
