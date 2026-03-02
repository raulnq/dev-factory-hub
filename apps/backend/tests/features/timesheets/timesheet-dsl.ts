import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddTimesheet,
  CompleteTimesheet,
  Timesheet,
  ListTimesheets,
  EditWorklog,
  TimesheetProjectWithWorklogs,
  Worklog,
} from '#/features/timesheets/schemas.js';
import { alice, addCollaborator } from '../collaborators/collaborator-dsl.js';
import {
  junior,
  addCollaboratorRole,
} from '../collaborator-roles/collaborator-role-dsl.js';

// --- Dependency Helpers ---

export async function createCollaborator() {
  const item = await addCollaborator(alice());
  return item.collaboratorId;
}

export async function createRole() {
  const item = await addCollaboratorRole(junior());
  return item.collaboratorRoleId;
}

// --- Factory functions ---

export const weekly = (overrides?: Partial<AddTimesheet>): AddTimesheet => {
  return {
    collaboratorId: faker.string.uuid(),
    collaboratorRoleId: faker.string.uuid(),
    startDate: '2021-01-01',
    endDate: '2021-01-07',
    ...overrides,
  } as AddTimesheet;
};

// --- Action functions ---

export async function addTimesheet(input: AddTimesheet): Promise<Timesheet>;
export async function addTimesheet(
  input: AddTimesheet,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addTimesheet(
  input: AddTimesheet,
  expectedProblemDocument?: ProblemDocument
): Promise<Timesheet | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(!expectedProblemDocument, 'Expected error but got CREATED');
    const item = await response.json();
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      completedAt: item.completedAt ?? null,
    };
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function getTimesheet(timesheetId: string): Promise<Timesheet>;
export async function getTimesheet(
  timesheetId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getTimesheet(
  timesheetId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Timesheet | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].$get({
    param: { timesheetId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(!expectedProblemDocument, 'Expected error but got OK');
    const item = await response.json();
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      completedAt: item.completedAt ?? null,
    };
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected OK but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function addProjectToTimesheet(
  timesheetId: string,
  projectId: string
): Promise<void>;
export async function addProjectToTimesheet(
  timesheetId: string,
  projectId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addProjectToTimesheet(
  timesheetId: string,
  projectId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].$post({
    param: { timesheetId, projectId },
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(!expectedProblemDocument, 'Expected error but got CREATED');
    return;
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function listTimesheetProjects(
  timesheetId: string
): Promise<TimesheetProjectWithWorklogs[]>;
export async function listTimesheetProjects(
  timesheetId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listTimesheetProjects(
  timesheetId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<TimesheetProjectWithWorklogs[] | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].projects.$get({
    param: { timesheetId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(!expectedProblemDocument, 'Expected error but got OK');
    return await response.json();
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected OK but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function deleteTimesheetProject(
  timesheetId: string,
  projectId: string
): Promise<void>;
export async function deleteTimesheetProject(
  timesheetId: string,
  projectId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function deleteTimesheetProject(
  timesheetId: string,
  projectId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].$delete({
    param: { timesheetId, projectId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(!expectedProblemDocument, 'Expected error but got NO_CONTENT');
    return;
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function editWorklog(
  timesheetId: string,
  projectId: string,
  date: string,
  input: EditWorklog
): Promise<Worklog>;
export async function editWorklog(
  timesheetId: string,
  projectId: string,
  date: string,
  input: EditWorklog,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editWorklog(
  timesheetId: string,
  projectId: string,
  date: string,
  input: EditWorklog,
  expectedProblemDocument?: ProblemDocument
): Promise<Worklog | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].projects[
    ':projectId'
  ].worklogs[':date'].$put({
    param: { timesheetId, projectId, date },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(!expectedProblemDocument, 'Expected error but got OK');
    return await response.json();
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected OK but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function completeTimesheet(
  timesheetId: string,
  input: CompleteTimesheet
): Promise<Timesheet>;
export async function completeTimesheet(
  timesheetId: string,
  input: CompleteTimesheet,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function completeTimesheet(
  timesheetId: string,
  input: CompleteTimesheet,
  expectedProblemDocument?: ProblemDocument
): Promise<Timesheet | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets[':timesheetId'].complete.$post({
    param: { timesheetId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(!expectedProblemDocument, 'Expected error but got OK');
    const item = await response.json();
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      completedAt: item.completedAt ?? null,
    };
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected OK but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

export async function listTimesheets(
  params: ListTimesheets
): Promise<Page<Timesheet>>;
export async function listTimesheets(
  params: ListTimesheets,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function listTimesheets(
  params: ListTimesheets,
  expectedProblemDocument?: ProblemDocument
): Promise<Page<Timesheet> | ProblemDocument> {
  const client = testClient(app);
  const response = await client.api.timesheets.$get({
    query: {
      pageNumber: params.pageNumber?.toString(),
      pageSize: params.pageSize?.toString(),
      collaboratorId: params.collaboratorId,
    },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(!expectedProblemDocument, 'Expected error but got OK');
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
  } else {
    const problem = await response.json();
    assert.ok(
      expectedProblemDocument,
      `Expected OK but got ${response.status}`
    );
    assertStrictEqualProblemDocument(problem, expectedProblemDocument);
    return problem;
  }
}

// --- Fluent assertion builder ---

export const assertTimesheet = (item: Timesheet) => {
  return {
    hasStatus(expected: string) {
      assert.strictEqual(item.status, expected);
      return this;
    },
    isCompleted() {
      assert.strictEqual(item.status, 'Completed');
      assert.ok(item.completedAt);
      return this;
    },
    hasCompletedAt(expected: string) {
      assert.strictEqual(item.completedAt, expected);
      return this;
    },
    hasCollaboratorName(expected: string) {
      assert.strictEqual(item.collaboratorName, expected);
      return this;
    },
    hasCollaboratorRoleName(expected: string) {
      assert.strictEqual(item.collaboratorRoleName, expected);
      return this;
    },
  };
};
