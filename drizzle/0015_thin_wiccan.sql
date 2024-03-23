CREATE TABLE `Currency` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`symbol` varchar(191) NOT NULL,
	CONSTRAINT `Currency_id` PRIMARY KEY(`id`),
	CONSTRAINT `Currency_name_key` UNIQUE(`name`),
	CONSTRAINT `Currency_symbol_key` UNIQUE(`symbol`)
);
