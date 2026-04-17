import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, gte, lt, and, inArray } from 'drizzle-orm';
import { collections } from '#/features/collections/collection.js';
import { transactions } from '#/features/transactions/transaction.js';
import { moneyExchanges } from '#/features/money-exchanges/money-exchange.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { sendMonthlyStatementSchema } from './schemas.js';
import { unauthorizedError } from '#/extensions.js';
import {
  downloadFileFromS3,
  sendMonthlyStatementEmail,
} from './postmark-client.js';
import { Attachment } from 'postmark';
import { ENV } from '#/env.js';

function buildDateRange(
  month: number,
  year: number
): {
  startDate: string;
  endDate: string;
} {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  return { startDate, endDate };
}

async function buildAttachments(
  records: Array<{ filePath: string | null; contentType: string | null }>,
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

export const sendMonthlyStatementRoute = new Hono().post(
  '/monthly-statement',
  async (c, next) => {
    const apiKey = c.req.header('x-api-key');
    if (!ENV.API_KEY || apiKey !== ENV.API_KEY) {
      return unauthorizedError(c);
    }
    await next();
  },
  zValidator('json', sendMonthlyStatementSchema),
  async c => {
    const { fromEmail, toEmail, ccEmails, month, year } = c.req.valid('json');
    const { startDate, endDate } = buildDateRange(month, year);

    const [
      confirmedCollections,
      issuedTransactions,
      issuedMoneyExchanges,
      paidPayrollPayments,
    ] = await Promise.all([
      client
        .select()
        .from(collections)
        .where(
          and(
            eq(collections.status, 'Confirmed'),
            gte(collections.confirmedAt, startDate),
            lt(collections.confirmedAt, endDate)
          )
        ),
      client
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.status, 'Issued'),
            gte(transactions.issuedAt, startDate),
            lt(transactions.issuedAt, endDate)
          )
        ),
      client
        .select()
        .from(moneyExchanges)
        .where(
          and(
            eq(moneyExchanges.status, 'Issued'),
            gte(moneyExchanges.issuedAt, startDate),
            lt(moneyExchanges.issuedAt, endDate)
          )
        ),
      client
        .select()
        .from(payrollPayments)
        .where(
          and(
            inArray(payrollPayments.status, ['Paid', 'Confirmed']),
            gte(payrollPayments.paidAt, startDate),
            lt(payrollPayments.paidAt, endDate)
          )
        ),
    ]);

    const [
      collectionAttachments,
      transactionAttachments,
      moneyExchangeAttachments,
      payrollAttachments,
    ] = await Promise.all([
      buildAttachments(
        confirmedCollections,
        ENV.S3_COLLECTIONS_BUCKET_NAME,
        'collection'
      ),
      buildAttachments(
        issuedTransactions,
        ENV.S3_TRANSACTIONS_BUCKET_NAME,
        'transaction'
      ),
      buildAttachments(
        issuedMoneyExchanges,
        ENV.S3_MONEY_EXCHANGES_BUCKET_NAME,
        'money-exchange'
      ),
      buildAttachments(
        paidPayrollPayments,
        ENV.S3_PAYROLL_PAYMENTS_BUCKET_NAME,
        'payroll-payment'
      ),
    ]);

    const attachments = [
      ...collectionAttachments,
      ...transactionAttachments,
      ...moneyExchangeAttachments,
      ...payrollAttachments,
    ];

    if (attachments.length === 0) {
      return c.json({ sent: false, attachmentCount: 0 }, StatusCodes.OK);
    }

    await sendMonthlyStatementEmail({
      fromEmail,
      toEmail,
      ccEmails,
      month,
      year,
      attachments,
    });

    return c.json(
      { sent: true, attachmentCount: attachments.length },
      StatusCodes.OK
    );
  }
);
