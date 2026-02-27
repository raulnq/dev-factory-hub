import { varchar, pgSchema, uuid, numeric } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const collaborators = dbSchema.table('collaborators', {
  collaboratorId: uuid('collaboratorId').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  email: varchar('email', { length: 100 }),
  withholdingPercentage: numeric('withholdingPercentage', {
    precision: 5,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
