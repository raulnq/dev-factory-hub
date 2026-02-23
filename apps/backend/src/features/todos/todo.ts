import { varchar, pgSchema, uuid, boolean } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('todos_schema');

export const todos = dbSchema.table('todos', {
  todoId: uuid('todoId').primaryKey(),
  name: varchar('name', { length: 1024 }).notNull(),
  completed: boolean('completed').notNull(),
});
