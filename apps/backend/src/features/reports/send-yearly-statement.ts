import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, gte, lt, and, inArray } from 'drizzle-orm';
import { collections } from '#/features/collections/collection.js';
import { transactions } from '#/features/transactions/transaction.js';
import { moneyExchanges } from '#/features/money-exchanges/money-exchange.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { sendYearlyStatementSchema } from './schemas.js';
import type { DocumentType } from './schemas.js';
import { unauthorizedError } from '#/extensions.js';
import {
  downloadFileFromS3,
  sendYearlyStatementEmail,
} from './postmark-client.js';
import { ENV } from '#/env.js';
import type { Attachment } from 'postmark';

type FileRecord = { filePath: string | null; contentType: string | null };

async function queryRecords(
  type: DocumentType,
  startDate: string,
  endDate: string
): Promise<{ records: FileRecord[]; bucket: string; prefix: string }> {
  switch (type) {
    case 'collections':
      return {
        records: await client
          .select({
            filePath: collections.filePath,
            contentType: collections.contentType,
          })
          .from(collections)
          .where(
            and(
              eq(collections.status, 'Confirmed'),
              gte(collections.confirmedAt, startDate),
              lt(collections.confirmedAt, endDate)
            )
          ),
        bucket: ENV.S3_COLLECTIONS_BUCKET_NAME,
        prefix: 'collection',
      };
    case 'transactions':
      return {
        records: await client
          .select({
            filePath: transactions.filePath,
            contentType: transactions.contentType,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.status, 'Issued'),
              gte(transactions.issuedAt, startDate),
              lt(transactions.issuedAt, endDate)
            )
          ),
        bucket: ENV.S3_TRANSACTIONS_BUCKET_NAME,
        prefix: 'transaction',
      };
    case 'money-exchanges':
      return {
        records: await client
          .select({
            filePath: moneyExchanges.filePath,
            contentType: moneyExchanges.contentType,
          })
          .from(moneyExchanges)
          .where(
            and(
              eq(moneyExchanges.status, 'Issued'),
              gte(moneyExchanges.issuedAt, startDate),
              lt(moneyExchanges.issuedAt, endDate)
            )
          ),
        bucket: ENV.S3_MONEY_EXCHANGES_BUCKET_NAME,
        prefix: 'money-exchange',
      };
    case 'payroll-payments':
      return {
        records: await client
          .select({
            filePath: payrollPayments.filePath,
            contentType: payrollPayments.contentType,
          })
          .from(payrollPayments)
          .where(
            and(
              inArray(payrollPayments.status, ['Paid', 'Confirmed']),
              gte(payrollPayments.paidAt, startDate),
              lt(payrollPayments.paidAt, endDate)
            )
          ),
        bucket: ENV.S3_PAYROLL_PAYMENTS_BUCKET_NAME,
        prefix: 'payroll-payment',
      };
  }
}

async function buildAttachments(
  records: FileRecord[],
  bucket: string,
  prefix: string
): Promise<Attachment[]> {
  const results = await Promise.all(
    records
      .filter(r => r.filePath)
      .map(async (r, idx) => {
        const buffer = await downloadFileFromS3(bucket, r.filePath!);
        if (!buffer) return null;
        const ext = r.filePath!.split('.').pop() ?? 'bin';
        return {
          Name: `${prefix}-${idx + 1}.${ext}`,
          Content: buffer.toString('base64'),
          ContentType: r.contentType ?? 'application/octet-stream',
        };
      })
  );
  return results.filter((a): a is Attachment => a !== null);
}

export const sendYearlyStatementRoute = new Hono().post(
  '/yearly-statement',
  async (c, next) => {
    const apiKey = c.req.header('x-api-key');
    if (!ENV.API_KEY || apiKey !== ENV.API_KEY) {
      return unauthorizedError(c);
    }
    await next();
  },
  zValidator('json', sendYearlyStatementSchema),
  async c => {
    const { fromEmail, toEmail, ccEmails, type, year } = c.req.valid('json');
    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;

    const { records, bucket, prefix } = await queryRecords(
      type,
      startDate,
      endDate
    );

    const attachments = await buildAttachments(records, bucket, prefix);

    if (attachments.length === 0) {
      return c.json({ sent: false, attachmentCount: 0 }, StatusCodes.OK);
    }

    await sendYearlyStatementEmail({
      fromEmail,
      toEmail,
      ccEmails,
      type,
      year,
      attachments,
    });

    return c.json(
      { sent: true, attachmentCount: attachments.length },
      StatusCodes.OK
    );
  }
);
