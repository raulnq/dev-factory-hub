import { test, describe } from 'node:test';
import {
  addInvoice,
  editInvoice,
  issueInvoice,
  cancelInvoice,
  assertInvoice,
  createInvoice,
  defaultIssueData,
} from './invoice-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';

const nonNegativeNumber = (path: string) =>
  createValidationError([
    {
      path,
      message: 'Too small: expected number to be >=0',
      code: 'too_small',
    },
  ]);

describe('Edit Invoice Endpoint', () => {
  test('should edit a pending invoice with valid data', async () => {
    const invoice = await addInvoice(
      await createInvoice({ subtotal: 100, taxes: 10 })
    );
    const updated = await editInvoice(invoice.invoiceId, {
      currency: 'EUR',
      subtotal: 200,
      taxes: 36,
    });
    assertInvoice(updated)
      .hasCurrency('EUR')
      .hasSubtotal(200)
      .hasTaxes(36)
      .hasTotal(236);
  });

  test('should recompute total when subtotal and taxes change', async () => {
    const invoice = await addInvoice(
      await createInvoice({ subtotal: 50, taxes: 5 })
    );
    const updated = await editInvoice(invoice.invoiceId, {
      currency: 'USD',
      subtotal: 300,
      taxes: 54,
    });
    assertInvoice(updated).hasTotal(354);
  });

  test('should return 409 when trying to edit an issued invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await issueInvoice(invoice.invoiceId, defaultIssueData());

    await editInvoice(
      invoice.invoiceId,
      { currency: 'USD', subtotal: 100, taxes: 18 },
      createConflictError(
        `Cannot edit invoice with status "Issued". Must be "Pending".`
      )
    );
  });

  test('should return 409 when trying to edit a canceled invoice', async () => {
    const invoice = await addInvoice(await createInvoice());
    await cancelInvoice(invoice.invoiceId);

    await editInvoice(
      invoice.invoiceId,
      { currency: 'USD', subtotal: 100, taxes: 18 },
      createConflictError(
        `Cannot edit invoice with status "Canceled". Must be "Pending".`
      )
    );
  });

  test('should return 404 for non-existent invoice', async () => {
    const id = '01940b6d-1234-7000-8000-ef1234567890';
    await editInvoice(
      id,
      { currency: 'USD', subtotal: 100, taxes: 18 },
      createNotFoundError(`Invoice ${id} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject missing currency',
        input: {
          currency: undefined as unknown as string,
          subtotal: 100,
          taxes: 18,
        },
        expectedError: createValidationError([
          validationError.requiredString('currency'),
        ]),
      },
      {
        name: 'should reject negative subtotal',
        input: { currency: 'USD', subtotal: -10, taxes: 18 },
        expectedError: nonNegativeNumber('subtotal'),
      },
      {
        name: 'should reject negative taxes',
        input: { currency: 'USD', subtotal: 100, taxes: -5 },
        expectedError: nonNegativeNumber('taxes'),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const invoice = await addInvoice(await createInvoice());
        await editInvoice(
          invoice.invoiceId,
          input as Parameters<typeof editInvoice>[1],
          expectedError
        );
      });
    }
  });
});
