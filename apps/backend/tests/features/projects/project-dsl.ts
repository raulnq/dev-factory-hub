import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import type { Page } from '#/pagination.js';
import type { ProblemDocument } from 'http-problem-details';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type {
  ListProjectsQuery,
  ProjectWithClient,
} from '#/features/projects/schemas.js';

// ---- Project action functions ----

export async function listAllProjects(
  params: ListProjectsQuery
): Promise<Page<ProjectWithClient>>;
export async function listAllProjects(
  params: ListProjectsQuery,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listAllProjects(
  params: ListProjectsQuery,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<ProjectWithClient> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.projects.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      name: params.name,
      clientId: params.clientId,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const page = await response.json();
    assert.ok(page);
    return page as Page<ProjectWithClient>;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

// ---- Assertion builders ----

export const assertProjectWithClient = (item: ProjectWithClient) => ({
  hasName(expected: string) {
    assert.strictEqual(
      item.name,
      expected,
      `Expected name to be ${expected}, got ${item.name}`
    );
    return this;
  },
  hasClientName(expected: string) {
    assert.strictEqual(
      item.clientName,
      expected,
      `Expected clientName to be ${expected}, got ${item.clientName}`
    );
    return this;
  },
  hasClientId(expected: string) {
    assert.strictEqual(item.clientId, expected);
    return this;
  },
});
