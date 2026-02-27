import { varchar, pgSchema, uuid, numeric } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('dev-factory-hub');

export const collaboratorRoles = dbSchema.table('collaborator_roles', {
  collaboratorRoleId: uuid('collaboratorRoleId').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  feeRate: numeric('feeRate', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  costRate: numeric('costRate', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
