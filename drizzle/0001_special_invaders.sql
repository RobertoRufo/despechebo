CREATE TABLE `journal_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`posterName` varchar(64) NOT NULL,
	`photoUrl` text NOT NULL,
	`photoKey` text NOT NULL,
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journal_posts_id` PRIMARY KEY(`id`)
);
