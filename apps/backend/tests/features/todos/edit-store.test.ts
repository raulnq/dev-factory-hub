import { test, describe } from 'node:test';
import { addTodo, editTodo, walk, cook, assertTodo } from './todo-dsl.js';

import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import type { EditTodo, Todo } from '#/features/todos/schemas.js';

describe('Edit Todo Endpoint', () => {
  test('should edit an existing todo with valid data', async () => {
    const todo = await addTodo(walk());
    const input = cook();
    const newTodo = await editTodo(todo.todoId, {
      ...input,
      completed: todo.completed,
    });
    assertTodo(newTodo).hasName(input.name);
  });

  describe('Property validations', async () => {
    const testCases = [
      {
        name: 'should reject empty todo name',
        input: (todo: Todo) => ({ name: emptyText, completed: todo.completed }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject todo name longer than 1024 characters',
        input: (todo: Todo) => ({
          name: bigText(1025),
          completed: todo.completed,
        }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing todo name',
        input: (todo: Todo) => ({ completed: todo.completed }) as EditTodo,
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
    ];
    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const todo = await addTodo(walk());
        await editTodo(todo.todoId, input(todo), expectedError);
      });
    }
  });

  test('should return 404 for non-existent todo', async () => {
    const nonExistentId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editTodo(
      nonExistentId,
      { ...cook(), completed: false },
      createNotFoundError(`Todo ${nonExistentId} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await editTodo(
      'invalid-uuid',
      { ...cook(), completed: false },
      createValidationError([validationError.invalidUuid('todoId')])
    );
  });
});
