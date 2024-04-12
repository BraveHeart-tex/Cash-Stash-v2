ALTER TABLE `Account` MODIFY COLUMN `balance` double(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `budgetAmount` double(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `spentAmount` double(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `goalAmount` double(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `currentAmount` double(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `amount` double(10,2) NOT NULL;