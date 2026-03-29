CREATE INDEX "collections_balance_idx" ON "dev-factory-hub"."collections" USING btree ("status","currency","confirmedAt");--> statement-breakpoint
CREATE INDEX "money_exchanges_balance_idx" ON "dev-factory-hub"."money_exchanges" USING btree ("status","issuedAt");--> statement-breakpoint
CREATE INDEX "tax_payments_balance_idx" ON "dev-factory-hub"."tax_payments" USING btree ("status","currency","paidAt");--> statement-breakpoint
CREATE INDEX "transactions_balance_idx" ON "dev-factory-hub"."transactions" USING btree ("status","currency","issuedAt");