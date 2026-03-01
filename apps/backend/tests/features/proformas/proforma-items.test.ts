import { test, describe } from 'node:test';
import {
  addProforma,
  createProforma,
  addProformaItem,
  createProformaItem,
  assertProforma,
  deleteProformaItem,
  getProforma,
} from './proforma-dsl.js';

describe('Proforma Items Endpoints', () => {
  test('should add item and update totals', async () => {
    const proforma = await addProforma(await createProforma());
    const itemInput = createProformaItem({ amount: 100 });

    await addProformaItem(proforma.proformaId, itemInput);

    const updated = await getProforma(proforma.proformaId);
    assertProforma(updated).hasSubtotal(100).hasTotal(100);
  });

  test('should delete item and update totals', async () => {
    const proforma = await addProforma(await createProforma());
    const item = await addProformaItem(
      proforma.proformaId,
      createProformaItem({ amount: 100 })
    );

    await deleteProformaItem(proforma.proformaId, item.proformaItemId);

    const updated = await getProforma(proforma.proformaId);
    assertProforma(updated).hasSubtotal(0).hasTotal(0);
  });
});
