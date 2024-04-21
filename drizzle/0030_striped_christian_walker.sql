ALTER TABLE `Budget` RENAME COLUMN `category` TO `categoryId`;--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `categoryId` int NOT NULL;--> statement-breakpoint
CREATE INDEX `budgets_categoryId_fkey` ON `Budget` (`categoryId`);--> statement-breakpoint
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE cascade ON UPDATE cascade;