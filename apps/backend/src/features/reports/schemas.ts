import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const sendMonthlyStatementSchema = z.object({
  fromEmail: z.string().email(),
  toEmail: z.string().email(),
  ccEmails: z.array(z.string().email()),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export type SendMonthlyStatement = z.infer<typeof sendMonthlyStatementSchema>;

export const monthlyStatementResponseSchema = z.object({
  sent: z.boolean(),
  attachmentCount: z.number().int(),
});

export type MonthlyStatementResponse = z.infer<
  typeof monthlyStatementResponseSchema
>;

export const documentTypeSchema = z.enum([
  'collections',
  'transactions',
  'money-exchanges',
  'payroll-payments',
]);

export type DocumentType = z.infer<typeof documentTypeSchema>;

export const sendYearlyStatementSchema = z.object({
  fromEmail: z.string().email(),
  toEmail: z.string().email(),
  ccEmails: z.array(z.string().email()),
  type: documentTypeSchema,
  year: z.number().int().min(2000).max(2100),
});

export type SendYearlyStatement = z.infer<typeof sendYearlyStatementSchema>;

export const documentStatusTypeSchema = z.enum([
  'Collection',
  'Transaction',
  'MoneyExchange',
  'PayrollPayment',
]);

export const documentStatusItemSchema = z.object({
  documentType: documentStatusTypeSchema,
  entityId: z.uuidv7(),
  entityDate: z.string(),
  status: z.string(),
  hasDocument: z.boolean(),
});

export type DocumentStatusItem = z.infer<typeof documentStatusItemSchema>;

export const listDocumentStatusSchema = paginationSchema.extend({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export type ListDocumentStatus = z.infer<typeof listDocumentStatusSchema>;
