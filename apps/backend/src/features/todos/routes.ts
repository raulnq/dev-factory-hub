import { Hono } from 'hono';
import { listRoute } from './list-todos.js';
import { addRoute } from './add-todo.js';
import { getRoute } from './get-todo.js';
import { editRoute } from './edit-todo.js';

export const todoRoute = new Hono()
  .basePath('/todos')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
