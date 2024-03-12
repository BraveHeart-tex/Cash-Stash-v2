ALTER TABLE `Account` DROP FOREIGN KEY `Account_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Budget` DROP FOREIGN KEY `Budget_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` DROP FOREIGN KEY `EmailVerificationCode_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Goal` DROP FOREIGN KEY `Goal_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `PasswordResetToken` DROP FOREIGN KEY `PasswordResetToken_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Reminder` DROP FOREIGN KEY `Reminder_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Session` DROP FOREIGN KEY `Session_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` DROP FOREIGN KEY `TwoFactorAuthenticationSecret_id_User_id_fk`;
--> statement-breakpoint
DROP INDEX `userAccounts_userId_fkey` ON `Account`;--> statement-breakpoint
DROP INDEX `budgets_userId_fkey` ON `Budget`;--> statement-breakpoint
DROP INDEX `emailVerificationCodes_userId_fkey` ON `EmailVerificationCode`;--> statement-breakpoint
DROP INDEX `goals_userId_fkey` ON `Goal`;--> statement-breakpoint
DROP INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken`;--> statement-breakpoint
DROP INDEX `reminders_userId_fkey` ON `Reminder`;--> statement-breakpoint
DROP INDEX `sessions_userId_fkey` ON `Session`;--> statement-breakpoint
DROP INDEX `transactions_userId_fkey` ON `Transaction`;--> statement-breakpoint
DROP INDEX `twoFactorAuthenticationSecrets_userId_fkey` ON `TwoFactorAuthenticationSecret`;--> statement-breakpoint
ALTER TABLE `Account` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Budget` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` MODIFY COLUMN `id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `Reminder` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Session` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Transaction` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` MODIFY COLUMN `id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` ADD CONSTRAINT `EmailVerificationCode_userId_key` UNIQUE(`userId`);--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_user_id_key` UNIQUE(`userId`);--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` ADD CONSTRAINT `TwoFactorAuthenticationSecret_userId_key` UNIQUE(`userId`);--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` DROP INDEX `EmailVerificationCode_userId_key`;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` DROP INDEX `PasswordResetToken_user_id_key`;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` DROP INDEX `TwoFactorAuthenticationSecret_userId_key`;--> statement-breakpoint
ALTER TABLE `Account` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `Budget` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `Goal` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `Reminder` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `Session` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `Transaction` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` ADD `userId` varchar(128) NOT NULL;--> statement-breakpoint
CREATE INDEX `userAccounts_userId_fkey` ON `Account` (`userId`);--> statement-breakpoint
CREATE INDEX `budgets_userId_fkey` ON `Budget` (`userId`);--> statement-breakpoint
CREATE INDEX `emailVerificationCodes_userId_fkey` ON `EmailVerificationCode` (`userId`);--> statement-breakpoint
CREATE INDEX `goals_userId_fkey` ON `Goal` (`userId`);--> statement-breakpoint
CREATE INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken` (`userId`);--> statement-breakpoint
CREATE INDEX `reminders_userId_fkey` ON `Reminder` (`userId`);--> statement-breakpoint
CREATE INDEX `sessions_userId_fkey` ON `Session` (`userId`);--> statement-breakpoint
CREATE INDEX `transactions_userId_fkey` ON `Transaction` (`userId`);--> statement-breakpoint
CREATE INDEX `twoFactorAuthenticationSecrets_userId_fkey` ON `TwoFactorAuthenticationSecret` (`userId`);--> statement-breakpoint
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` ADD CONSTRAINT `EmailVerificationCode_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Reminder` ADD CONSTRAINT `Reminder_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` ADD CONSTRAINT `TwoFactorAuthenticationSecret_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;