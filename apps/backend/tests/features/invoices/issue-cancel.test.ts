import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  addInvoice,
  issueInvoice,
  cancelInvoice,
  assertInvoice,
  createInvoice,
  defaultIssueData,
  todayDate,
} from './invoice-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Issue Invoice Endpoint', () => {
  test('should issue a pending invoice with valid data', async () => {
    const invoice = await addInvoice(await createInvoice());
    const issueData = defaultIssueData({
      issuedAt: todayDate(),
      exchangeRate: 3.75,
      number: 'INV-001',
    });

    const issued = await issueInvoice(invoice.invoiceId, issueData);
    assertInvoice(issued)
      .hasStatus('Issued')
      .hasIssuedAt(issueData.issuedAt)
      .hasExchangeRate(3.75)
      .hasNumber('INV-001');
  });

  test('should return 409 when trying to issue an already issued invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await issueInvoice(invoice.invoiceId, defaultIssueData());

    await issueInvoice(
      invoice.invoiceId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue invoice with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when trying to issue a canceled invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await cancelInvoice(invoice.invoiceId);

    await issueInvoice(
      invoice.invoiceId,
      defaultIssueData(),
      createConflictError(
        `Cannot issue invoice with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent invoice', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await issueInvoice(
      id,
      defaultIssueData(),
      createNotFoundError(`Invoice ${id} not found`)
    );
  });

  describe('Issue validation', () => {
    const testCases = [
      {
        name: 'should reject missing issuedAt',
        input: {
          ...defaultIssueData(),
          issuedAt: undefined as unknown as string,
        },
        expectedError: createValidationError([
          validationError.requiredString('issuedAt'),
        ]),
      },
      {
        name: 'should reject negative exchangeRate',
        input: { ...defaultIssueData(), exchangeRate: -1 },
        expectedError: createValidationError([
          {
            path: 'exchangeRate',
            message: 'Too small: expected number to be >=0',
            code: 'too_small',
          },
        ]),
      },
      {
        name: 'should reject empty number',
        input: { ...defaultIssueData(), number: '' },
        expectedError: createValidationError([
          validationError.tooSmall('number', 1),
        ]),
      },
      {
        name: 'should reject number longer than 20 characters',
        input: { ...defaultIssueData(), number: 'a'.repeat(21) },
        expectedError: createValidationError([
          validationError.tooBig('number', 20),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const invoice = await addInvoice(await createInvoice());
        await issueInvoice(
          invoice.invoiceId,
          input as Parameters<typeof issueInvoice>[1],
          expectedError
        );
      });
    }
  });
});

describe('Cancel Invoice Endpoint', () => {
  test('should cancel a pending invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    const canceled = await cancelInvoice(invoice.invoiceId);
    assertInvoice(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should cancel an issued invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await issueInvoice(invoice.invoiceId, defaultIssueData());

    const canceled = await cancelInvoice(invoice.invoiceId);
    assertInvoice(canceled).hasStatus('Canceled').hasCanceledAt();
  });

  test('should set canceledAt to current datetime', async () => {
    const before = new Date();
    const invoice = await addInvoice(await createInvoice());
    const canceled = await cancelInvoice(invoice.invoiceId);
    const after = new Date();

    assert.ok(canceled.canceledAt, 'Expected canceledAt to be set');
    assert.ok(
      canceled.canceledAt >= before && canceled.canceledAt <= after,
      'Expected canceledAt to be within test execution time range'
    );
  });

  test('should return 409 when trying to cancel an already canceled invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await cancelInvoice(invoice.invoiceId);

    await cancelInvoice(
      invoice.invoiceId,
      createConflictError(
        `Cannot cancel invoice with status "Canceled". Already canceled.`
      )
    );
  });

  test('should return 404 for non-existent invoice', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await cancelInvoice(id, createNotFoundError(`Invoice ${id} not found`));
  });
});
