import { varchar, pgSchema, uuid } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const clients = dbSchema.table('clients', {
  clientId: uuid('clientId').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  documentNumber: varchar('documentNumber', { length: 20 }),
  phone: varchar('phone', { length: 20 }),
  address: varchar('address', { length: 1000 }),
  email: varchar('email', { length: 100 }),
});
