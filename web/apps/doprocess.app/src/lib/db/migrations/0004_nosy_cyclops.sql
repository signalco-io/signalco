CREATE TABLE `process_run` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`process_id` int NOT NULL,
	`state` varchar(255) NOT NULL,
	CONSTRAINT `process_run_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`process_id` int NOT NULL,
	`run_id` int NOT NULL,
	`task_definition_id` int NOT NULL,
	`state` varchar(255) NOT NULL,
	CONSTRAINT `task_id` PRIMARY KEY(`id`)
);
