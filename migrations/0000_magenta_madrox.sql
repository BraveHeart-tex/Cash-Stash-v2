CREATE TABLE `Account` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`balance` double(10,2) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`category` enum('CHECKING','SAVINGS','CREDIT_CARD','INVESTMENT','LOAN','OTHER') NOT NULL DEFAULT 'CHECKING',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `Account_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_userId_name_category_unique` UNIQUE(`name`,`userId`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Budget` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`budgetAmount` double(10,2) NOT NULL,
	`spentAmount` double(10,2) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`progress` double NOT NULL,
	`categoryId` int NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `Budget_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`type` int NOT NULL,
	`userId` varchar(128) NOT NULL,
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_name_user_type` UNIQUE(`name`,`userId`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `CurrencyRate` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rate` double NOT NULL,
	`symbol` varchar(191) NOT NULL,
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `CurrencyRate_id` PRIMARY KEY(`id`),
	CONSTRAINT `CurrencyRate_symbol_key` UNIQUE(`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `EmailVerificationCode` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(191) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`email` varchar(191) NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	CONSTRAINT `EmailVerificationCode_id` PRIMARY KEY(`id`),
	CONSTRAINT `EmailVerificationCode_userId_key` UNIQUE(`userId`),
	CONSTRAINT `EmailVerificationCode_email_key` UNIQUE(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Goal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`goalAmount` double(10,2) NOT NULL,
	`currentAmount` double(10,2) NOT NULL,
	`progress` double NOT NULL,
	`userId` varchar(128) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `Goal_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `PasswordResetToken` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`expires_At` datetime(3) NOT NULL,
	CONSTRAINT `PasswordResetToken_id` PRIMARY KEY(`id`),
	CONSTRAINT `PasswordResetToken_user_id_key` UNIQUE(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Reminder` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` varchar(512) NOT NULL,
	`reminderDate` datetime(3),
	`userId` varchar(128) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`markedAsReadAt` datetime(3),
	`status` enum('PENDING','COMPLETED') DEFAULT 'PENDING',
	`type` enum('ONE_TIME','RECURRING') DEFAULT 'ONE_TIME',
	`recurrence` enum('DAILY','EVERY_2_DAYS','EVERY_3_DAYS','EVERY_4_DAYS','EVERY_5_DAYS','EVERY_6_DAYS','WEEKLY','EVERY_TWO_WEEKS', 'MONTHLY','WEEKDAYS','WEEKENDS','YEARLY') DEFAULT 'DAILY',
	CONSTRAINT `Reminder_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `Transaction` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` double(10,2) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`description` varchar(191) NOT NULL,
	`categoryId` int NOT NULL,
	`accountId` int NOT NULL,
	`userId` varchar(128) NOT NULL,
	CONSTRAINT `Transaction_id` PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `TwoFactorAuthenticationSecret` (
	`id` varchar(191) NOT NULL,
	`secret` varchar(191) NOT NULL,
	`userId` varchar(128) NOT NULL,
	`createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `TwoFactorAuthenticationSecret_id` PRIMARY KEY(`id`),
	CONSTRAINT `TwoFactorAuthenticationSecret_userId_key` UNIQUE(`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`hashedPassword` varchar(191) NOT NULL,
	`email_verified` tinyint NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`prefersTwoFactorAuthentication` tinyint NOT NULL DEFAULT 0,
	`activatedTwoFactorAuthentication` tinyint DEFAULT 0,
	`preferredCurrency` varchar(3) NOT NULL DEFAULT 'USD',
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--> statement-breakpoint
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `EmailVerificationCode` ADD CONSTRAINT `EmailVerificationCode_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Reminder` ADD CONSTRAINT `Reminder_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Session` ADD CONSTRAINT `Session_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_categoryId_Category_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_accountId_Account_id_fk` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `TwoFactorAuthenticationSecret` ADD CONSTRAINT `TwoFactorAuthenticationSecret_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `userAccounts_userId_fkey` ON `Account` (`userId`);--> statement-breakpoint
CREATE INDEX `budgets_userId_fkey` ON `Budget` (`userId`);--> statement-breakpoint
CREATE INDEX `budgets_categoryId_fkey` ON `Budget` (`categoryId`);--> statement-breakpoint
CREATE INDEX `user_id_fkey` ON `Category` (`userId`);--> statement-breakpoint
CREATE INDEX `emailVerificationCodes_userId_fkey` ON `EmailVerificationCode` (`userId`);--> statement-breakpoint
CREATE INDEX `emailVerificationCodes_email_fkey` ON `EmailVerificationCode` (`email`);--> statement-breakpoint
CREATE INDEX `goals_userId_fkey` ON `Goal` (`userId`);--> statement-breakpoint
CREATE INDEX `passwordResetTokens_user_id_fkey` ON `PasswordResetToken` (`user_id`);--> statement-breakpoint
CREATE INDEX `reminders_userId_fkey` ON `Reminder` (`userId`);--> statement-breakpoint
CREATE INDEX `sessions_userId_fkey` ON `Session` (`user_id`);--> statement-breakpoint
CREATE INDEX `transactions_categoryId_fkey` ON `Transaction` (`categoryId`);--> statement-breakpoint
CREATE INDEX `transactions_userId_fkey` ON `Transaction` (`userId`);--> statement-breakpoint
CREATE INDEX `transaction_account_id_fkey` ON `Transaction` (`accountId`);--> statement-breakpoint
CREATE INDEX `twoFactorAuthenticationSecrets_userId_fkey` ON `TwoFactorAuthenticationSecret` (`userId`);