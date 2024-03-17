ALTER TABLE `Account` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Account` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Reminder` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Reminder` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `User` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);--> statement-breakpoint
ALTER TABLE `User` MODIFY COLUMN `updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3);