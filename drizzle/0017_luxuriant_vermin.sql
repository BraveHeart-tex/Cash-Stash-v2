CREATE TABLE `CurrencyRate` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rate` double NOT NULL,
	`symbol` varchar(191) NOT NULL,
	CONSTRAINT `CurrencyRate_id` PRIMARY KEY(`id`),
	CONSTRAINT `CurrencyRate_symbol_key` UNIQUE(`symbol`)
);
