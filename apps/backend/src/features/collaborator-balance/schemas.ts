import { z } from 'zod';

export const listCollaboratorBalanceSchema = z.object({
  currency: z.string().min(1).max(3),
  collaboratorId: z.uuidv7(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ListCollaboratorBalance = z.infer<
  typeof listCollaboratorBalanceSchema
>;

export const collaboratorBalanceEntrySchema = z.object({
  issuedAt: z.string(),
  type: z.enum(['Income', 'Outcome']),
  name: z.string(),
  description: z.string(),
  amount: z.number(),
  balance: z.number(),
});

export type CollaboratorBalanceEntry = z.infer<
  typeof collaboratorBalanceEntrySchema
>;

export const collaboratorBalanceSchema = z.object({
  entries: z.array(collaboratorBalanceEntrySchema),
  finalBalance: z.number(),
});

export type CollaboratorBalance = z.infer<typeof collaboratorBalanceSchema>;
