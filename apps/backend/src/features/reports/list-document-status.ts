import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, gte, lt, and, inArray } from 'drizzle-orm';
import { collections } from '#/features/collections/collection.js';
import { transactions } from '#/features/transactions/transaction.js';
import { moneyExchanges } from '#/features/money-exchanges/money-exchange.js';
import { payrollPayments } from '#/features/payroll-payments/payroll-payment.js';
import { createPage } from '#/pagination.js';
import {
  listDocumentStatusSchema,
  type DocumentStatusItem,
} from './schemas.js';

function buildDateRange(month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  return { startDate, endDate };
}

const TYPE_ORDER: Record<DocumentStatusItem['documentType'], number> = {
  Collection: 0,
  Transaction: 1,
  MoneyExchange: 2,
  PayrollPayment: 3,
};

export const listDocumentStatusRoute = new Hono().get(
  '/document-status',
  zValidator('query', listDocumentStatusSchema),
  async c => {
    const { month, year, pageNumber, pageSize } = c.req.valid('query');
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

    const allItems: DocumentStatusItem[] = [
      ...confirmedCollections.map(r => ({
        documentType: 'Collection' as const,
        entityId: r.collectionId,
        entityDate: r.confirmedAt ?? '',
        status: r.status,
        hasDocument: r.filePath !== null,
      })),
      ...issuedTransactions.map(r => ({
        documentType: 'Transaction' as const,
        entityId: r.transactionId,
        entityDate: r.issuedAt ?? '',
        status: r.status,
        hasDocument: r.filePath !== null,
      })),
      ...issuedMoneyExchanges.map(r => ({
        documentType: 'MoneyExchange' as const,
        entityId: r.moneyExchangeId,
        entityDate: r.issuedAt ?? '',
        status: r.status,
        hasDocument: r.filePath !== null,
      })),
      ...paidPayrollPayments.map(r => ({
        documentType: 'PayrollPayment' as const,
        entityId: r.payrollPaymentId,
        entityDate: r.paidAt ?? '',
        status: r.status,
        hasDocument: r.filePath !== null,
      })),
    ];

    allItems.sort((a, b) => {
      const typeOrder = TYPE_ORDER[a.documentType] - TYPE_ORDER[b.documentType];
      if (typeOrder !== 0) return typeOrder;
      return a.entityDate.localeCompare(b.entityDate);
    });

    const totalCount = allItems.length;
    const offset = (pageNumber - 1) * pageSize;
    const pageItems = allItems.slice(offset, offset + pageSize);

    return c.json(
      createPage(pageItems, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
