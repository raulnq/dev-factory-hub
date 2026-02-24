import { Hono } from 'hono';
import { listRoute } from './list-clients.js';
import { addRoute } from './add-client.js';
import { getRoute } from './get-client.js';
import { editRoute } from './edit-client.js';
import { listProjectsRoute } from './list-projects.js';
import { addProjectRoute } from './add-project.js';
import { editProjectRoute } from './edit-project.js';
import { deleteProjectRoute } from './delete-project.js';
import { listContactsRoute } from './list-contacts.js';
import { addContactRoute } from './add-contact.js';
import { editContactRoute } from './edit-contact.js';
import { deleteContactRoute } from './delete-contact.js';

export const clientRoute = new Hono()
  .basePath('/clients')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', listProjectsRoute)
  .route('/', addProjectRoute)
  .route('/', editProjectRoute)
  .route('/', deleteProjectRoute)
  .route('/', listContactsRoute)
  .route('/', addContactRoute)
  .route('/', editContactRoute)
  .route('/', deleteContactRoute);
