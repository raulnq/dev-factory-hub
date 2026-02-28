import { describe, it } from 'node:test';
import {
  acme,
  addClient,
  addProject,
  webApp,
  mobileApp,
  techCorp,
} from '../clients/client-dsl.js';
import { listAllProjects, assertProjectWithClient } from './project-dsl.js';
import assert from 'node:assert';
import { faker } from '@faker-js/faker';

describe('List projects', () => {
  it('should list all projects across all clients with their client names', async () => {
    const client1 = await addClient(acme());
    const client2 = await addClient(techCorp());

    const name1 = `Project A ${faker.string.uuid()}`;
    const name2 = `Project B ${faker.string.uuid()}`;

    const project1 = await addProject(
      client1.clientId,
      webApp({ name: name1 })
    );
    const project2 = await addProject(
      client2.clientId,
      mobileApp({ name: name2 })
    );

    const page1 = await listAllProjects({
      pageNumber: 1,
      pageSize: 100,
      name: name1,
    });
    const page2 = await listAllProjects({
      pageNumber: 1,
      pageSize: 100,
      name: name2,
    });

    const found1 = page1.items.find(p => p.projectId === project1.projectId);
    const found2 = page2.items.find(p => p.projectId === project2.projectId);

    assert.ok(found1, `Project ${project1.projectId} not found in page items`);
    assertProjectWithClient(found1)
      .hasName(name1)
      .hasClientName(client1.name)
      .hasClientId(client1.clientId);

    assert.ok(found2, `Project ${project2.projectId} not found in page items`);
    assertProjectWithClient(found2)
      .hasName(name2)
      .hasClientName(client2.name)
      .hasClientId(client2.clientId);
  });

  it('should filter projects by name', async () => {
    const uniqueSuffix = faker.string.uuid();
    const uniqueName = `Unique Search Name ${uniqueSuffix}`;
    const client = await addClient(acme());
    await addProject(client.clientId, webApp({ name: uniqueName }));
    await addProject(client.clientId, webApp({ name: 'Other Project' }));

    const page = await listAllProjects({
      pageNumber: 1,
      pageSize: 10,
      name: uniqueSuffix,
    });

    assert.strictEqual(page.items.length, 1);
    assert.strictEqual(page.items[0].name, uniqueName);
  });

  it('should filter projects by clientId', async () => {
    const client1 = await addClient(acme());
    const client2 = await addClient(techCorp());

    const p1 = await addProject(
      client1.clientId,
      webApp({ name: `P1 ${faker.string.uuid()}` })
    );
    await addProject(
      client2.clientId,
      webApp({ name: `P2 ${faker.string.uuid()}` })
    );

    const page = await listAllProjects({
      pageNumber: 1,
      pageSize: 10,
      clientId: client1.clientId,
    });

    const found = page.items.find(p => p.projectId === p1.projectId);
    assert.ok(found);
    assert.strictEqual(found.clientId, client1.clientId);

    for (const item of page.items) {
      assert.strictEqual(item.clientId, client1.clientId);
    }
  });

  it('should return empty page when no projects match filters', async () => {
    const page = await listAllProjects({
      pageNumber: 1,
      pageSize: 10,
      name: `NonExistent-${faker.string.uuid()}`,
    });

    assert.strictEqual(page.items.length, 0);
    assert.strictEqual(page.totalCount, 0);
  });
});
