import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listTimesheets,
  getTimesheet,
  addTimesheet,
  listTimesheetProjects,
  addProjectToTimesheet,
  deleteTimesheetProject,
  editWorklog,
  completeTimesheet,
} from './timesheetsClient';
import { useAuth } from '@clerk/clerk-react';
import type {
  AddTimesheet,
  ListTimesheets,
  EditWorklog,
} from '#/features/timesheets/schemas';

export function useTimesheetsSuspense({
  pageNumber,
  pageSize,
  collaboratorId,
}: Partial<ListTimesheets> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    collaboratorId,
  };
  return useSuspenseQuery({
    queryKey: ['timesheets', params],
    queryFn: async () => {
      const token = await getToken();
      return listTimesheets(params, token);
    },
  });
}

export function useTimesheetSuspense(timesheetId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['timesheet', timesheetId],
    queryFn: async () => {
      const token = await getToken();
      return getTimesheet(timesheetId, token);
    },
  });
}

export function useTimesheetProjectsSuspense(timesheetId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['timesheet-projects', timesheetId],
    queryFn: async () => {
      const token = await getToken();
      return listTimesheetProjects(timesheetId, token);
    },
  });
}

export function useAddTimesheet() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddTimesheet) => {
      const token = await getToken();
      return addTimesheet(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
}

export function useAddProjectToTimesheet(timesheetId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken();
      return addProjectToTimesheet(timesheetId, projectId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timesheet-projects', timesheetId],
      });
    },
  });
}

export function useDeleteTimesheetProject(timesheetId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken();
      return deleteTimesheetProject(timesheetId, projectId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timesheet-projects', timesheetId],
      });
    },
  });
}

export function useEditWorklog(timesheetId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      projectId,
      date,
      data,
    }: {
      projectId: string;
      date: string;
      data: EditWorklog;
    }) => {
      const token = await getToken();
      return editWorklog(timesheetId, projectId, date, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timesheet-projects', timesheetId],
      });
    },
  });
}

export function useCompleteTimesheet(timesheetId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return completeTimesheet(timesheetId, token);
    },
    onSuccess: data => {
      queryClient.setQueryData(['timesheet', timesheetId], data);
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
}
