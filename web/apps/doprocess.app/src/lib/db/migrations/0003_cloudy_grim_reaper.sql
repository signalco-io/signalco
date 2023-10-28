CREATE TABLE `task_definition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`process_id` int NOT NULL,
	`text` text,
	`description` text,
	CONSTRAINT `task_definition_id` PRIMARY KEY(`id`)
);
