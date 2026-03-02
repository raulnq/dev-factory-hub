import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddTimesheet,
  CompleteTimesheet,
  Timesheet,
  ListTimesheets,
  EditWorklog,
  TimesheetProjectWithWorklogs,
  Worklog,
} from '#/features/timesheets/schemas';

export async function listTimesheets(
  params?: ListTimesheets,
  token?: string | null
): Promise<Page<Timesheet>> {
  const response = await client.api.timesheets.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        collaboratorId: params?.collaboratorId,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch timesheets');
  }
  const data = await response.json();
  return {
    ...data,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: data.items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      completedAt: item.completedAt ?? null,
    })),
  };
}

export async function getTimesheet(
  timesheetId: string,
  token?: string | null
): Promise<Timesheet> {
  const response = await client.api.timesheets[':timesheetId'].$get(
    { param: { timesheetId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch timesheet');
  }
  const item = await response.json();
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    completedAt: item.completedAt ?? null,
  };
}

export async function addTimesheet(
  data: AddTimesheet,
  token?: string | null
): Promise<Timesheet> {
  const response = await client.api.timesheets.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add timesheet');
  }
  const item = await response.json();
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    completedAt: item.completedAt ?? null,
  };
}

export async function listTimesheetProjects(
  timesheetId: string,
  token?: string | null
): Promise<TimesheetProjectWithWorklogs[]> {
  const response = await client.api.timesheets[':timesheetId'].projects.$get(
    { param: { timesheetId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch timesheet projects');
  }
  return response.json();
}

export async function addProjectToTimesheet(
  timesheetId: string,
  projectId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].$post(
    { param: { timesheetId, projectId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add project to timesheet');
  }
}

export async function deleteTimesheetProject(
  timesheetId: string,
  projectId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].$delete(
    { param: { timesheetId, projectId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to remove project from timesheet');
  }
}

export async function editWorklog(
  timesheetId: string,
  projectId: string,
  date: string,
  data: EditWorklog,
  token?: string | null
): Promise<Worklog> {
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].worklogs[':date'].$put(
    { param: { timesheetId, projectId, date }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update worklog');
  }
  return response.json();
}

export async function completeTimesheet(
  timesheetId: string,
  data: CompleteTimesheet,
  token?: string | null
): Promise<Timesheet> {
  const response = await client.api.timesheets[':timesheetId'].complete.$post(
    { param: { timesheetId }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to complete timesheet');
  }
  const item = await response.json();
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    completedAt: item.completedAt ?? null,
  };
}
