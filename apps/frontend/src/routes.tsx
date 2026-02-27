import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListClientPage } from './features/clients/pages/ListClientPage';
import { AddClientPage } from './features/clients/pages/AddClientPage';
import { EditClientPage } from './features/clients/pages/EditClientPage';
import { ListCollaboratorPage } from './features/collaborators/pages/ListCollaboratorPage';
import { AddCollaboratorPage } from './features/collaborators/pages/AddCollaboratorPage';
import { EditCollaboratorPage } from './features/collaborators/pages/EditCollaboratorPage';
import { ViewCollaboratorPage } from './features/collaborators/pages/ViewCollaboratorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <div>Hello World!!</div> },
      {
        path: 'clients',
        children: [
          { index: true, element: <ListClientPage /> },
          { path: 'new', element: <AddClientPage /> },
          { path: ':clientId/edit', element: <EditClientPage /> },
        ],
      },
      {
        path: 'collaborators',
        children: [
          { index: true, element: <ListCollaboratorPage /> },
          { path: 'new', element: <AddCollaboratorPage /> },
          { path: ':collaboratorId', element: <ViewCollaboratorPage /> },
          { path: ':collaboratorId/edit', element: <EditCollaboratorPage /> },
        ],
      },
    ],
  },
]);
