ALTER TABLE `Session` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_User_id_fk`;
--> statement-breakpoint
DROP INDEX `sessions_userId_fkey` ON `Session`;--> statement-breakpoint
CREATE INDEX `sessions_userId_fkey` ON `Session` (`user_id`);--> statement-breakpoint
ALTER TABLE `Session` ADD CONSTRAINT `Session_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;