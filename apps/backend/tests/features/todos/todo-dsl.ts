import { testClient } from 'hono/testing';

import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddTodo,
  EditTodo,
  Todo,
  ListTodos,
} from '#/features/todos/schemas.js';

export const walk = (overrides?: Partial<AddTodo>): AddTodo => {
  return {
    name: `walk ${faker.string.uuid()}`,
    ...overrides,
  };
};

export const cook = (overrides?: Partial<AddTodo>): AddTodo => {
  return {
    name: `cook ${faker.string.uuid()}`,
    ...overrides,
  };
};

export async function addTodo(input: AddTodo): Promise<Todo>;
export async function addTodo(
  input: AddTodo,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addTodo(
  input: AddTodo,
  expectedProblemDocument?: ProblemDocument
): Promise<Todo | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.todos.$post({
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const todo = await response.json();
    assert.ok(todo);
    return todo;
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

export async function editTodo(todoId: string, input: EditTodo): Promise<Todo>;
export async function editTodo(
  todoId: string,
  input: EditTodo,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;
export async function editTodo(
  todoId: string,
  input: EditTodo,
  expectedProblemDocument?: ProblemDocument
): Promise<Todo | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.todos[':todoId'].$put({
    param: { todoId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    const todo = await response.json();
    assert.ok(todo);
    return todo;
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

export async function getTodo(todoId: string): Promise<Todo>;
export async function getTodo(
  todoId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getTodo(
  todoId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Todo | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.todos[':todoId'].$get({
    param: { todoId },
  });

  if (response.status === StatusCodes.OK) {
    const todo = await response.json();
    assert.ok(todo);
    return todo;
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

export async function listTodos(params: ListTodos): Promise<Page<Todo>>;
export async function listTodos(
  params: ListTodos,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listTodos(
  params: ListTodos,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Todo> | ProblemDocument> {
  const client = testClient(app);
  const queryParams = {
    pageNumber: params.pageNumber?.toString(),
    pageSize: params.pageSize?.toString(),
    name: params.name,
  };
  const response = await client.api.todos.$get({
    query: queryParams,
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

export const assertTodo = (todo: Todo) => {
  return {
    hasName(expected: string) {
      assert.strictEqual(
        todo.name,
        expected,
        `Expected name to be ${expected}, got ${todo.name}`
      );
      return this;
    },
    hasCompleted(expected: boolean) {
      assert.strictEqual(
        todo.completed,
        expected,
        `Expected completed to be ${expected}, got ${todo.completed}`
      );
      return this;
    },
    isTheSameOf(expected: Todo) {
      return this.hasName(expected.name).hasCompleted(expected.completed);
    },
  };
};
