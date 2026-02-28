import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ListClientPage } from './features/clients/pages/ListClientPage';
import { AddClientPage } from './features/clients/pages/AddClientPage';
import { EditClientPage } from './features/clients/pages/EditClientPage';
import { ListCollaboratorPage } from './features/collaborators/pages/ListCollaboratorPage';
import { AddCollaboratorPage } from './features/collaborators/pages/AddCollaboratorPage';
import { EditCollaboratorPage } from './features/collaborators/pages/EditCollaboratorPage';
import { ViewCollaboratorPage } from './features/collaborators/pages/ViewCollaboratorPage';
import { ListCollaboratorRolePage } from './features/collaborator-roles/pages/ListCollaboratorRolePage';
import { AddCollaboratorRolePage } from './features/collaborator-roles/pages/AddCollaboratorRolePage';
import { EditCollaboratorRolePage } from './features/collaborator-roles/pages/EditCollaboratorRolePage';
import { ViewCollaboratorRolePage } from './features/collaborator-roles/pages/ViewCollaboratorRolePage';
import { ListTimesheetPage } from './features/timesheets/pages/ListTimesheetPage';
import { AddTimesheetPage } from './features/timesheets/pages/AddTimesheetPage';
import { EditTimesheetPage } from './features/timesheets/pages/EditTimesheetPage';

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
      {
        path: 'collaborator-roles',
        children: [
          { index: true, element: <ListCollaboratorRolePage /> },
          { path: 'new', element: <AddCollaboratorRolePage /> },
          {
            path: ':collaboratorRoleId',
            element: <ViewCollaboratorRolePage />,
          },
          {
            path: ':collaboratorRoleId/edit',
            element: <EditCollaboratorRolePage />,
          },
        ],
      },
      {
        path: 'timesheets',
        children: [
          { index: true, element: <ListTimesheetPage /> },
          { path: 'new', element: <AddTimesheetPage /> },
          { path: ':timesheetId/edit', element: <EditTimesheetPage /> },
        ],
      },
    ],
  },
]);
