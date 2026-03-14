import { describe, test } from 'node:test';
import assert from 'node:assert';
import { createValidationError } from '../../errors.js';
import { getCollaboratorBalanceSummary } from './collaborator-balance-dsl.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';
import {
  addCollaboratorPayment,
  payCollaboratorPayment,
  paymentInput,
  payInput,
} from '../collaborator-payments/collaborator-payment-dsl.js';
import {
  addCollaboratorCharge,
  payCollaboratorCharge,
  chargeInput,
  payInput as payChargeInput,
} from '../collaborator-charges/collaborator-charge-dsl.js';

describe('GET /collaborator-balance/summary', () => {
  test('returns summary for all collaborators when no filters provided', async () => {
    const c1 = await addCollaborator(alice({ name: 'Collab 1' }));
    const c2 = await addCollaborator(alice({ name: 'Collab 2' }));

    // Income for C1
    const charge1 = await addCollaboratorCharge(
      chargeInput(c1.collaboratorId, {
        currency: 'USD',
        amount: 500,
        description: 'Bonus',
      })
    );
    await payCollaboratorCharge(
      charge1.collaboratorChargeId,
      payChargeInput({ issuedAt: '2024-01-01' })
    );

    // Outcome for C2
    const payment2 = await addCollaboratorPayment(
      paymentInput(c2.collaboratorId, {
        currency: 'USD',
        grossSalary: 200,
      })
    );
    await payCollaboratorPayment(
      payment2.collaboratorPaymentId,
      payInput({ paidAt: '2024-01-02' })
    );

    const summary = await getCollaboratorBalanceSummary({
      collaboratorId: [c1.collaboratorId, c2.collaboratorId],
    });

    const s1 = summary.items.find(s => s.collaboratorId === c1.collaboratorId);
    const s2 = summary.items.find(s => s.collaboratorId === c2.collaboratorId);

    assert.ok(s1, 'Summary for C1 not found');
    assert.ok(s2, 'Summary for C2 not found');

    const b1 = s1.balances.find(b => b.currency === 'USD');
    const b2 = s2.balances.find(b => b.currency === 'USD');

    assert.strictEqual(b1?.balance, 500);
    assert.strictEqual(b2?.balance, -200);
  });

  test('filters by collaboratorId array', async () => {
    const c1 = await addCollaborator(alice({ name: 'Collab 1' }));
    await addCollaborator(alice({ name: 'Collab 2' }));

    const summary = await getCollaboratorBalanceSummary({
      collaboratorId: [c1.collaboratorId],
    });

    assert.ok(
      summary.items.every(s => s.collaboratorId === c1.collaboratorId),
      'Summary contains filtered out collaborator'
    );
  });

  test('filters by currency', async () => {
    const c1 = await addCollaborator(alice());

    // USD Charge
    const chargeUSD = await addCollaboratorCharge(
      chargeInput(c1.collaboratorId, {
        currency: 'USD',
        amount: 100,
      })
    );
    await payCollaboratorCharge(
      chargeUSD.collaboratorChargeId,
      payChargeInput({ issuedAt: '2024-01-01' })
    );

    // EUR Charge
    const chargeEUR = await addCollaboratorCharge(
      chargeInput(c1.collaboratorId, {
        currency: 'EUR',
        amount: 200,
      })
    );
    await payCollaboratorCharge(
      chargeEUR.collaboratorChargeId,
      payChargeInput({ issuedAt: '2024-01-01' })
    );

    const summary = await getCollaboratorBalanceSummary({
      currency: 'USD',
      collaboratorId: [c1.collaboratorId],
    });
    const s1 = summary.items.find(s => s.collaboratorId === c1.collaboratorId);

    assert.ok(s1);
    assert.strictEqual(s1.balances.length, 1);
    assert.strictEqual(s1.balances[0].currency, 'USD');
    assert.strictEqual(s1.balances[0].balance, 100);
  });

  test('filters by date (records lower than or equal to date)', async () => {
    const c1 = await addCollaborator(alice());

    const charge1 = await addCollaboratorCharge(
      chargeInput(c1.collaboratorId, {
        currency: 'USD',
        amount: 100,
      })
    );
    await payCollaboratorCharge(
      charge1.collaboratorChargeId,
      payChargeInput({ issuedAt: '2024-01-01' })
    );

    const charge2 = await addCollaboratorCharge(
      chargeInput(c1.collaboratorId, {
        currency: 'USD',
        amount: 200,
      })
    );
    await payCollaboratorCharge(
      charge2.collaboratorChargeId,
      payChargeInput({ issuedAt: '2024-01-10' })
    );

    const summary = await getCollaboratorBalanceSummary({
      date: '2024-01-05',
      collaboratorId: [c1.collaboratorId],
    });
    const s1 = summary.items.find(s => s.collaboratorId === c1.collaboratorId);

    assert.ok(s1);
    assert.strictEqual(s1.balances[0].balance, 100);
  });

  test('returns 400 for invalid collaboratorId', async () => {
    await getCollaboratorBalanceSummary(
      { collaboratorId: 'invalid-uuid' },
      createValidationError([
        {
          path: 'collaboratorId',
          message: 'Invalid UUID',
          code: 'invalid_format',
        },
      ])
    );
  });

  test('paginates results', async () => {
    await addCollaborator(alice({ name: 'A' }));
    await addCollaborator(alice({ name: 'B' }));

    const summary = await getCollaboratorBalanceSummary({
      pageNumber: 1,
      pageSize: 1,
    });

    assert.strictEqual(summary.items.length, 1);
    assert.ok(summary.totalCount >= 2);
  });
});
