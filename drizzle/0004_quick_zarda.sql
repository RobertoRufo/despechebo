CREATE TABLE `itinerary_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`memberName` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itinerary_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `itinerary_items` MODIFY COLUMN `badge` enum('reservation_confirmed','tbd','hot') NOT NULL DEFAULT 'tbd';