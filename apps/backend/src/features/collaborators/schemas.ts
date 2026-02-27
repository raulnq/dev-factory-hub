import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const collaboratorSchema = z.object({
  collaboratorId: z.uuidv7(),
  name: z.string().min(1).max(500),
  email: z.string().max(100).nullable(),
  withholdingPercentage: z.number().min(0).max(100),
});

export type Collaborator = z.infer<typeof collaboratorSchema>;

export const addCollaboratorSchema = collaboratorSchema.omit({
  collaboratorId: true,
});
export type AddCollaborator = z.infer<typeof addCollaboratorSchema>;

export const editCollaboratorSchema = collaboratorSchema.omit({
  collaboratorId: true,
});
export type EditCollaborator = z.infer<typeof editCollaboratorSchema>;

export const listCollaboratorsSchema = paginationSchema.extend({
  name: z.string().optional(),
});
export type ListCollaborators = z.infer<typeof listCollaboratorsSchema>;
