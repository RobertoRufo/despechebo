CREATE TABLE `packing_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`text` varchar(256) NOT NULL,
	`category` varchar(64) NOT NULL DEFAULT 'General',
	`checkedBy` varchar(64),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packing_items_id` PRIMARY KEY(`id`)
);
