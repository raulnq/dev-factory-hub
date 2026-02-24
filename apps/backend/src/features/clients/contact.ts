import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { clients } from './client.js';

const dbSchema = pgSchema('dev-factory-hub');

export const contacts = dbSchema.table('contacts', {
  contactId: uuid('contactId').primaryKey(),
  clientId: uuid('clientId')
    .notNull()
    .references(() => clients.clientId),
  name: varchar('name', { length: 500 }).notNull(),
  email: varchar('email', { length: 100 }),
});
