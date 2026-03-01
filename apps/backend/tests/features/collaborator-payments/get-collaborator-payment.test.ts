import { test, describe } from 'node:test';
import {
  addCollaboratorPayment,
  assertCollaboratorPayment,
  createCollaborator,
  getCollaboratorPayment,
  paymentInput,
} from './collaborator-payment-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';
import { v7 } from 'uuid';

describe('Get CollaboratorPayment Endpoint', () => {
  test('should return an existing payment with collaborator name', async () => {
    const collaborator = await createCollaborator(10);
    const input = paymentInput(collaborator.collaboratorId, {
      grossSalary: 500,
    });
    const created = await addCollaboratorPayment(input);
    const item = await getCollaboratorPayment(created.collaboratorPaymentId);

    assertCollaboratorPayment(item)
      .hasStatus('Pending')
      .hasCurrency('USD')
      .hasGrossSalary(500)
      .hasWithholding(50)
      .hasNetSalary(450)
      .hasCollaboratorName(collaborator.name);
  });

  test('should return 404 for non-existent payment', async () => {
    const nonExistentId = v7();
    await getCollaboratorPayment(
      nonExistentId,
      createNotFoundError(`CollaboratorPayment ${nonExistentId} not found`)
    );
  });

  test('should return 422 for invalid UUID', async () => {
    await getCollaboratorPayment(
      'not-a-uuid',
      createValidationError([
        validationError.invalidUuid('collaboratorPaymentId'),
      ])
    );
  });
});
