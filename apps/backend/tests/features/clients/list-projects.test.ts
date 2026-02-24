import { describe, test } from 'node:test';
import {
  acme,
  addClient,
  webApp,
  mobileApp,
  addProject,
  listProjects,
  assertProject,
} from './client-dsl.js';
import { assertPage } from '../../assertions.js';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';

describe('List Projects Endpoint', () => {
  test('should return paginated projects for a client', async () => {
    const clientItem = await addClient(acme());
    const project1 = await addProject(clientItem.clientId, webApp());
    const project2 = await addProject(clientItem.clientId, mobileApp());

    const page = await listProjects(clientItem.clientId, {
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCountAtLeast(2);
    const projectIds = page.items.map(p => p.projectId);
    assert.ok(projectIds.includes(project1.projectId));
    assert.ok(projectIds.includes(project2.projectId));
  });

  test('should return empty result for client with no projects', async () => {
    const clientItem = await addClient(acme());
    const page = await listProjects(clientItem.clientId);
    assertPage(page).hasEmptyResult();
  });

  test('should return 404 for non-existent client', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    const hono = testClient(app);
    const response = await hono.api.clients[':clientId'].projects.$get({
      param: { clientId: nonExistentId },
      query: {},
    });
    assert.strictEqual(response.status, StatusCodes.NOT_FOUND);
  });

  test('should only return projects belonging to the specified client', async () => {
    const client1 = await addClient(acme());
    const client2 = await addClient(acme());
    const project1 = await addProject(client1.clientId, webApp());
    await addProject(client2.clientId, mobileApp());

    const page = await listProjects(client1.clientId);
    assertPage(page).hasItemsCount(1);
    assertProject(page.items[0]).isTheSameOf(project1);
  });
});
