import { test, describe } from 'node:test';
import {
  addCollaboratorPayment,
  createCollaborator,
  listCollaboratorPayments,
  paymentInput,
} from './collaborator-payment-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List CollaboratorPayments Endpoint', () => {
  test('should return paginated results', async () => {
    const collaborator = await createCollaborator();
    await addCollaboratorPayment(paymentInput(collaborator.collaboratorId));
    await addCollaboratorPayment(paymentInput(collaborator.collaboratorId));

    const page = await listCollaboratorPayments({
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page).hasItemsCountAtLeast(2);
  });

  test('should filter by collaboratorId', async () => {
    const collaboratorA = await createCollaborator();
    const collaboratorB = await createCollaborator();

    await addCollaboratorPayment(paymentInput(collaboratorA.collaboratorId));
    await addCollaboratorPayment(paymentInput(collaboratorA.collaboratorId));
    await addCollaboratorPayment(paymentInput(collaboratorB.collaboratorId));

    const page = await listCollaboratorPayments({
      pageNumber: 1,
      pageSize: 10,
      collaboratorId: collaboratorA.collaboratorId,
    });

    assertPage(page).hasItemsCountAtLeast(2);
    for (const item of page.items) {
      if (item.collaboratorId !== collaboratorA.collaboratorId) {
        throw new Error(
          `Expected all items to belong to collaborator ${collaboratorA.collaboratorId}, found ${item.collaboratorId}`
        );
      }
    }
  });

  test('should return empty page when collaboratorId has no payments', async () => {
    const collaborator = await createCollaborator();
    const page = await listCollaboratorPayments({
      pageNumber: 1,
      pageSize: 10,
      collaboratorId: collaborator.collaboratorId,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should respect pagination', async () => {
    const collaborator = await createCollaborator();
    await addCollaboratorPayment(paymentInput(collaborator.collaboratorId));
    await addCollaboratorPayment(paymentInput(collaborator.collaboratorId));
    await addCollaboratorPayment(paymentInput(collaborator.collaboratorId));

    const page = await listCollaboratorPayments({
      pageNumber: 1,
      pageSize: 2,
      collaboratorId: collaborator.collaboratorId,
    });

    assertPage(page).hasItemsCount(2);
  });
});
