import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddCollaboratorPayment,
  CollaboratorPayment,
  EditCollaboratorPayment,
  ListCollaboratorPayments,
  PayCollaboratorPayment,
  ConfirmCollaboratorPayment,
} from '#/features/collaborator-payments/schemas.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';

// --- Factory functions ---

export const createCollaborator = async (
  withholdingPercentage: number = 10
) => {
  const collaborator = await addCollaborator(alice({ withholdingPercentage }));
  return collaborator;
};

export const paymentInput = (
  collaboratorId: string,
  overrides?: Partial<AddCollaboratorPayment>
): AddCollaboratorPayment => ({
  collaboratorId,
  currency: 'USD',
  grossSalary: 1000,
  ...overrides,
});

export const editPaymentInput = (
  overrides?: Partial<EditCollaboratorPayment>
): EditCollaboratorPayment => ({
  currency: 'EUR',
  grossSalary: 2000,
  withholding: 200,
  ...overrides,
});

export const payInput = (
  overrides?: Partial<PayCollaboratorPayment>
): PayCollaboratorPayment => ({
  paidAt: faker.date.recent().toISOString().split('T')[0],
  ...overrides,
});

export const confirmInput = (
  overrides?: Partial<ConfirmCollaboratorPayment>
): ConfirmCollaboratorPayment => ({
  confirmedAt: faker.date.recent().toISOString().split('T')[0],
  number: `PAY-${faker.string.alphanumeric(8)}`,
  ...overrides,
});

// --- Action functions ---

export async function addCollaboratorPayment(
  input: AddCollaboratorPayment
): Promise<CollaboratorPayment>;
export async function addCollaboratorPayment(
  input: AddCollaboratorPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addCollaboratorPayment(
  input: AddCollaboratorPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'].$post({
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

export async function getCollaboratorPayment(
  collaboratorPaymentId: string
): Promise<CollaboratorPayment>;
export async function getCollaboratorPayment(
  collaboratorPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getCollaboratorPayment(
  collaboratorPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].$get({
    param: { collaboratorPaymentId },
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

export async function listCollaboratorPayments(
  params: ListCollaboratorPayments
): Promise<Page<CollaboratorPayment>>;
export async function listCollaboratorPayments(
  params: ListCollaboratorPayments,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listCollaboratorPayments(
  params: ListCollaboratorPayments,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<CollaboratorPayment> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'].$get({
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

export async function editCollaboratorPayment(
  collaboratorPaymentId: string,
  input: EditCollaboratorPayment
): Promise<CollaboratorPayment>;
export async function editCollaboratorPayment(
  collaboratorPaymentId: string,
  input: EditCollaboratorPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editCollaboratorPayment(
  collaboratorPaymentId: string,
  input: EditCollaboratorPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].$put({
    param: { collaboratorPaymentId },
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

export async function payCollaboratorPayment(
  collaboratorPaymentId: string,
  input: PayCollaboratorPayment
): Promise<CollaboratorPayment>;
export async function payCollaboratorPayment(
  collaboratorPaymentId: string,
  input: PayCollaboratorPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function payCollaboratorPayment(
  collaboratorPaymentId: string,
  input: PayCollaboratorPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].pay.$post({
    param: { collaboratorPaymentId },
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

export async function confirmCollaboratorPayment(
  collaboratorPaymentId: string,
  input: ConfirmCollaboratorPayment
): Promise<CollaboratorPayment>;
export async function confirmCollaboratorPayment(
  collaboratorPaymentId: string,
  input: ConfirmCollaboratorPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function confirmCollaboratorPayment(
  collaboratorPaymentId: string,
  input: ConfirmCollaboratorPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].confirm.$post({
    param: { collaboratorPaymentId },
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

export async function cancelCollaboratorPayment(
  collaboratorPaymentId: string
): Promise<CollaboratorPayment>;
export async function cancelCollaboratorPayment(
  collaboratorPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelCollaboratorPayment(
  collaboratorPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<CollaboratorPayment | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api['collaborator-payments'][
    ':collaboratorPaymentId'
  ].cancel.$post({
    param: { collaboratorPaymentId },
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

export const assertCollaboratorPayment = (item: CollaboratorPayment) => ({
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
  hasGrossSalary(expected: number) {
    assert.strictEqual(
      Number(item.grossSalary),
      expected,
      `Expected grossSalary to be ${expected}, got ${item.grossSalary}`
    );
    return this;
  },
  hasWithholding(expected: number) {
    assert.strictEqual(
      Number(item.withholding),
      expected,
      `Expected withholding to be ${expected}, got ${item.withholding}`
    );
    return this;
  },
  hasNetSalary(expected: number) {
    assert.strictEqual(
      Number(item.netSalary),
      expected,
      `Expected netSalary to be ${expected}, got ${item.netSalary}`
    );
    return this;
  },
  hasPaidAt(expected: string | null) {
    assert.strictEqual(
      item.paidAt,
      expected,
      `Expected paidAt to be ${expected}, got ${item.paidAt}`
    );
    return this;
  },
  hasConfirmedAt(expected: string | null) {
    assert.strictEqual(
      item.confirmedAt,
      expected,
      `Expected confirmedAt to be ${expected}, got ${item.confirmedAt}`
    );
    return this;
  },
  hasNumber(expected: string | null) {
    assert.strictEqual(
      item.number,
      expected,
      `Expected number to be ${expected}, got ${item.number}`
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
