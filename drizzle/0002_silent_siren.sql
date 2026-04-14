CREATE TABLE `itinerary_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayIndex` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`time` varchar(32),
	`title` varchar(256) NOT NULL,
	`venue` varchar(256),
	`address` text,
	`mapsUrl` text,
	`badge` enum('confirmed','tbd','hot') NOT NULL DEFAULT 'tbd',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itinerary_items_id` PRIMARY KEY(`id`)
);
