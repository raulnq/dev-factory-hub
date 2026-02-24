import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

// Client schemas
export const clientSchema = z.object({
  clientId: z.uuidv7(),
  name: z.string().min(1).max(500),
  documentNumber: z.string().max(20).nullable(),
  phone: z.string().max(20).nullable(),
  address: z.string().max(1000).nullable(),
  email: z.string().max(100).nullable(),
});

export type Client = z.infer<typeof clientSchema>;

export const addClientSchema = clientSchema.omit({ clientId: true });
export type AddClient = z.infer<typeof addClientSchema>;

export const editClientSchema = clientSchema.pick({
  name: true,
  documentNumber: true,
  phone: true,
  address: true,
  email: true,
});
export type EditClient = z.infer<typeof editClientSchema>;

export const listClientsSchema = paginationSchema.extend({
  name: z.string().optional(),
});
export type ListClients = z.infer<typeof listClientsSchema>;

// Project schemas
export const projectSchema = z.object({
  projectId: z.uuidv7(),
  clientId: z.uuidv7(),
  name: z.string().min(1).max(500),
});

export type Project = z.infer<typeof projectSchema>;

export const addProjectSchema = projectSchema.omit({
  projectId: true,
  clientId: true,
});
export type AddProject = z.infer<typeof addProjectSchema>;

export const editProjectSchema = projectSchema.pick({ name: true });
export type EditProject = z.infer<typeof editProjectSchema>;

export const listProjectsSchema = paginationSchema;
export type ListProjects = z.infer<typeof listProjectsSchema>;

// Contact schemas
export const contactSchema = z.object({
  contactId: z.uuidv7(),
  clientId: z.uuidv7(),
  name: z.string().min(1).max(500),
  email: z.string().max(100).nullable(),
});

export type Contact = z.infer<typeof contactSchema>;

export const addContactSchema = contactSchema.omit({
  contactId: true,
  clientId: true,
});
export type AddContact = z.infer<typeof addContactSchema>;

export const editContactSchema = contactSchema.pick({
  name: true,
  email: true,
});
export type EditContact = z.infer<typeof editContactSchema>;

export const listContactsSchema = paginationSchema;
export type ListContacts = z.infer<typeof listContactsSchema>;
