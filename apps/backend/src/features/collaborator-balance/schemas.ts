import { z } from 'zod';

export const listCollaboratorBalanceSchema = z
  .object({
    currency: z.string().min(1).max(3),
    collaboratorId: z.uuidv7(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    exchangeCurrencyTo: z.string().min(1).max(3).optional(),
  })
  .refine(
    data =>
      !data.exchangeCurrencyTo || data.exchangeCurrencyTo !== data.currency,
    {
      message: 'Exchange currency must differ from currency',
      path: ['exchangeCurrencyTo'],
    }
  );

export type ListCollaboratorBalance = z.infer<
  typeof listCollaboratorBalanceSchema
>;

export const collaboratorBalanceEntrySchema = z.object({
  issuedAt: z.string(),
  type: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  balance: z.number(),
  convertedAmount: z.number().optional(),
  convertedBalance: z.number().optional(),
});

export type CollaboratorBalanceEntry = z.infer<
  typeof collaboratorBalanceEntrySchema
>;

export const collaboratorBalanceSchema = z.object({
  entries: z.array(collaboratorBalanceEntrySchema),
  finalBalance: z.number(),
  finalConvertedBalance: z.number().optional(),
});

export type CollaboratorBalance = z.infer<typeof collaboratorBalanceSchema>;

import { paginationSchema } from '#/pagination.js';

export const collaboratorBalanceSummaryQuerySchema = paginationSchema
  .partial()
  .extend({
    currency: z.string().min(1).max(3).optional(),
    date: z.string().optional(),
    collaboratorId: z.union([z.uuidv7(), z.array(z.uuidv7())]).optional(),
  });

export type CollaboratorBalanceSummaryQuery = z.infer<
  typeof collaboratorBalanceSummaryQuerySchema
>;

export const collaboratorBalanceSummarySchema = z.array(
  z.object({
    collaboratorId: z.string().uuid(),
    collaboratorName: z.string(),
    balances: z.array(
      z.object({
        currency: z.string(),
        balance: z.number(),
      })
    ),
  })
);

export type CollaboratorBalanceSummary = z.infer<
  typeof collaboratorBalanceSummarySchema
>;
