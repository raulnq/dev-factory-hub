import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddCollaboratorRole,
  EditCollaboratorRole,
  CollaboratorRole,
  ListCollaboratorRoles,
} from '#/features/collaborator-roles/schemas.js';

// --- Factory functions ---

export const junior = (
  overrides?: Partial<AddCollaboratorRole>
): AddCollaboratorRole => {
  return {
    name: `Junior Role ${faker.string.uuid()}`,
    currency: 'USD',
    feeRate: 50,
    costRate: 30,
    ...overrides,
  };
};

export const senior = (
  overrides?: Partial<AddCollaboratorRole>
): AddCollaboratorRole => {
  return {
    name: `Senior Role ${faker.string.uuid()}`,
    currency: 'PEN',
    feeRate: 150.5,
    costRate: 100.25,
    ...overrides,
  };
};

// --- Action functions ---

export async function addCollaboratorRole(
  input: AddCollaboratorRole
): Promise<CollaboratorRole>;
export async function addCollaboratorRole(
  input: AddCollaboratorRole,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addCollaboratorRole(
  input: AddCollaboratorRole,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorRole | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['collaborator-roles'].$post({
    json: input,
  });

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

export async function getCollaboratorRole(
  collaboratorRoleId: string
): Promise<CollaboratorRole>;
export async function getCollaboratorRole(
  collaboratorRoleId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getCollaboratorRole(
  collaboratorRoleId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorRole | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['collaborator-roles'][
    ':collaboratorRoleId'
  ].$get({
    param: { collaboratorRoleId },
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

export async function editCollaboratorRole(
  collaboratorRoleId: string,
  input: EditCollaboratorRole
): Promise<CollaboratorRole>;
export async function editCollaboratorRole(
  collaboratorRoleId: string,
  input: EditCollaboratorRole,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editCollaboratorRole(
  collaboratorRoleId: string,
  input: EditCollaboratorRole,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorRole | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['collaborator-roles'][
    ':collaboratorRoleId'
  ].$put({
    param: { collaboratorRoleId },
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

export async function listCollaboratorRoles(
  query: ListCollaboratorRoles
): Promise<Page<CollaboratorRole>>;
export async function listCollaboratorRoles(
  query: ListCollaboratorRoles,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listCollaboratorRoles(
  params: ListCollaboratorRoles,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<CollaboratorRole> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api['collaborator-roles'].$get({
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

export const assertCollaboratorRole = (item: CollaboratorRole) => {
  return {
    hasName(expected: string) {
      assert.strictEqual(
        item.name,
        expected,
        `Expected name to be ${expected}, got ${item.name}`
      );
      return this;
    },
    hasCurrency(expected: string) {
      assert.strictEqual(
        item.currency,
        expected,
        `Expected currency to be ${expected}, got ${item.currency}`
      );
      return this;
    },
    hasFeeRate(expected: number) {
      assert.strictEqual(
        item.feeRate,
        expected,
        `Expected feeRate to be ${expected}, got ${item.feeRate}`
      );
      return this;
    },
    hasCostRate(expected: number) {
      assert.strictEqual(
        item.costRate,
        expected,
        `Expected costRate to be ${expected}, got ${item.costRate}`
      );
      return this;
    },
    isTheSameOf(expected: CollaboratorRole) {
      return this.hasName(expected.name)
        .hasCurrency(expected.currency)
        .hasFeeRate(expected.feeRate)
        .hasCostRate(expected.costRate);
    },
  };
};
