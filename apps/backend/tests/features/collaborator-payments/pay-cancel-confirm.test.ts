import { test, describe } from 'node:test';
import {
  addCollaboratorPayment,
  assertCollaboratorPayment,
  cancelCollaboratorPayment,
  confirmCollaboratorPayment,
  confirmInput,
  createCollaborator,
  payCollaboratorPayment,
  payInput,
  paymentInput,
} from './collaborator-payment-dsl.js';
import { createConflictError, createNotFoundError } from '../../errors.js';
import { v7 } from 'uuid';

describe('Pay CollaboratorPayment', () => {
  test('should transition Pending to Paid and set paidAt', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    const pay = payInput();
    const item = await payCollaboratorPayment(
      created.collaboratorPaymentId,
      pay
    );

    assertCollaboratorPayment(item).hasStatus('Paid').hasPaidAt(pay.paidAt);
  });

  test('should return 409 when already Paid', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    await payCollaboratorPayment(created.collaboratorPaymentId, payInput());

    await payCollaboratorPayment(
      created.collaboratorPaymentId,
      payInput(),
      createConflictError(
        'Cannot pay collaborator payment with status "Paid". Must be "Pending".'
      )
    );
  });

  test('should return 404 when payment does not exist', async () => {
    const nonExistentId = v7();
    await payCollaboratorPayment(
      nonExistentId,
      payInput(),
      createNotFoundError(`CollaboratorPayment ${nonExistentId} not found`)
    );
  });
});

describe('Confirm CollaboratorPayment', () => {
  test('should transition Paid to Confirmed and set confirmedAt and number', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    await payCollaboratorPayment(created.collaboratorPaymentId, payInput());

    const confirm = confirmInput();
    const item = await confirmCollaboratorPayment(
      created.collaboratorPaymentId,
      confirm
    );

    assertCollaboratorPayment(item)
      .hasStatus('Confirmed')
      .hasConfirmedAt(confirm.confirmedAt)
      .hasNumber(confirm.number);
  });

  test('should return 409 when not in Paid status', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );

    await confirmCollaboratorPayment(
      created.collaboratorPaymentId,
      confirmInput(),
      createConflictError(
        'Cannot confirm collaborator payment with status "Pending". Must be "Paid".'
      )
    );
  });

  test('should return 404 when payment does not exist', async () => {
    const nonExistentId = v7();
    await confirmCollaboratorPayment(
      nonExistentId,
      confirmInput(),
      createNotFoundError(`CollaboratorPayment ${nonExistentId} not found`)
    );
  });
});

describe('Cancel CollaboratorPayment', () => {
  test('should cancel a Pending payment and set canceledAt', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    const item = await cancelCollaboratorPayment(created.collaboratorPaymentId);

    assertCollaboratorPayment(item).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should cancel a Paid payment', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    await payCollaboratorPayment(created.collaboratorPaymentId, payInput());

    const item = await cancelCollaboratorPayment(created.collaboratorPaymentId);
    assertCollaboratorPayment(item).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should cancel a Confirmed payment', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    await payCollaboratorPayment(created.collaboratorPaymentId, payInput());
    await confirmCollaboratorPayment(
      created.collaboratorPaymentId,
      confirmInput()
    );

    const item = await cancelCollaboratorPayment(created.collaboratorPaymentId);
    assertCollaboratorPayment(item).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should return 409 when already Canceled', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorPayment(
      paymentInput(collaborator.collaboratorId)
    );
    await cancelCollaboratorPayment(created.collaboratorPaymentId);

    await cancelCollaboratorPayment(
      created.collaboratorPaymentId,
      createConflictError(
        'Cannot cancel collaborator payment with status "Canceled". Already canceled.'
      )
    );
  });

  test('should return 404 when payment does not exist', async () => {
    const nonExistentId = v7();
    await cancelCollaboratorPayment(
      nonExistentId,
      createNotFoundError(`CollaboratorPayment ${nonExistentId} not found`)
    );
  });
});
