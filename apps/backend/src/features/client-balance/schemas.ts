import { z } from 'zod';

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
