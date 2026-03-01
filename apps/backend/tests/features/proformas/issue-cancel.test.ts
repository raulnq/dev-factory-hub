import { test, describe } from 'node:test';
import {
  addProforma,
  createProforma,
  addProformaItem,
  createProformaItem,
  issueProforma,
  cancelProforma,
  assertProforma,
} from './proforma-dsl.js';
import { createConflictError } from '../../errors.js';

describe('Issue/Cancel Proforma Endpoints', () => {
  test('should issue a pending proforma with items', async () => {
    const proforma = await addProforma(await createProforma());
    await addProformaItem(
      proforma.proformaId,
      createProformaItem({ amount: 100 })
    );

    const issued = await issueProforma(proforma.proformaId);
    assertProforma(issued).hasStatus('Issued');
  });

  test('should fail to issue empty proforma', async () => {
    const proforma = await addProforma(await createProforma());
    // Total 0
    await issueProforma(
      proforma.proformaId,
      createConflictError(
        `Cannot issue proforma with total "0". Must be greater than 0.`
      )
    );
  });

  test('should cancel issued proforma', async () => {
    const proforma = await addProforma(await createProforma());
    await addProformaItem(
      proforma.proformaId,
      createProformaItem({ amount: 100 })
    );
    await issueProforma(proforma.proformaId);

    const canceled = await cancelProforma(proforma.proformaId);
    assertProforma(canceled).hasStatus('Canceled');
  });

  test('should cancel pending proforma', async () => {
    const proforma = await addProforma(await createProforma());

    const canceled = await cancelProforma(proforma.proformaId);
    assertProforma(canceled).hasStatus('Canceled');
  });

  test('should fail to cancel already canceled proforma', async () => {
    const proforma = await addProforma(await createProforma());
    await cancelProforma(proforma.proformaId);

    await cancelProforma(
      proforma.proformaId,
      createConflictError(
        `Cannot cancel proforma with status "Canceled". Must be "Pending" or "Issued".`
      )
    );
  });
});
