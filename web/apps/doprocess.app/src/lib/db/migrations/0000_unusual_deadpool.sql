CREATE TABLE `process` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`templateId` varchar(255) NOT NULL,
	CONSTRAINT `process_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `template_id` PRIMARY KEY(`id`)
);
