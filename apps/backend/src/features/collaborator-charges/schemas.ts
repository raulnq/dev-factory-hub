import { z } from 'zod';
import { paginationSchema } from '#/pagination.js';

export const collaboratorChargeSchema = z.object({
  collaboratorChargeId: z.uuidv7(),
  collaboratorId: z.uuidv7(),
  collaboratorName: z.string().optional(),
  description: z.string().min(1).max(2000),
  amount: z.number(),
  currency: z.string().length(3),
  status: z.string().max(25),
  issuedAt: z.iso.date().nullable(),
  canceledAt: z.date().nullable(),
  createdAt: z.date(),
});

export const addCollaboratorChargeSchema = z.object({
  collaboratorId: z.uuidv7(),
  description: z.string().min(1).max(2000),
  amount: z.number(),
  currency: z.string().length(3),
});

export const editCollaboratorChargeSchema = z.object({
  description: z.string().min(1).max(2000),
  amount: z.number(),
  currency: z.string().length(3),
});

export const payCollaboratorChargeSchema = z.object({
  issuedAt: z.iso.date(),
});

export const listCollaboratorChargesSchema = paginationSchema.extend({
  collaboratorId: z.uuidv7().optional(),
});

export type CollaboratorCharge = z.infer<typeof collaboratorChargeSchema>;
export type AddCollaboratorCharge = z.infer<typeof addCollaboratorChargeSchema>;
export type EditCollaboratorCharge = z.infer<
  typeof editCollaboratorChargeSchema
>;
export type PayCollaboratorCharge = z.infer<typeof payCollaboratorChargeSchema>;
export type ListCollaboratorCharges = z.infer<
  typeof listCollaboratorChargesSchema
>;
