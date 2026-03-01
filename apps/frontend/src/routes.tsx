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
import { ListProformaPage } from './features/proformas/pages/ListProformaPage';
import { AddProformaPage } from './features/proformas/pages/AddProformaPage';
import { EditProformaPage } from './features/proformas/pages/EditProformaPage';
import { ListCollaboratorPaymentPage } from './features/collaborator-payments/pages/ListCollaboratorPaymentPage';
import { AddCollaboratorPaymentPage } from './features/collaborator-payments/pages/AddCollaboratorPaymentPage';
import { EditCollaboratorPaymentPage } from './features/collaborator-payments/pages/EditCollaboratorPaymentPage';
import { ListCollectionPage } from './features/collections/pages/ListCollectionPage';
import { AddCollectionPage } from './features/collections/pages/AddCollectionPage';
import { EditCollectionPage } from './features/collections/pages/EditCollectionPage';
import { ListInvoicePage } from './features/invoices/pages/ListInvoicePage';
import { AddInvoicePage } from './features/invoices/pages/AddInvoicePage';
import { EditInvoicePage } from './features/invoices/pages/EditInvoicePage';
import { ListTransactionPage } from './features/transactions/pages/ListTransactionPage';
import { AddTransactionPage } from './features/transactions/pages/AddTransactionPage';
import { EditTransactionPage } from './features/transactions/pages/EditTransactionPage';
import { ListMoneyExchangePage } from './features/money-exchanges/pages/ListMoneyExchangePage';
import { AddMoneyExchangePage } from './features/money-exchanges/pages/AddMoneyExchangePage';
import { EditMoneyExchangePage } from './features/money-exchanges/pages/EditMoneyExchangePage';
import { ListPayrollPaymentPage } from './features/payroll-payments/pages/ListPayrollPaymentPage';
import { AddPayrollPaymentPage } from './features/payroll-payments/pages/AddPayrollPaymentPage';
import { EditPayrollPaymentPage } from './features/payroll-payments/pages/EditPayrollPaymentPage';

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
      {
        path: 'proformas',
        children: [
          { index: true, element: <ListProformaPage /> },
          { path: 'new', element: <AddProformaPage /> },
          { path: ':proformaId/edit', element: <EditProformaPage /> },
        ],
      },
      {
        path: 'collaborator-payments',
        children: [
          { index: true, element: <ListCollaboratorPaymentPage /> },
          { path: 'new', element: <AddCollaboratorPaymentPage /> },
          {
            path: ':collaboratorPaymentId/edit',
            element: <EditCollaboratorPaymentPage />,
          },
        ],
      },
      {
        path: 'collections',
        children: [
          { index: true, element: <ListCollectionPage /> },
          { path: 'new', element: <AddCollectionPage /> },
          { path: ':collectionId/edit', element: <EditCollectionPage /> },
        ],
      },
      {
        path: 'invoices',
        children: [
          { index: true, element: <ListInvoicePage /> },
          { path: 'new', element: <AddInvoicePage /> },
          { path: ':invoiceId/edit', element: <EditInvoicePage /> },
        ],
      },
      {
        path: 'transactions',
        children: [
          { index: true, element: <ListTransactionPage /> },
          { path: 'new', element: <AddTransactionPage /> },
          { path: ':transactionId/edit', element: <EditTransactionPage /> },
        ],
      },
      {
        path: 'money-exchanges',
        children: [
          { index: true, element: <ListMoneyExchangePage /> },
          { path: 'new', element: <AddMoneyExchangePage /> },
          { path: ':moneyExchangeId/edit', element: <EditMoneyExchangePage /> },
        ],
      },
      {
        path: 'payroll-payments',
        children: [
          { index: true, element: <ListPayrollPaymentPage /> },
          { path: 'new', element: <AddPayrollPaymentPage /> },
          {
            path: ':payrollPaymentId/edit',
            element: <EditPayrollPaymentPage />,
          },
        ],
      },
    ],
  },
]);
