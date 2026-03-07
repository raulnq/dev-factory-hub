import { describe, test } from 'node:test';
import assert from 'node:assert';
import { v7 } from 'uuid';
import { createValidationError } from '../../errors.js';
import {
  getCollaboratorBalance,
  assertBalance,
} from './collaborator-balance-dsl.js';
import { addCollaborator, alice } from '../collaborators/collaborator-dsl.js';
import {
  addCollaboratorPayment,
  payCollaboratorPayment,
  paymentInput,
  payInput,
} from '../collaborator-payments/collaborator-payment-dsl.js';
import {
  addExchangeRate,
  usdToEur,
} from '../exchange-rates/exchange-rate-dsl.js';

describe('GET /collaborator-balance', () => {
  describe('without exchangeCurrencyTo', () => {
    test('returns entries without converted fields', async () => {
      const collaborator = await addCollaborator(alice());
      const payment = await addCollaboratorPayment(
        paymentInput(collaborator.collaboratorId, {
          currency: 'USD',
          grossSalary: 1000,
        })
      );
      await payCollaboratorPayment(
        payment.collaboratorPaymentId,
        payInput({ paidAt: '2002-03-15' })
      );

      const data = await getCollaboratorBalance({
        currency: 'USD',
        collaboratorId: collaborator.collaboratorId,
        startDate: '2002-01-01',
        endDate: '2002-12-31',
      });

      assert.ok(data.entries.length >= 1);
      assert.ok(data.finalBalance !== undefined);
      assert.strictEqual(data.finalConvertedBalance, undefined);
      assert.strictEqual(data.entries[0].convertedAmount, undefined);
      assert.strictEqual(data.entries[0].convertedBalance, undefined);
    });
  });

  describe('validation', () => {
    test('returns 400 when exchangeCurrencyTo equals currency', async () => {
      await getCollaboratorBalance(
        {
          currency: 'USD',
          collaboratorId: v7(),
          exchangeCurrencyTo: 'USD',
        },
        createValidationError([
          {
            path: 'exchangeCurrencyTo',
            message: 'Exchange currency must differ from currency',
            code: 'custom',
          },
        ])
      );
    });

    test('returns 400 when exchangeCurrencyTo exceeds 3 characters', async () => {
      await getCollaboratorBalance(
        {
          currency: 'USD',
          collaboratorId: v7(),
          exchangeCurrencyTo: 'USDD',
        },
        createValidationError([
          {
            path: 'exchangeCurrencyTo',
            message: 'Too big: expected string to have <=3 characters',
            code: 'too_big',
          },
        ])
      );
    });
  });

  describe('with exchangeCurrencyTo', () => {
    test('computes convertedAmount using matching exchange rate', async () => {
      const collaborator = await addCollaborator(alice());
      const payment = await addCollaboratorPayment(
        paymentInput(collaborator.collaboratorId, {
          currency: 'USD',
          grossSalary: 1000,
        })
      );
      await payCollaboratorPayment(
        payment.collaboratorPaymentId,
        payInput({ paidAt: '2003-04-10' })
      );
      await addExchangeRate(
        usdToEur({ date: '2003-04-10', toCurrency: 'PEN', rate: 3.75 })
      );

      const data = await getCollaboratorBalance({
        currency: 'USD',
        collaboratorId: collaborator.collaboratorId,
        startDate: '2003-01-01',
        endDate: '2003-12-31',
        exchangeCurrencyTo: 'PEN',
      });

      const entry = data.entries.find(e => e.issuedAt === '2003-04-10');
      assert.ok(entry, 'Expected entry for 2003-04-10');
      assert.strictEqual(entry.convertedAmount, -266.67);
      assertBalance(data).hasFinalConvertedBalance(-266.67);
    });

    test('uses zero when no exchange rate found for entry date', async () => {
      const collaborator = await addCollaborator(alice());
      const payment = await addCollaboratorPayment(
        paymentInput(collaborator.collaboratorId, {
          currency: 'USD',
          grossSalary: 500,
        })
      );
      await payCollaboratorPayment(
        payment.collaboratorPaymentId,
        payInput({ paidAt: '2004-05-20' })
      );
      // No exchange rate created for 2004-05-20

      const data = await getCollaboratorBalance({
        currency: 'USD',
        collaboratorId: collaborator.collaboratorId,
        startDate: '2004-01-01',
        endDate: '2004-12-31',
        exchangeCurrencyTo: 'PEN',
      });

      const entry = data.entries.find(e => e.issuedAt === '2004-05-20');
      assert.ok(entry, 'Expected entry for 2004-05-20');
      assert.strictEqual(entry.convertedAmount, 0);
      assert.strictEqual(entry.convertedBalance, 0);
      assertBalance(data).hasFinalConvertedBalance(0);
    });

    test('handles mixed entries: some with rate, some without', async () => {
      const collaborator = await addCollaborator(alice());

      const p1 = await addCollaboratorPayment(
        paymentInput(collaborator.collaboratorId, {
          currency: 'USD',
          grossSalary: 1000,
        })
      );
      await payCollaboratorPayment(
        p1.collaboratorPaymentId,
        payInput({ paidAt: '2005-06-01' })
      );
      await addExchangeRate(
        usdToEur({ date: '2005-06-01', toCurrency: 'PEN', rate: 4.0 })
      );

      const p2 = await addCollaboratorPayment(
        paymentInput(collaborator.collaboratorId, {
          currency: 'USD',
          grossSalary: 500,
        })
      );
      await payCollaboratorPayment(
        p2.collaboratorPaymentId,
        payInput({ paidAt: '2005-07-01' })
      );
      // No exchange rate for 2005-07-01

      const data = await getCollaboratorBalance({
        currency: 'USD',
        collaboratorId: collaborator.collaboratorId,
        startDate: '2005-01-01',
        endDate: '2005-12-31',
        exchangeCurrencyTo: 'PEN',
      });

      assert.strictEqual(data.entries.length, 2);
      const e1 = data.entries.find(e => e.issuedAt === '2005-06-01');
      const e2 = data.entries.find(e => e.issuedAt === '2005-07-01');
      assert.ok(e1, 'Expected entry for 2005-06-01');
      assert.ok(e2, 'Expected entry for 2005-07-01');
      assert.strictEqual(e1.convertedAmount, -250);
      assert.strictEqual(e2.convertedAmount, 0);
      assertBalance(data).hasFinalConvertedBalance(-250);
    });

    test('returns finalConvertedBalance = 0 for empty result set', async () => {
      const data = await getCollaboratorBalance({
        currency: 'USD',
        collaboratorId: v7(),
        exchangeCurrencyTo: 'PEN',
      });

      assertBalance(data)
        .hasEntryCount(0)
        .hasFinalBalance(0)
        .hasFinalConvertedBalance(0);
    });
  });
});
