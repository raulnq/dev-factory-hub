import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddClient,
  EditClient,
  Client,
  ListClients,
  AddProject,
  EditProject,
  Project,
  AddContact,
  EditContact,
  Contact,
} from '#/features/clients/schemas';

export async function listClients(
  params?: ListClients,
  token?: string | null
): Promise<Page<Client>> {
  const response = await client.api.clients.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch clients');
  }
  return response.json();
}

export async function getClient(
  clientId: string,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients[':clientId'].$get(
    { param: { clientId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch client');
  }
  return response.json();
}

export async function addClient(
  data: AddClient,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add client');
  }
  return response.json();
}

export async function editClient(
  clientId: string,
  data: EditClient,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients[':clientId'].$put(
    { param: { clientId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update client');
  }
  return response.json();
}

export async function listProjects(
  clientId: string,
  pageNumber: number,
  pageSize: number,
  token?: string | null
): Promise<Page<Project>> {
  const response = await client.api.clients[':clientId'].projects.$get(
    {
      param: { clientId },
      query: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch projects');
  }
  return response.json();
}

export async function addProject(
  clientId: string,
  data: AddProject,
  token?: string | null
): Promise<Project> {
  const response = await client.api.clients[':clientId'].projects.$post(
    { param: { clientId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add project');
  }
  return response.json();
}

export async function editProject(
  clientId: string,
  projectId: string,
  data: EditProject,
  token?: string | null
): Promise<Project> {
  const response = await client.api.clients[':clientId'].projects[
    ':projectId'
  ].$put(
    { param: { clientId, projectId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update project');
  }
  return response.json();
}

export async function deleteProject(
  clientId: string,
  projectId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.clients[':clientId'].projects[
    ':projectId'
  ].$delete(
    { param: { clientId, projectId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete project');
  }
}

export async function listContacts(
  clientId: string,
  pageNumber: number,
  pageSize: number,
  token?: string | null
): Promise<Page<Contact>> {
  const response = await client.api.clients[':clientId'].contacts.$get(
    {
      param: { clientId },
      query: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch contacts');
  }
  return response.json();
}

export async function addContact(
  clientId: string,
  data: AddContact,
  token?: string | null
): Promise<Contact> {
  const response = await client.api.clients[':clientId'].contacts.$post(
    { param: { clientId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add contact');
  }
  return response.json();
}

export async function editContact(
  clientId: string,
  contactId: string,
  data: EditContact,
  token?: string | null
): Promise<Contact> {
  const response = await client.api.clients[':clientId'].contacts[
    ':contactId'
  ].$put(
    { param: { clientId, contactId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update contact');
  }
  return response.json();
}

export async function deleteContact(
  clientId: string,
  contactId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.clients[':clientId'].contacts[
    ':contactId'
  ].$delete(
    { param: { clientId, contactId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete contact');
  }
}
