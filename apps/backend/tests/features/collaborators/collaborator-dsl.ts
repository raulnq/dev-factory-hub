import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddCollaborator,
  EditCollaborator,
  Collaborator,
  ListCollaborators,
} from '#/features/collaborators/schemas.js';

// --- Factory functions ---

export const alice = (
  overrides?: Partial<AddCollaborator>
): AddCollaborator => {
  return {
    name: `Alice ${faker.string.uuid()}`,
    email: faker.internet.email(),
    withholdingPercentage: 10,
    ...overrides,
  };
};

export const bob = (overrides?: Partial<AddCollaborator>): AddCollaborator => {
  return {
    name: `Bob ${faker.string.uuid()}`,
    email: faker.internet.email(),
    withholdingPercentage: 15.5,
    ...overrides,
  };
};

// --- Action functions ---

export async function addCollaborator(
  input: AddCollaborator
): Promise<Collaborator>;
export async function addCollaborator(
  input: AddCollaborator,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addCollaborator(
  input: AddCollaborator,
  expectedProblemDocument?: ProblemDocument
): Promise<Collaborator | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.collaborators.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function getCollaborator(
  collaboratorId: string
): Promise<Collaborator>;
export async function getCollaborator(
  collaboratorId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getCollaborator(
  collaboratorId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Collaborator | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.collaborators[':collaboratorId'].$get({
    param: { collaboratorId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
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

export async function editCollaborator(
  collaboratorId: string,
  input: EditCollaborator
): Promise<Collaborator>;
export async function editCollaborator(
  collaboratorId: string,
  input: EditCollaborator,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editCollaborator(
  collaboratorId: string,
  input: EditCollaborator,
  expectedProblemDocument?: ProblemDocument
): Promise<Collaborator | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.collaborators[':collaboratorId'].$put({
    param: { collaboratorId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
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

export async function listCollaborators(
  query: ListCollaborators
): Promise<Page<Collaborator>>;
export async function listCollaborators(
  query: ListCollaborators,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listCollaborators(
  params: ListCollaborators,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Collaborator> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.collaborators.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      name: params.name,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const page = await response.json();
    assert.ok(page);
    return page;
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

// --- Fluent assertion builder ---

export const assertCollaborator = (item: Collaborator) => {
  return {
    hasName(expected: string) {
      assert.strictEqual(
        item.name,
        expected,
        `Expected name to be ${expected}, got ${item.name}`
      );
      return this;
    },
    hasEmail(expected: string | null) {
      assert.strictEqual(
        item.email,
        expected,
        `Expected email to be ${expected}, got ${item.email}`
      );
      return this;
    },
    hasWithholdingPercentage(expected: number) {
      assert.strictEqual(
        item.withholdingPercentage,
        expected,
        `Expected withholdingPercentage to be ${expected}, got ${item.withholdingPercentage}`
      );
      return this;
    },
    isTheSameOf(expected: Collaborator) {
      return this.hasName(expected.name)
        .hasEmail(expected.email)
        .hasWithholdingPercentage(expected.withholdingPercentage);
    },
  };
};
