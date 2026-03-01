import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const transactionSchema = z.object({
  transactionId: z.uuidv7(),
  description: z.string().min(1).max(1000),
  currency: z.string().length(3),
  type: z.string().min(1).max(20),
  total: z.number().min(0),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
  status: z.string().max(25),
  issuedAt: z.string().nullable(),
  createdAt: z.date(),
  canceledAt: z.date().nullable(),
  filePath: z.string().max(500).nullable(),
  number: z.string().max(20).nullable(),
  contentType: z.string().max(100).nullable(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const addTransactionSchema = z.object({
  description: z.string().min(1).max(1000),
  currency: z.string().length(3),
  type: z.string().min(1).max(20),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
});

export type AddTransaction = z.infer<typeof addTransactionSchema>;

export const editTransactionSchema = z.object({
  description: z.string().min(1).max(1000),
  currency: z.string().length(3),
  type: z.string().min(1).max(20),
  subtotal: z.number().min(0),
  taxes: z.number().min(0),
});

export type EditTransaction = z.infer<typeof editTransactionSchema>;

export const issueTransactionSchema = z.object({
  issuedAt: z.iso.date(),
  number: z.string().min(1).max(20),
});

export type IssueTransaction = z.infer<typeof issueTransactionSchema>;

export const listTransactionsSchema = paginationSchema.extend({
  type: z.string().optional(),
  description: z.string().optional(),
});

export type ListTransactions = z.infer<typeof listTransactionsSchema>;

export const downloadUrlResponseSchema = z.object({
  url: z.string(),
  expiresIn: z.number(),
});

export type DownloadUrlResponse = z.infer<typeof downloadUrlResponseSchema>;
