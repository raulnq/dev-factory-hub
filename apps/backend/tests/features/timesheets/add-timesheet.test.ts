import { test, describe } from 'node:test';
import {
  addTimesheet,
  assertTimesheet,
  weekly,
  createCollaborator,
  createRole,
} from './timesheet-dsl.js';
import { createValidationError, validationError } from '../../errors.js';

describe('Add Timesheet Endpoint', () => {
  test('should create a new timesheet with valid data', async () => {
    const collaboratorId = await createCollaborator();
    const collaboratorRoleId = await createRole();
    const input = weekly({ collaboratorId, collaboratorRoleId });
    const item = await addTimesheet(input);
    assertTimesheet(item).hasStatus('Pending');
  });

  describe('Property validations', () => {
    test('should reject invalid collaboratorId UUID', async () => {
      const collaboratorRoleId = await createRole();

      const input = weekly({
        collaboratorId: 'invalid',
        collaboratorRoleId: collaboratorRoleId,
      });
      const expectedError = createValidationError([
        validationError.invalidUuid('collaboratorId'),
      ]);
      await addTimesheet(input, expectedError);
    });

    test('should reject invalid collaboratorRoleId UUID', async () => {
      const collaboratorId = await createCollaborator();

      const input = weekly({
        collaboratorId: collaboratorId,
        collaboratorRoleId: 'invalid',
      });
      const expectedError = createValidationError([
        validationError.invalidUuid('collaboratorRoleId'),
      ]);
      await addTimesheet(input, expectedError);
    });

    test('should reject invalid startDate format', async () => {
      const collaboratorRoleId = await createRole();
      const collaboratorId = await createCollaborator();

      const input = weekly({
        collaboratorId: collaboratorId,
        collaboratorRoleId: collaboratorRoleId,
        startDate: '2021-13-45',
      });
      const expectedError = createValidationError([
        {
          path: 'startDate',
          message: 'Invalid ISO date',
          code: 'invalid_format',
        },
        {
          path: 'endDate',
          message: 'Start date must be before end date',
          code: 'custom',
        },
      ]);
      await addTimesheet(input, expectedError);
    });

    test('should reject startDate after endDate', async () => {
      const collaboratorId = await createCollaborator();
      const collaboratorRoleId = await createRole();
      const input = weekly({
        collaboratorId,
        collaboratorRoleId,
        startDate: '2021-01-10',
        endDate: '2021-01-01',
      });
      const expectedError = createValidationError([
        {
          path: 'endDate',
          message: 'Start date must be before end date',
          code: 'custom',
        },
      ]);
      await addTimesheet(input, expectedError);
    });
  });
});
