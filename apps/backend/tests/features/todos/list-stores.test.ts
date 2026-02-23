import { test, describe } from 'node:test';
import { addTodo, assertTodo, listTodos, walk } from './todo-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Todos Endpoint', () => {
  test('should filter todos by name', async () => {
    const todo = await addTodo(walk());

    const page = await listTodos({
      name: todo.name,
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCount(1);
    assertTodo(page.items[0]).isTheSameOf(todo);
  });

  test('should return empty items when no todos match filter', async () => {
    const page = await listTodos({
      name: 'nonexistent-todo-xyz',
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasEmptyResult();
  });
});
