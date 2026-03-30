import { z } from 'zod';
import { paginationSchema } from '#/pagination.js';

export const listClientBalanceSchema = z.object({
  currency: z.string().min(1).max(3),
  clientId: z.uuidv7(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ListClientBalance = z.infer<typeof listClientBalanceSchema>;

export const clientBalanceEntrySchema = z.object({
  issuedAt: z.string(),
  type: z.enum(['Income', 'Outcome']),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  balance: z.number(),
});

export type ClientBalanceEntry = z.infer<typeof clientBalanceEntrySchema>;

export const clientBalanceSchema = z.object({
  entries: z.array(clientBalanceEntrySchema),
  finalBalance: z.number(),
});

export type ClientBalance = z.infer<typeof clientBalanceSchema>;

export const clientBalanceSummaryQuerySchema = paginationSchema
  .partial()
  .extend({
    currency: z.string().min(1).max(3).optional(),
    date: z.string().optional(),
    clientId: z.union([z.uuidv7(), z.array(z.uuidv7())]).optional(),
  });

export type ClientBalanceSummaryQuery = z.infer<
  typeof clientBalanceSummaryQuerySchema
>;

export const clientBalanceSummarySchema = z.array(
  z.object({
    clientId: z.string().uuid(),
    clientName: z.string(),
    balances: z.array(
      z.object({
        currency: z.string(),
        balance: z.number(),
      })
    ),
  })
);

export type ClientBalanceSummary = z.infer<typeof clientBalanceSummarySchema>;
