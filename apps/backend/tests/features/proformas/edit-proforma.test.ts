import { test, describe } from 'node:test';
import {
  addProforma,
  editProforma,
  createProforma,
  assertProforma,
} from './proforma-dsl.js';

describe('Edit Proforma Endpoint', () => {
  test('should update expenses and recalculate total', async () => {
    const input = await createProforma();
    const item = await addProforma(input);

    const updated = await editProforma(item.proformaId, {
      expenses: 100,
      discount: 10,
      taxes: 5,
    });

    // subtotal 0 + 100 - 10 + 5 = 95
    assertProforma(updated).hasTotal(95);
  });
});
