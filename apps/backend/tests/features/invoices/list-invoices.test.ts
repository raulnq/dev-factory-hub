import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  addInvoice,
  listInvoices,
  assertInvoice,
  createInvoice,
  createClient,
} from './invoice-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Invoices Endpoint', () => {
  test('should list invoices with pagination', async () => {
    await addInvoice(await createInvoice());
    const page = await listInvoices({ pageNumber: 1, pageSize: 10 });
    assertPage(page).hasItemsCountAtLeast(1);
  });

  test('should filter invoices by clientId', async () => {
    const clientId = await createClient();
    const invoice = await addInvoice(await createInvoice({ clientId }));
    await addInvoice(await createInvoice()); // different client

    const page = await listInvoices({ pageNumber: 1, pageSize: 10, clientId });
    assertPage(page).hasItemsCountAtLeast(1);
    assertInvoice(page.items[0]).hasClientId(invoice.clientId);
  });

  test('should return empty result when filtering by non-matching clientId', async () => {
    const nonMatchingClientId = '01940b6d-9999-7000-8000-ef1234567890';
    const page = await listInvoices({
      pageNumber: 1,
      pageSize: 10,
      clientId: nonMatchingClientId,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should order invoices by createdAt descending', async () => {
    const clientId = await createClient();
    const first = await addInvoice(await createInvoice({ clientId }));
    const second = await addInvoice(await createInvoice({ clientId }));

    const page = await listInvoices({ pageNumber: 1, pageSize: 10, clientId });
    assertPage(page).hasItemsCountAtLeast(2);

    const ids = page.items.map(i => i.invoiceId);
    const firstIdx = ids.indexOf(first.invoiceId);
    const secondIdx = ids.indexOf(second.invoiceId);

    assert.ok(
      secondIdx < firstIdx,
      'Expected more recently created invoice to appear first (createdAt descending)'
    );
  });

  test('should include clientName in results', async () => {
    const clientId = await createClient();
    await addInvoice(await createInvoice({ clientId }));

    const page = await listInvoices({ pageNumber: 1, pageSize: 10, clientId });
    assertPage(page).hasItemsCountAtLeast(1);
    assert.ok(
      typeof page.items[0].clientName === 'string' &&
        page.items[0].clientName.length > 0,
      'Expected clientName to be populated in list results'
    );
  });
});
