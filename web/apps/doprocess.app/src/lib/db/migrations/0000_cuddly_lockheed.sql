CREATE TABLE `document` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(32) NOT NULL,
	`name` text NOT NULL,
	`data` json,
	`shared_with_users` json NOT NULL,
	`created_by` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT current_timestamp,
	`updated_by` varchar(255),
	`updated_at` datetime,
	CONSTRAINT `document_id` PRIMARY KEY(`id`),
	CONSTRAINT `document_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `process` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`shared_with_users` json NOT NULL,
	`created_by` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT current_timestamp,
	`updated_by` varchar(255),
	`updated_at` datetime,
	CONSTRAINT `process_id` PRIMARY KEY(`id`),
	CONSTRAINT `process_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `process_run` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(32) NOT NULL,
	`process_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`created_by` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT current_timestamp,
	`updated_by` varchar(255),
	`updated_at` datetime,
	CONSTRAINT `process_run_id` PRIMARY KEY(`id`),
	CONSTRAINT `process_run_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(32) NOT NULL,
	`process_id` int NOT NULL,
	`run_id` int NOT NULL,
	`task_definition_id` int NOT NULL,
	`state` varchar(255) NOT NULL,
	`created_by` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT current_timestamp,
	`changed_by` varchar(255),
	`changed_at` datetime,
	CONSTRAINT `task_id` PRIMARY KEY(`id`),
	CONSTRAINT `task_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `task_definition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(32) NOT NULL,
	`process_id` int NOT NULL,
	`text` text,
	`order` varchar(255) NOT NULL,
	`type` varchar(255),
	`type_source` varchar(255),
	`created_by` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT current_timestamp,
	`updated_by` varchar(255),
	`updated_at` datetime,
	CONSTRAINT `task_definition_id` PRIMARY KEY(`id`),
	CONSTRAINT `task_definition_public_id_unique` UNIQUE(`public_id`)
);
