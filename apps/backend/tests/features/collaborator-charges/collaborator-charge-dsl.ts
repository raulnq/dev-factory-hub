import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddCollaboratorCharge,
  CollaboratorCharge,
  EditCollaboratorCharge,
  ListCollaboratorCharges,
  PayCollaboratorCharge,
} from '#/features/collaborator-charges/schemas.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';

// --- Factory functions ---

export const createCollaborator = async () => {
  const collaborator = await addCollaborator(alice());
  return collaborator;
};

export const chargeInput = (
  collaboratorId: string,
  overrides?: Partial<AddCollaboratorCharge>
): AddCollaboratorCharge => ({
  collaboratorId,
  description: faker.lorem.sentence(),
  amount: 100,
  currency: 'USD',
  ...overrides,
});

export const editChargeInput = (
  overrides?: Partial<EditCollaboratorCharge>
): EditCollaboratorCharge => ({
  description: faker.lorem.sentence(),
  amount: 200,
  currency: 'EUR',
  ...overrides,
});

export const payInput = (
  overrides?: Partial<PayCollaboratorCharge>
): PayCollaboratorCharge => ({
  issuedAt: faker.date.recent().toISOString().split('T')[0],
  ...overrides,
});

// --- Action functions ---

export async function addCollaboratorCharge(
  input: AddCollaboratorCharge
): Promise<CollaboratorCharge>;
export async function addCollaboratorCharge(
  input: AddCollaboratorCharge,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addCollaboratorCharge(
  input: AddCollaboratorCharge,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorCharge | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'].$post({
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
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

export async function getCollaboratorCharge(
  collaboratorChargeId: string
): Promise<CollaboratorCharge>;
export async function getCollaboratorCharge(
  collaboratorChargeId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getCollaboratorCharge(
  collaboratorChargeId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorCharge | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].$get({
    param: { collaboratorChargeId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
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

export async function listCollaboratorCharges(
  params: ListCollaboratorCharges
): Promise<Page<CollaboratorCharge>>;
export async function listCollaboratorCharges(
  params: ListCollaboratorCharges,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listCollaboratorCharges(
  params: ListCollaboratorCharges,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<CollaboratorCharge> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'].$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      collaboratorId: params.collaboratorId,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const data = await response.json();
    assert.ok(data);
    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: data.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
      })),
    };
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

export async function editCollaboratorCharge(
  collaboratorChargeId: string,
  input: EditCollaboratorCharge
): Promise<CollaboratorCharge>;
export async function editCollaboratorCharge(
  collaboratorChargeId: string,
  input: EditCollaboratorCharge,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editCollaboratorCharge(
  collaboratorChargeId: string,
  input: EditCollaboratorCharge,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorCharge | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].$patch({
    param: { collaboratorChargeId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
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

export async function payCollaboratorCharge(
  collaboratorChargeId: string,
  input: PayCollaboratorCharge
): Promise<CollaboratorCharge>;
export async function payCollaboratorCharge(
  collaboratorChargeId: string,
  input: PayCollaboratorCharge,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function payCollaboratorCharge(
  collaboratorChargeId: string,
  input: PayCollaboratorCharge,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorCharge | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].pay.$post({
    param: { collaboratorChargeId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected success status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function cancelCollaboratorCharge(
  collaboratorChargeId: string
): Promise<CollaboratorCharge>;
export async function cancelCollaboratorCharge(
  collaboratorChargeId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelCollaboratorCharge(
  collaboratorChargeId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorCharge | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-charges'][
    ':collaboratorChargeId'
  ].cancel.$post({
    param: { collaboratorChargeId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      canceledAt: item.canceledAt != null ? new Date(item.canceledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected success status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

// --- Fluent assertion builder ---

export const assertCollaboratorCharge = (item: CollaboratorCharge) => ({
  hasStatus(expected: string) {
    assert.strictEqual(
      item.status,
      expected,
      `Expected status to be ${expected}, got ${item.status}`
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
  hasAmount(expected: number) {
    assert.strictEqual(
      Number(item.amount),
      expected,
      `Expected amount to be ${expected}, got ${item.amount}`
    );
    return this;
  },
  hasDescription(expected: string) {
    assert.strictEqual(
      item.description,
      expected,
      `Expected description to be ${expected}, got ${item.description}`
    );
    return this;
  },
  hasIssuedAt(expected: string | null) {
    assert.strictEqual(
      item.issuedAt,
      expected,
      `Expected issuedAt to be ${expected}, got ${item.issuedAt}`
    );
    return this;
  },
  hasCanceledAt(expected: boolean) {
    if (expected) {
      assert.ok(
        item.canceledAt != null,
        'Expected canceledAt to be set but it is null'
      );
    } else {
      assert.strictEqual(
        item.canceledAt,
        null,
        'Expected canceledAt to be null'
      );
    }
    return this;
  },
  hasCollaboratorName(expected: string) {
    assert.strictEqual(
      item.collaboratorName,
      expected,
      `Expected collaboratorName to be ${expected}, got ${item.collaboratorName}`
    );
    return this;
  },
});
