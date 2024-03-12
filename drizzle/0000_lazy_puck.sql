CREATE TABLE `Account` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`balance` double NOT NULL,
	`category` enum('CHECKING','SAVINGS','CREDIT_CARD','INVESTMENT','LOAN','OTHER') NOT NULL DEFAULT 'CHECKING',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Budget` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`budgetAmount` double NOT NULL,
	`spentAmount` double NOT NULL,
	`progress` double NOT NULL,
	`category` enum('FOOD','TRANSPORTATION','ENTERTAINMENT','UTILITIES','SHOPPING','HOUSING','OTHER') NOT NULL DEFAULT 'OTHER',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `Budget_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `EmailVerificationCode` (
	`id` varchar(128) NOT NULL,
	`code` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	CONSTRAINT `EmailVerificationCode_id` PRIMARY KEY(`id`),
	CONSTRAINT `EmailVerificationCode_userId_key` UNIQUE(`id`),
	CONSTRAINT `EmailVerificationCode_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Goal` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`goalAmount` double NOT NULL,
	`currentAmount` double NOT NULL,
	`progress` double NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `Goal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `PasswordResetToken` (
	`id` varchar(128) NOT NULL,
	`expires_At` datetime(3) NOT NULL,
	CONSTRAINT `PasswordResetToken_id` PRIMARY KEY(`id`),
	CONSTRAINT `PasswordResetToken_user_id_key` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Reminder` (
	`id` varchar(128) NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` varchar(191) NOT NULL,
	`reminderDate` datetime(3) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`markedAsReadAt` datetime(3),
	CONSTRAINT `Reminder_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(128) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Transaction` (
	`id` varchar(128) NOT NULL,
	`amount` double NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`description` varchar(191) NOT NULL,
	`category` enum('FOOD','TRANSPORTATION','ENTERTAINMENT','UTILITIES','SHOPPING','HOUSING','OTHER') NOT NULL DEFAULT 'OTHER',
	`accountId` int NOT NULL,
	CONSTRAINT `Transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `TwoFactorAuthenticationSecret` (
	`id` varchar(128) NOT NULL,
	`secret` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `TwoFactorAuthenticationSecret_id` PRIMARY KEY(`id`),
	CONSTRAINT `TwoFactorAuthenticationSecret_userId_key` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`hashedPassword` varchar(191) NOT NULL,
	`email_verified` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`prefersTwoFactorAuthentication` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `userAccounts_userId_fkey` ON `Account` (`id`);--> statement-breakpoint
CREATE INDEX `budgets_userId_fkey` ON `Budget` (`id`);--> statement-breakpoint
CREATE INDEX `emailVerificationCodes_userId_fkey` ON `EmailVerificationCode` (`id`);--> statement-breakpoint
CREATE INDEX `emailVerificationCodes_email_fkey` ON `EmailVerificationCode` (`email`);--> statement-breakpoint
CREATE INDEX `goals_userId_fkey` ON `Goal` (`id`);--> statement-breakpoint
CREATE INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken` (`id`);--> statement-breakpoint
CREATE INDEX `reminders_userId_fkey` ON `Reminder` (`id`);--> statement-breakpoint
CREATE INDEX `sessions_userId_fkey` ON `Session` (`id`);--> statement-breakpoint
CREATE INDEX `twoFactorAuthenticationSecrets_userId_fkey` ON `TwoFactorAuthenticationSecret` (`id`);--> statement-breakpoint
ALTER TABLE `Account` ADD CONSTRAINT `Account_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` ADD CONSTRAINT `EmailVerificationCode_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Reminder` ADD CONSTRAINT `Reminder_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Session` ADD CONSTRAINT `Session_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_Account_id_fk` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` ADD CONSTRAINT `TwoFactorAuthenticationSecret_id_User_id_fk` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;