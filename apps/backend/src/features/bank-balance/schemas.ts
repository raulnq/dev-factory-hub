import { z } from 'zod';

export const listBankBalanceSchema = z.object({
  currency: z.string().min(1).max(3),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ListBankBalance = z.infer<typeof listBankBalanceSchema>;

export const bankBalanceEntrySchema = z.object({
  issuedAt: z.string(),
  type: z.string(),
  description: z.string(),
  total: z.number(),
  taxes: z.number(),
  balance: z.number(),
});

export type BankBalanceEntry = z.infer<typeof bankBalanceEntrySchema>;

export const bankBalanceSchema = z.object({
  entries: z.array(bankBalanceEntrySchema),
  finalBalance: z.number(),
});

export type BankBalance = z.infer<typeof bankBalanceSchema>;

import { paginationSchema } from '#/pagination.js';

export const bankBalanceSummaryQuerySchema = paginationSchema.partial().extend({
  date: z.string().optional(),
});

export type BankBalanceSummaryQuery = z.infer<
  typeof bankBalanceSummaryQuerySchema
>;

export const bankBalanceSummarySchema = z.array(
  z.object({
    currency: z.string(),
    balance: z.number(),
  })
);

export type BankBalanceSummary = z.infer<typeof bankBalanceSummarySchema>;
