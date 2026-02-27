import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const collaboratorRoleSchema = z.object({
  collaboratorRoleId: z.uuidv7(),
  name: z.string().min(1).max(500),
  currency: z.string().length(3),
  feeRate: z.number().nonnegative(),
  costRate: z.number().nonnegative(),
});

export type CollaboratorRole = z.infer<typeof collaboratorRoleSchema>;

export const addCollaboratorRoleSchema = collaboratorRoleSchema.omit({
  collaboratorRoleId: true,
});
export type AddCollaboratorRole = z.infer<typeof addCollaboratorRoleSchema>;

export const editCollaboratorRoleSchema = collaboratorRoleSchema.omit({
  collaboratorRoleId: true,
});
export type EditCollaboratorRole = z.infer<typeof editCollaboratorRoleSchema>;

export const listCollaboratorRolesSchema = paginationSchema.extend({
  name: z.string().optional(),
});
export type ListCollaboratorRoles = z.infer<typeof listCollaboratorRolesSchema>;
