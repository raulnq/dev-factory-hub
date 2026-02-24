import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddClient,
  EditClient,
  Client,
  ListClients,
  AddProject,
  EditProject,
  Project,
  AddContact,
  EditContact,
  Contact,
} from '#/features/clients/schemas.js';

// ---- Client factory functions ----

export const acme = (overrides?: Partial<AddClient>): AddClient => ({
  name: `Acme Corp ${faker.string.uuid()}`,
  documentNumber: null,
  phone: null,
  address: null,
  email: null,
  ...overrides,
});

export const techCorp = (overrides?: Partial<AddClient>): AddClient => ({
  name: `Tech Corp ${faker.string.uuid()}`,
  documentNumber: faker.string.alphanumeric(10),
  phone: faker.string.numeric(10),
  address: faker.location.streetAddress().substring(0, 200),
  email: faker.internet.email().substring(0, 50),
  ...overrides,
});

// ---- Project factory functions ----

export const webApp = (overrides?: Partial<AddProject>): AddProject => ({
  name: `Web App ${faker.string.uuid()}`,
  ...overrides,
});

export const mobileApp = (overrides?: Partial<AddProject>): AddProject => ({
  name: `Mobile App ${faker.string.uuid()}`,
  ...overrides,
});

// ---- Contact factory functions ----

export const johnDoe = (overrides?: Partial<AddContact>): AddContact => ({
  name: `John Doe ${faker.string.uuid()}`,
  email: null,
  ...overrides,
});

export const janeDoe = (overrides?: Partial<AddContact>): AddContact => ({
  name: `Jane Doe ${faker.string.uuid()}`,
  email: faker.internet.email().substring(0, 50),
  ...overrides,
});

// ---- Client action functions ----

export async function addClient(input: AddClient): Promise<Client>;
export async function addClient(
  input: AddClient,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addClient(
  input: AddClient,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients.$post({ json: input });

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

export async function editClient(
  clientId: string,
  input: EditClient
): Promise<Client>;
export async function editClient(
  clientId: string,
  input: EditClient,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editClient(
  clientId: string,
  input: EditClient,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].$put({
    param: { clientId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
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

export async function getClient(clientId: string): Promise<Client>;
export async function getClient(
  clientId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function getClient(
  clientId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].$get({
    param: { clientId },
  });

  if (response.status === StatusCodes.OK) {
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

export async function listClients(params: ListClients): Promise<Page<Client>>;
export async function listClients(
  params: ListClients,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function listClients(
  params: ListClients,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Client> | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      name: params.name,
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

// ---- Project action functions ----

export async function addProject(
  clientId: string,
  input: AddProject
): Promise<Project>;
export async function addProject(
  clientId: string,
  input: AddProject,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addProject(
  clientId: string,
  input: AddProject,
  expectedProblemDocument?: ProblemDocument
): Promise<Project | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].projects.$post({
    param: { clientId },
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

export async function editProject(
  clientId: string,
  projectId: string,
  input: EditProject
): Promise<Project>;
export async function editProject(
  clientId: string,
  projectId: string,
  input: EditProject,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editProject(
  clientId: string,
  projectId: string,
  input: EditProject,
  expectedProblemDocument?: ProblemDocument
): Promise<Project | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].projects[
    ':projectId'
  ].$put({
    param: { clientId, projectId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
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

export async function deleteProject(
  clientId: string,
  projectId: string
): Promise<void>;
export async function deleteProject(
  clientId: string,
  projectId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function deleteProject(
  clientId: string,
  projectId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].projects[
    ':projectId'
  ].$delete({
    param: { clientId, projectId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received NO_CONTENT status'
    );
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listProjects(
  clientId: string,
  params: { pageNumber?: number; pageSize?: number } = {}
): Promise<Page<Project>> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].projects.$get({
    param: { clientId },
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });
  assert.strictEqual(response.status, StatusCodes.OK);
  const page = await response.json();
  assert.ok(page);
  return page;
}

// ---- Contact action functions ----

export async function addContact(
  clientId: string,
  input: AddContact
): Promise<Contact>;
export async function addContact(
  clientId: string,
  input: AddContact,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function addContact(
  clientId: string,
  input: AddContact,
  expectedProblemDocument?: ProblemDocument
): Promise<Contact | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].contacts.$post({
    param: { clientId },
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

export async function editContact(
  clientId: string,
  contactId: string,
  input: EditContact
): Promise<Contact>;
export async function editContact(
  clientId: string,
  contactId: string,
  input: EditContact,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editContact(
  clientId: string,
  contactId: string,
  input: EditContact,
  expectedProblemDocument?: ProblemDocument
): Promise<Contact | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].contacts[
    ':contactId'
  ].$put({
    param: { clientId, contactId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
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

export async function deleteContact(
  clientId: string,
  contactId: string
): Promise<void>;
export async function deleteContact(
  clientId: string,
  contactId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function deleteContact(
  clientId: string,
  contactId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].contacts[
    ':contactId'
  ].$delete({
    param: { clientId, contactId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received NO_CONTENT status'
    );
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listContacts(
  clientId: string,
  params: { pageNumber?: number; pageSize?: number } = {}
): Promise<Page<Contact>> {
  const hono = testClient(app);
  const response = await hono.api.clients[':clientId'].contacts.$get({
    param: { clientId },
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });
  assert.strictEqual(response.status, StatusCodes.OK);
  const page = await response.json();
  assert.ok(page);
  return page;
}

// ---- Assertion builders ----

export const assertClient = (item: Client) => ({
  hasName(expected: string) {
    assert.strictEqual(
      item.name,
      expected,
      `Expected name to be ${expected}, got ${item.name}`
    );
    return this;
  },
  hasDocumentNumber(expected: string | null) {
    assert.strictEqual(item.documentNumber, expected);
    return this;
  },
  hasEmail(expected: string | null) {
    assert.strictEqual(item.email, expected);
    return this;
  },
  isTheSameOf(expected: Client) {
    return this.hasName(expected.name)
      .hasEmail(expected.email)
      .hasDocumentNumber(expected.documentNumber);
  },
});

export const assertProject = (item: Project) => ({
  hasName(expected: string) {
    assert.strictEqual(
      item.name,
      expected,
      `Expected name to be ${expected}, got ${item.name}`
    );
    return this;
  },
  hasClientId(expected: string) {
    assert.strictEqual(item.clientId, expected);
    return this;
  },
  isTheSameOf(expected: Project) {
    return this.hasName(expected.name);
  },
});

export const assertContact = (item: Contact) => ({
  hasName(expected: string) {
    assert.strictEqual(
      item.name,
      expected,
      `Expected name to be ${expected}, got ${item.name}`
    );
    return this;
  },
  hasEmail(expected: string | null) {
    assert.strictEqual(item.email, expected);
    return this;
  },
  isTheSameOf(expected: Contact) {
    return this.hasName(expected.name).hasEmail(expected.email);
  },
});
