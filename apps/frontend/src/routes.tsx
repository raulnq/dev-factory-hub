import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListTodoPage } from './features/todos/pages/ListTodoPage';
import { AddTodoPage } from './features/todos/pages/AddTodoPage';
import { EditTodoPage } from './features/todos/pages/EditTodoPage';
import { ViewTodoPage } from './features/todos/pages/ViewTodoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <div>Hello World!!</div> },
      {
        path: 'todos',
        children: [
          { index: true, element: <ListTodoPage /> },
          { path: 'new', element: <AddTodoPage /> },
          { path: ':todoId', element: <ViewTodoPage /> },
          { path: ':todoId/edit', element: <EditTodoPage /> },
        ],
      },
    ],
  },
]);
