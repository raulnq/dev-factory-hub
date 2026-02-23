import { test, describe } from 'node:test';
import { addTodo, assertTodo, walk } from './todo-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  validationError,
} from '../../errors.js';
describe('Add Todo Endpoint', () => {
  test('should create a new todo with valid data', async () => {
    const input = walk();
    const todo = await addTodo(input);
    assertTodo(todo).hasName(input.name).hasCompleted(false);
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty todo name',
        input: walk({ name: emptyText }),
        expectedError: createValidationError([
          validationError.tooSmall('name', 1),
        ]),
      },
      {
        name: 'should reject todo name longer than 1024 characters',
        input: walk({ name: bigText(1025) }),
        expectedError: createValidationError([
          validationError.tooBig('name', 1024),
        ]),
      },
      {
        name: 'should reject missing todo name',
        input: walk({ name: undefined }),
        expectedError: createValidationError([
          validationError.requiredString('name'),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        await addTodo(input, expectedError);
      });
    }
  });
});
