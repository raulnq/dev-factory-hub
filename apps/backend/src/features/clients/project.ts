import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { clients } from './client.js';

const dbSchema = pgSchema('dev-factory-hub');

export const projects = dbSchema.table('projects', {
  projectId: uuid('projectId').primaryKey(),
  clientId: uuid('clientId')
    .notNull()
    .references(() => clients.clientId),
  name: varchar('name', { length: 500 }).notNull(),
});
