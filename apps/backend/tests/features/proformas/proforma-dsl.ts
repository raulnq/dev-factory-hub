import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddProforma,
  EditProforma,
  Proforma,
  ProformaItem,
  AddProformaItem,
  ListProforma,
  ListProformaItems,
} from '#/features/proformas/schemas.js';
import {
  addClient,
  techCorp,
  addProject,
  webApp,
} from '../../features/clients/client-dsl.js';

export const createProject = async () => {
  const client = await addClient(techCorp());
  const project = await addProject(client.clientId, webApp());
  return project.projectId;
};

export const createProforma = async (
  overrides?: Partial<AddProforma>
): Promise<AddProforma> => {
  const date = faker.date.future();
  const dateStr = date.toISOString().split('T')[0];
  return {
    projectId: overrides?.projectId ?? (await createProject()),
    currency: 'USD',
    startDate: dateStr,
    endDate: dateStr,
    notes: faker.lorem.sentence(),
    ...overrides,
  };
};

export const createProformaItem = (
  overrides?: Partial<AddProformaItem>
): AddProformaItem => {
  return {
    description: faker.commerce.productName(),
    amount: Number(faker.commerce.price({ min: 10, max: 1000 })),
    ...overrides,
  };
};

// --- Actions ---

export async function addProforma(input: AddProforma): Promise<Proforma>;
export async function addProforma(
  input: AddProforma,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addProforma(
  input: AddProforma,
  expectedProblemDocument?: ProblemDocument
): Promise<Proforma | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas.$post({ json: input });

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
      issuedAt: item.issuedAt != null ? new Date(item.issuedAt) : null,
      cancelledAt: item.cancelledAt != null ? new Date(item.cancelledAt) : null,
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

export async function editProforma(
  proformaId: string,
  input: EditProforma
): Promise<Proforma>;
export async function editProforma(
  proformaId: string,
  input: EditProforma,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editProforma(
  proformaId: string,
  input: EditProforma,
  expectedProblemDocument?: ProblemDocument
): Promise<Proforma | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].$put({
    param: { proformaId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      issuedAt: item.issuedAt != null ? new Date(item.issuedAt) : null,
      cancelledAt: item.cancelledAt != null ? new Date(item.cancelledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function getProforma(proformaId: string): Promise<Proforma>;
export async function getProforma(
  proformaId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getProforma(
  proformaId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Proforma | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].$get({
    param: { proformaId },
  });

  if (response.status === StatusCodes.OK) {
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      issuedAt: item.issuedAt ? new Date(item.issuedAt) : null,
      cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function listProformas(
  params: ListProforma
): Promise<Page<Proforma>>;
export async function listProformas(
  params: ListProforma,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listProformas(
  params: ListProforma,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Proforma> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      projectId: params.projectId,
    },
  });

  if (response.status === StatusCodes.OK) {
    const data = await response.json();
    assert.ok(data);
    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: data.items.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        issuedAt: item.issuedAt ? new Date(item.issuedAt) : null,
        cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : null,
      })),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function issueProforma(proformaId: string): Promise<Proforma>;
export async function issueProforma(
  proformaId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function issueProforma(
  proformaId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Proforma | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].issue.$post({
    param: { proformaId },
  });

  if (response.status === StatusCodes.OK) {
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      issuedAt: item.issuedAt != null ? new Date(item.issuedAt) : null,
      cancelledAt: item.cancelledAt != null ? new Date(item.cancelledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function cancelProforma(proformaId: string): Promise<Proforma>;
export async function cancelProforma(
  proformaId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function cancelProforma(
  proformaId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Proforma | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].cancel.$post({
    param: { proformaId },
  });

  if (response.status === StatusCodes.OK) {
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      issuedAt: item.issuedAt != null ? new Date(item.issuedAt) : null,
      cancelledAt: item.cancelledAt != null ? new Date(item.cancelledAt) : null,
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function addProformaItem(
  proformaId: string,
  input: AddProformaItem
): Promise<ProformaItem>;
export async function addProformaItem(
  proformaId: string,
  input: AddProformaItem,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addProformaItem(
  proformaId: string,
  input: AddProformaItem,
  expectedProblemDocument?: ProblemDocument
): Promise<ProformaItem | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].items.$post({
    param: { proformaId },
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    const item = await response.json();
    assert.ok(item);
    return item;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function deleteProformaItem(
  proformaId: string,
  proformaItemId: string
): Promise<void>;
export async function deleteProformaItem(
  proformaId: string,
  proformaItemId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function deleteProformaItem(
  proformaId: string,
  proformaItemId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].items[
    ':proformaItemId'
  ].$delete({
    param: { proformaId, proformaItemId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(!expectedProblemDocument);
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export async function listProformaItems(
  proformaId: string,
  params: ListProformaItems
): Promise<Page<ProformaItem>>;
export async function listProformaItems(
  proformaId: string,
  params: ListProformaItems,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listProformaItems(
  proformaId: string,
  params: ListProformaItems,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<ProformaItem> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.proformas[':proformaId'].items.$get({
    param: { proformaId },
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });

  if (response.status === StatusCodes.OK) {
    const page = await response.json();
    assert.ok(page);
    return page;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    if (expectedProblemDocument) {
      assertStrictEqualProblemDocument(
        problemDocument,
        expectedProblemDocument
      );
    }
    return problemDocument;
  }
}

export const assertProforma = (item: Proforma) => ({
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
});
