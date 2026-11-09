CREATE TABLE `test_results` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`partner_a` text NOT NULL,
	`partner_b` text NOT NULL,
	`compatibility` integer NOT NULL,
	`score_a` integer NOT NULL,
	`score_b` integer NOT NULL,
	`archetype` text NOT NULL,
	`green_partner` text NOT NULL,
	`red_partner` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_test_results_created_at` ON `test_results` (`created_at`);