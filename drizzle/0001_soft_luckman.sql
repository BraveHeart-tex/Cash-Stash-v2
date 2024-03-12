CREATE INDEX `transactions_userId_fkey` ON `Transaction` (`id`);--> statement-breakpoint
CREATE INDEX `transaction_account_id_fkey` ON `Transaction` (`accountId`);