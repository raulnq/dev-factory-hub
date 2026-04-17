import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddInvoice,
  DownloadUrlResponse,
  EditInvoice,
  Invoice,
  IssueInvoice,
  ListInvoices,
} from '#/features/invoices/schemas.js';
import { addClient, acme } from '../clients/client-dsl.js';

export const todayDate = (): string => new Date().toISOString().split('T')[0];

export const createClient = async (): Promise<string> => {
  const client = await addClient(acme());
  return client.clientId;
};

export const pendingInvoice = (
  overrides?: Partial<AddInvoice>
): AddInvoice => ({
  clientId: '00000000-0000-7000-8000-000000000000',
  currency: 'USD',
  subtotal: 100,
  taxes: 18,
  ...overrides,
});

export const createInvoice = async (
  overrides?: Partial<AddInvoice>
): Promise<AddInvoice> => {
  const clientId = overrides?.clientId ?? (await createClient());
  return pendingInvoice({ ...overrides, clientId });
};

export const defaultIssueData = (
  overrides?: Partial<IssueInvoice>
): IssueInvoice => ({
  issuedAt: todayDate(),
  number: `INV-${faker.string.numeric(6)}`,
  ...overrides,
});

// --- mapInvoice helper (converts date strings to Date objects) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapInvoice = (item: any): Invoice => ({
  ...item,
  createdAt: new Date(item.createdAt),
  canceledAt: item.canceledAt ? new Date(item.canceledAt) : null,
});

// --- Action functions ---

export async function addInvoice(input: AddInvoice): Promise<Invoice>;
export async function addInvoice(
  input: AddInvoice,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addInvoice(
  input: AddInvoice,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

export async function getInvoice(invoiceId: string): Promise<Invoice>;
export async function getInvoice(
  invoiceId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getInvoice(
  invoiceId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId'].$get({
    param: { invoiceId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

export async function editInvoice(
  invoiceId: string,
  input: EditInvoice
): Promise<Invoice>;
export async function editInvoice(
  invoiceId: string,
  input: EditInvoice,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editInvoice(
  invoiceId: string,
  input: EditInvoice,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId'].$put({
    param: { invoiceId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

export async function listInvoices(
  params: ListInvoices
): Promise<Page<Invoice>>;
export async function listInvoices(
  params: ListInvoices,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listInvoices(
  params: ListInvoices,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Invoice> | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      clientId: params.clientId,
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
      items: data.items.map((item: any) => mapInvoice(item)),
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

export async function issueInvoice(
  invoiceId: string,
  input: IssueInvoice
): Promise<Invoice>;
export async function issueInvoice(
  invoiceId: string,
  input: IssueInvoice,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function issueInvoice(
  invoiceId: string,
  input: IssueInvoice,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId'].issue.$post({
    param: { invoiceId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

export async function cancelInvoice(invoiceId: string): Promise<Invoice>;
export async function cancelInvoice(
  invoiceId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelInvoice(
  invoiceId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId'].cancel.$post({
    param: { invoiceId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

// --- Mock file helpers ---

export const createMockFile = (overrides?: {
  name?: string;
  type?: string;
  size?: number;
}): File => {
  const name = overrides?.name ?? 'invoice.pdf';
  const type = overrides?.type ?? 'application/pdf';
  const size = overrides?.size ?? 1024;
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
};

export const pdfFile = (): File =>
  createMockFile({ name: 'invoice.pdf', type: 'application/pdf' });

export const oversizedFile = (): File =>
  createMockFile({
    name: 'huge.pdf',
    type: 'application/pdf',
    size: 51 * 1024 * 1024,
  });

export const invalidTypeFile = (): File =>
  createMockFile({ name: 'script.exe', type: 'application/x-msdownload' });

// --- Upload / download action functions ---

export async function uploadInvoice(
  invoiceId: string,
  file: File
): Promise<Invoice>;
export async function uploadInvoice(
  invoiceId: string,
  file: File,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function uploadInvoice(
  invoiceId: string,
  file: File,
  expectedProblemDocument?: ProblemDocument
): Promise<Invoice | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId'].upload.$post({
    param: { invoiceId },
    form: { file },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return mapInvoice(item);
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

export async function getInvoiceDownloadUrl(
  invoiceId: string
): Promise<DownloadUrlResponse>;
export async function getInvoiceDownloadUrl(
  invoiceId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getInvoiceDownloadUrl(
  invoiceId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<DownloadUrlResponse | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.invoices[':invoiceId']['download-url'].$get({
    param: { invoiceId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const data = await response.json();
    assert.ok(data);
    return data;
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

export const assertInvoice = (item: Invoice) => ({
  hasStatus(expected: string) {
    assert.strictEqual(item.status, expected);
    return this;
  },
  hasTotal(expected: number) {
    assert.strictEqual(Number(item.total), expected);
    return this;
  },
  hasSubtotal(expected: number) {
    assert.strictEqual(Number(item.subtotal), expected);
    return this;
  },
  hasTaxes(expected: number) {
    assert.strictEqual(Number(item.taxes), expected);
    return this;
  },
  hasCurrency(expected: string) {
    assert.strictEqual(item.currency, expected);
    return this;
  },
  hasClientId(expected: string) {
    assert.strictEqual(item.clientId, expected);
    return this;
  },
  hasNumber(expected: string) {
    assert.strictEqual(item.number, expected);
    return this;
  },
  hasIssuedAt(expected: string) {
    assert.strictEqual(item.issuedAt, expected);
    return this;
  },
  hasCanceledAt() {
    assert.ok(item.canceledAt, 'Expected canceledAt to be set');
    return this;
  },
  hasFilePath() {
    assert.ok(item.filePath, 'Expected filePath to be set');
    return this;
  },
  hasContentType(expected: string) {
    assert.strictEqual(item.contentType, expected);
    return this;
  },
  hasNoFile() {
    assert.strictEqual(item.filePath, null);
    assert.strictEqual(item.contentType, null);
    return this;
  },
  isTheSameOf(expected: Invoice) {
    return this.hasStatus(expected.status)
      .hasTotal(Number(expected.total))
      .hasSubtotal(Number(expected.subtotal))
      .hasTaxes(Number(expected.taxes))
      .hasCurrency(expected.currency)
      .hasClientId(expected.clientId);
  },
});
