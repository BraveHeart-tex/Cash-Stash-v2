ALTER TABLE `Budget` MODIFY COLUMN `budgetAmount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `spentAmount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `goalAmount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `currentAmount` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `amount` decimal(10,2) NOT NULL;