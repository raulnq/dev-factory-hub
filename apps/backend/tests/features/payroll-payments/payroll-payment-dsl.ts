import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddPayrollPayment,
  EditPayrollPayment,
  ListPayrollPayments,
  PayPayrollPayment,
  PayPensionPayrollPayment,
  PayrollPayment,
} from '#/features/payroll-payments/schemas.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';

// --- Helpers ---

export const todayDate = (): string => new Date().toISOString().split('T')[0];

export const createCollaborator = async (): Promise<string> => {
  const collaborator = await addCollaborator(alice());
  return collaborator.collaboratorId;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPayrollPayment = (item: any): PayrollPayment => ({
  ...item,
  createdAt: new Date(item.createdAt),
  canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
});

// --- Factory functions ---

export const paymentInput = (
  collaboratorId: string,
  overrides?: Partial<AddPayrollPayment>
): AddPayrollPayment => ({
  collaboratorId,
  currency: 'USD',
  netSalary: 1000,
  comission: 50,
  taxes: 100,
  ...overrides,
});

export const editPaymentInput = (
  overrides?: Partial<EditPayrollPayment>
): EditPayrollPayment => ({
  currency: 'EUR',
  netSalary: 1500,
  comission: 75,
  taxes: 150,
  ...overrides,
});

export const payInput = (
  overrides?: Partial<PayPayrollPayment>
): PayPayrollPayment => ({
  paidAt: faker.date.recent().toISOString().split('T')[0],
  ...overrides,
});

export const payPensionInput = (
  overrides?: Partial<PayPensionPayrollPayment>
): PayPensionPayrollPayment => ({
  pensionPaidAt: faker.date.recent().toISOString().split('T')[0],
  pensionAmount: 200,
  ...overrides,
});

// --- Action functions ---

export async function addPayrollPayment(
  input: AddPayrollPayment
): Promise<PayrollPayment>;
export async function addPayrollPayment(
  input: AddPayrollPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addPayrollPayment(
  input: AddPayrollPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'].$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

export async function getPayrollPayment(
  payrollPaymentId: string
): Promise<PayrollPayment>;
export async function getPayrollPayment(
  payrollPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getPayrollPayment(
  payrollPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'][':payrollPaymentId'].$get({
    param: { payrollPaymentId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

export async function editPayrollPayment(
  payrollPaymentId: string,
  input: EditPayrollPayment
): Promise<PayrollPayment>;
export async function editPayrollPayment(
  payrollPaymentId: string,
  input: EditPayrollPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editPayrollPayment(
  payrollPaymentId: string,
  input: EditPayrollPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'][':payrollPaymentId'].$put({
    param: { payrollPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

export async function listPayrollPayments(
  params: ListPayrollPayments
): Promise<Page<PayrollPayment>>;
export async function listPayrollPayments(
  params: ListPayrollPayments,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listPayrollPayments(
  params: ListPayrollPayments,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<PayrollPayment> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'].$get({
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
      items: data.items.map((item: any) => mapPayrollPayment(item)),
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

export async function payPayrollPayment(
  payrollPaymentId: string,
  input: PayPayrollPayment
): Promise<PayrollPayment>;
export async function payPayrollPayment(
  payrollPaymentId: string,
  input: PayPayrollPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function payPayrollPayment(
  payrollPaymentId: string,
  input: PayPayrollPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'][
    ':payrollPaymentId'
  ].pay.$post({
    param: { payrollPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

export async function payPensionPayrollPayment(
  payrollPaymentId: string,
  input: PayPensionPayrollPayment
): Promise<PayrollPayment>;
export async function payPensionPayrollPayment(
  payrollPaymentId: string,
  input: PayPensionPayrollPayment,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function payPensionPayrollPayment(
  payrollPaymentId: string,
  input: PayPensionPayrollPayment,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'][':payrollPaymentId'][
    'pay-pension'
  ].$post({
    param: { payrollPaymentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

export async function cancelPayrollPayment(
  payrollPaymentId: string
): Promise<PayrollPayment>;
export async function cancelPayrollPayment(
  payrollPaymentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelPayrollPayment(
  payrollPaymentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<PayrollPayment | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api['payroll-payments'][
    ':payrollPaymentId'
  ].cancel.$post({
    param: { payrollPaymentId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapPayrollPayment(item);
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

// --- Assertion builder ---

export const assertPayrollPayment = (item: PayrollPayment) => ({
  hasStatus(expected: string) {
    assert.strictEqual(item.status, expected);
    return this;
  },
  hasCurrency(expected: string) {
    assert.strictEqual(item.currency, expected);
    return this;
  },
  hasNetSalary(expected: number) {
    assert.strictEqual(Number(item.netSalary), expected);
    return this;
  },
  hasPensionAmount(expected: number) {
    assert.strictEqual(Number(item.pensionAmount), expected);
    return this;
  },
  hasGrossSalary(expected: number) {
    assert.strictEqual(Number(item.grossSalary), expected);
    return this;
  },
  hasComission(expected: number) {
    assert.strictEqual(Number(item.comission), expected);
    return this;
  },
  hasTaxes(expected: number) {
    assert.strictEqual(Number(item.taxes), expected);
    return this;
  },
  hasPaidAt(expected: string) {
    assert.strictEqual(item.paidAt, expected);
    return this;
  },
  hasPensionPaidAt(expected: string) {
    assert.strictEqual(item.pensionPaidAt, expected);
    return this;
  },
  hasCanceledAt() {
    assert.ok(item.canceledAt, 'Expected canceledAt to be set');
    return this;
  },
  hasCollaboratorName() {
    assert.ok(item.collaboratorName, 'Expected collaboratorName to be set');
    return this;
  },
  isTheSameOf(expected: PayrollPayment) {
    return this.hasStatus(expected.status)
      .hasCurrency(expected.currency)
      .hasNetSalary(Number(expected.netSalary))
      .hasPensionAmount(Number(expected.pensionAmount))
      .hasGrossSalary(Number(expected.grossSalary))
      .hasComission(Number(expected.comission))
      .hasTaxes(Number(expected.taxes));
  },
});
