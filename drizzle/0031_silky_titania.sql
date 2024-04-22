ALTER TABLE `Transaction` RENAME COLUMN `category` TO `categoryId`;--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `categoryId` int NOT NULL;--> statement-breakpoint
CREATE INDEX `transactions_categoryId_fkey` ON `Transaction` (`categoryId`);--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE cascade ON UPDATE cascade;