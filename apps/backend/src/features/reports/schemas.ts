import { z } from 'zod';

export const sendMonthlyStatementSchema = z.object({
  fromEmail: z.string().email(),
  toEmail: z.string().email(),
  ccEmails: z.array(z.string().email()),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export type SendMonthlyStatement = z.infer<typeof sendMonthlyStatementSchema>;

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
