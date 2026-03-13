import { describe, test } from 'node:test';
import assert from 'node:assert';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { ProblemDocument } from 'http-problem-details';
import {
  addCollaboratorCharge,
  getCollaboratorCharge,
  listCollaboratorCharges,
  editCollaboratorCharge,
  payCollaboratorCharge,
  cancelCollaboratorCharge,
  createCollaborator,
  chargeInput,
  editChargeInput,
  payInput,
  assertCollaboratorCharge,
} from './collaborator-charge-dsl.js';

describe('Collaborator Charges', () => {
  test('should create a collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const input = chargeInput(collaborator.collaboratorId);
    const charge = await addCollaboratorCharge(input);

    assertCollaboratorCharge(charge)
      .hasStatus('Pending')
      .hasDescription(input.description)
      .hasAmount(input.amount)
      .hasCurrency(input.currency)
      .hasCollaboratorName(collaborator.name);
  });

  test('should create a collaborator charge with negative amount', async () => {
    const collaborator = await createCollaborator();
    const input = chargeInput(collaborator.collaboratorId, { amount: -50 });
    const charge = await addCollaboratorCharge(input);

    assertCollaboratorCharge(charge).hasStatus('Pending').hasAmount(-50);
  });

  test('should return 404 when creating for non-existent collaborator', async () => {
    const nonExistentId = v7();
    const input = chargeInput(nonExistentId);
    await addCollaboratorCharge(
      input,
      new ProblemDocument({
        status: StatusCodes.NOT_FOUND,
        detail: `Collaborator ${nonExistentId} not found`,
      })
    );
  });

  test('should get a collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    const charge = await getCollaboratorCharge(created.collaboratorChargeId);

    assert.strictEqual(
      charge.collaboratorChargeId,
      created.collaboratorChargeId
    );
    assertCollaboratorCharge(charge).hasCollaboratorName(collaborator.name);
  });

  test('should return 404 when getting non-existent charge', async () => {
    const nonExistentId = v7();
    await getCollaboratorCharge(
      nonExistentId,
      new ProblemDocument({
        status: StatusCodes.NOT_FOUND,
        detail: `Collaborator Charge ${nonExistentId} not found`,
      })
    );
  });

  test('should edit a collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    const input = editChargeInput();
    const charge = await editCollaboratorCharge(
      created.collaboratorChargeId,
      input
    );

    assertCollaboratorCharge(charge)
      .hasDescription(input.description)
      .hasAmount(input.amount)
      .hasCurrency(input.currency);
  });

  test('should list collaborator charges', async () => {
    const collaborator = await createCollaborator();
    await addCollaboratorCharge(chargeInput(collaborator.collaboratorId));
    await addCollaboratorCharge(chargeInput(collaborator.collaboratorId));

    const page = await listCollaboratorCharges({
      collaboratorId: collaborator.collaboratorId,
      pageNumber: 1,
      pageSize: 10,
    });
    assert.strictEqual(page.items.length, 2);
    page.items.forEach(item => {
      assert.strictEqual(item.collaboratorId, collaborator.collaboratorId);
    });
  });

  test('should pay a collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    const input = payInput();
    const charge = await payCollaboratorCharge(
      created.collaboratorChargeId,
      input
    );

    assertCollaboratorCharge(charge)
      .hasStatus('Issued')
      .hasIssuedAt(input.issuedAt);
  });

  test('should return conflict when paying a non-pending charge', async () => {
    const collaborator = await createCollaborator();
    const charge = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    await payCollaboratorCharge(charge.collaboratorChargeId, payInput());

    await payCollaboratorCharge(
      charge.collaboratorChargeId,
      payInput(),
      new ProblemDocument({
        status: StatusCodes.CONFLICT,
        detail:
          'Cannot issue collaborator charge with status "Issued". Must be "Pending".',
      })
    );
  });

  test('should cancel a pending collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const created = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    const charge = await cancelCollaboratorCharge(created.collaboratorChargeId);

    assertCollaboratorCharge(charge).hasStatus('Canceled').hasCanceledAt(true);
  });

  test('should cancel an issued collaborator charge', async () => {
    const collaborator = await createCollaborator();
    const charge = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    await payCollaboratorCharge(charge.collaboratorChargeId, payInput());

    const canceled = await cancelCollaboratorCharge(
      charge.collaboratorChargeId
    );
    assertCollaboratorCharge(canceled)
      .hasStatus('Canceled')
      .hasCanceledAt(true);
  });

  test('should return conflict when canceling an already canceled charge', async () => {
    const collaborator = await createCollaborator();
    const charge = await addCollaboratorCharge(
      chargeInput(collaborator.collaboratorId)
    );
    await cancelCollaboratorCharge(charge.collaboratorChargeId);

    await cancelCollaboratorCharge(
      charge.collaboratorChargeId,
      new ProblemDocument({
        status: StatusCodes.CONFLICT,
        detail:
          'Cannot cancel collaborator charge with status "Canceled". Already canceled.',
      })
    );
  });
});
