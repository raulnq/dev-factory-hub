import { test, describe } from 'node:test';
import { addTodo, assertTodo, getTodo, walk } from './todo-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Todo Endpoint', () => {
  test('should get an existing todo by ID', async () => {
    const createdTodo = await addTodo(walk());
    const retrievedTodo = await getTodo(createdTodo.todoId);
    assertTodo(retrievedTodo).isTheSameOf(createdTodo);
  });

  test('should return 404 for non-existent todo', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await getTodo(
      nonExistentId,
      createNotFoundError(`Todo ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getTodo(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('todoId')])
    );
  });

  test('should reject empty todoId', async () => {
    await getTodo(
      '',
      createValidationError([validationError.invalidUuid('todoId')])
    );
  });
});
