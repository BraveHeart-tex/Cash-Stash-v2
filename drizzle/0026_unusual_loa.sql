CREATE TABLE `Category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`type` int NOT NULL,
	`userId` varchar(128) NOT NULL,
	CONSTRAINT `Category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;