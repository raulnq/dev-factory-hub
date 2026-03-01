import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddCollection,
  Collection,
  ConfirmCollection,
  EditCollection,
  ListCollections,
  DownloadUrlResponse,
} from '#/features/collections/schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCollection(data: any): Collection {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    canceledAt: data.canceledAt ? new Date(data.canceledAt) : null,
  };
}

export async function listCollections(
  params?: Partial<ListCollections>,
  token?: string | null
): Promise<Page<Collection>> {
  const response = await client.api.collections.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        clientId: params?.clientId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch collections'
    );
  }
  const page = await response.json();
  return {
    ...page,
    items: page.items.map(mapCollection),
  };
}

export async function getCollection(
  collectionId: string,
  token?: string | null
): Promise<Collection> {
  const response = await client.api.collections[':collectionId'].$get(
    { param: { collectionId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch collection'
    );
  }
  const data = await response.json();
  return mapCollection(data);
}

export async function addCollection(
  data: AddCollection,
  token?: string | null
): Promise<Collection> {
  const response = await client.api.collections.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to add collection'
    );
  }
  const result = await response.json();
  return mapCollection(result);
}

export async function editCollection(
  collectionId: string,
  data: EditCollection,
  token?: string | null
): Promise<Collection> {
  const response = await client.api.collections[':collectionId'].$put(
    { param: { collectionId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to update collection'
    );
  }
  const result = await response.json();
  return mapCollection(result);
}

export async function confirmCollection(
  collectionId: string,
  data: ConfirmCollection,
  token?: string | null
): Promise<Collection> {
  const response = await client.api.collections[':collectionId'].confirm.$post(
    { param: { collectionId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to confirm collection'
    );
  }
  const result = await response.json();
  return mapCollection(result);
}

export async function cancelCollection(
  collectionId: string,
  token?: string | null
): Promise<Collection> {
  const response = await client.api.collections[':collectionId'].cancel.$post(
    { param: { collectionId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to cancel collection'
    );
  }
  const result = await response.json();
  return mapCollection(result);
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function uploadCollectionFile(
  collectionId: string,
  file: File,
  token?: string | null
): Promise<Collection> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(
    `${API_BASE_URL}/api/collections/${collectionId}/upload`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to upload file'
    );
  }
  const result = await response.json();
  return mapCollection(result);
}

export async function getCollectionDownloadUrl(
  collectionId: string,
  token?: string | null
): Promise<DownloadUrlResponse> {
  const response = await client.api.collections[':collectionId'][
    'download-url'
  ].$get(
    { param: { collectionId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to get download URL'
    );
  }
  return response.json();
}
