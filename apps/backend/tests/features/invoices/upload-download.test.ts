import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  addInvoice,
  assertInvoice,
  cancelInvoice,
  createInvoice,
  getInvoiceDownloadUrl,
  invalidTypeFile,
  oversizedFile,
  pdfFile,
  uploadInvoice,
} from './invoice-dsl.js';
import {
  createConflictError,
  createNotFoundError,
  createValidationError,
} from '../../errors.js';

const NON_EXISTENT_ID = '01940b6d-1234-7890-abcd-ef1234567890';

describe('Upload Invoice File Endpoint', () => {
  test('should upload a PDF file to an existing invoice', async () => {
    const input = await createInvoice();
    const invoice = await addInvoice(input);
    const file = pdfFile();

    const updated = await uploadInvoice(invoice.invoiceId, file);

    assertInvoice(updated).hasFilePath().hasContentType('application/pdf');
  });

  test('should replace the file when uploading again', async () => {
    const input = await createInvoice();
    const invoice = await addInvoice(input);

    const first = await uploadInvoice(invoice.invoiceId, pdfFile());
    const firstPath = first.filePath;

    const second = await uploadInvoice(invoice.invoiceId, pdfFile());

    assertInvoice(second).hasFilePath().hasContentType('application/pdf');
    assert.notStrictEqual(second.filePath, firstPath);
  });

  test('should return 404 for non-existent invoice', async () => {
    await uploadInvoice(
      NON_EXISTENT_ID,
      pdfFile(),
      createNotFoundError(`Invoice ${NON_EXISTENT_ID} not found`)
    );
  });

  test('should return 409 when uploading to a canceled invoice', async () => {
    const input = await createInvoice();
    const invoice = await addInvoice(input);
    await cancelInvoice(invoice.invoiceId);

    await uploadInvoice(
      invoice.invoiceId,
      pdfFile(),
      createConflictError('Cannot upload file to a canceled invoice.')
    );
  });

  describe('File validation', () => {
    test('should reject files exceeding 50MB', async () => {
      const input = await createInvoice();
      const invoice = await addInvoice(input);

      await uploadInvoice(
        invoice.invoiceId,
        oversizedFile(),
        createValidationError([
          {
            path: 'file',
            message: 'File size must not exceed 50MB',
            code: 'custom',
          },
        ])
      );
    });

    test('should reject unsupported file types', async () => {
      const input = await createInvoice();
      const invoice = await addInvoice(input);

      await uploadInvoice(
        invoice.invoiceId,
        invalidTypeFile(),
        createValidationError([
          {
            path: 'file',
            message: 'File type must be a PDF or image',
            code: 'custom',
          },
        ])
      );
    });
  });
});

describe('Get Invoice Download URL Endpoint', () => {
  test('should return a presigned URL for an invoice with a file', async () => {
    const input = await createInvoice();
    const invoice = await addInvoice(input);
    await uploadInvoice(invoice.invoiceId, pdfFile());

    const result = await getInvoiceDownloadUrl(invoice.invoiceId);

    assert.ok(typeof result.url === 'string' && result.url.length > 0);
    assert.strictEqual(result.expiresIn, 900);
  });

  test('should return 404 for non-existent invoice', async () => {
    await getInvoiceDownloadUrl(
      NON_EXISTENT_ID,
      createNotFoundError(`Invoice ${NON_EXISTENT_ID} not found`)
    );
  });

  test('should return 404 when invoice has no file', async () => {
    const input = await createInvoice();
    const invoice = await addInvoice(input);

    await getInvoiceDownloadUrl(
      invoice.invoiceId,
      createNotFoundError(`Invoice ${invoice.invoiceId} has no file`)
    );
  });
});
