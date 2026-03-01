import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addCollection,
  assertCollection,
  createClient,
  collectionInput,
  uploadCollection,
} from './collection-dsl.js';
import type { Collection } from '#/features/collections/schemas.js';
import { createNotFoundError, createValidationError } from '../../errors.js';
import { v7 } from 'uuid';

const smallPdf = () =>
  new File([Buffer.from('%PDF-1.4 test')], 'test.pdf', {
    type: 'application/pdf',
  });

const smallImage = () =>
  new File([Buffer.from('PNG')], 'test.png', { type: 'image/png' });

describe('Upload Collection Endpoint', () => {
  test('should upload a PDF file and set filePath and contentType', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const item = await uploadCollection(created.collectionId, smallPdf());

    assertCollection(item).hasFilePath(true);
    assert.strictEqual((item as Collection).contentType, 'application/pdf');
  });

  test('should upload an image file', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const item = await uploadCollection(created.collectionId, smallImage());

    assertCollection(item).hasFilePath(true);
  });

  test('should return 404 when collection does not exist', async () => {
    const nonExistentId = v7();
    await uploadCollection(
      nonExistentId,
      smallPdf(),
      createNotFoundError(`Collection ${nonExistentId} not found`)
    );
  });

  test('should reject disallowed MIME type', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const docxFile = new File([Buffer.from('PK content')], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await uploadCollection(
      created.collectionId,
      docxFile,
      createValidationError([
        {
          path: 'file',
          message: 'File type must be a PDF or image',
          code: 'custom',
        },
      ])
    );
  });

  test('should reject file name exceeding 250 characters', async () => {
    const client = await createClient();
    const created = await addCollection(collectionInput(client.clientId));
    const longName = `${'a'.repeat(248)}.pdf`;
    const longNameFile = new File([Buffer.from('%PDF test')], longName, {
      type: 'application/pdf',
    });

    await uploadCollection(
      created.collectionId,
      longNameFile,
      createValidationError([
        {
          path: 'file',
          message: 'File name must not exceed 250 characters',
          code: 'custom',
        },
      ])
    );
  });
});
