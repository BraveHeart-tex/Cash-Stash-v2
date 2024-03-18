ALTER TABLE `PasswordResetToken` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` DROP FOREIGN KEY `PasswordResetToken_userId_User_id_fk`;
--> statement-breakpoint
DROP INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken`;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_user_id_key` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `PasswordResetToken` DROP INDEX `PasswordResetToken_user_id_key`;--> statement-breakpoint
CREATE INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken` (`user_id`);--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;