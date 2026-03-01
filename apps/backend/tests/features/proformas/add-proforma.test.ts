import { test, describe } from 'node:test';
import { addProforma, createProforma, assertProforma } from './proforma-dsl.js';

describe('Add Proforma Endpoint', () => {
  test('should create a new proforma with default values', async () => {
    const input = await createProforma();
    const item = await addProforma(input);
    assertProforma(item).hasStatus('Pending').hasSubtotal(0).hasTotal(0);

    // Check Number format YYYYMMDD-{count+1}
    const yyyymmdd = input.endDate.replace(/-/g, '');
    if (!item.number.startsWith(`${yyyymmdd}-`)) {
      throw new Error(
        `Expected number to start with ${yyyymmdd}-, got ${item.number}`
      );
    }
  });

  test('should increment number for same end date', async () => {
    const input = await createProforma();
    const item1 = await addProforma(input);
    const item2 = await addProforma(input);

    const num1 = parseInt(item1.number.split('-')[1]);
    const num2 = parseInt(item2.number.split('-')[1]);

    if (num2 !== num1 + 1) {
      throw new Error(
        `Expected number to increment, got ${item1.number} and ${item2.number}`
      );
    }
  });
});
