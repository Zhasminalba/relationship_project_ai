import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testResults = sqliteTable(
  "test_results",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    partnerA: text("partner_a").notNull(),
    partnerB: text("partner_b").notNull(),
    compatibility: integer("compatibility").notNull(),
    scoreA: integer("score_a").notNull(),
    scoreB: integer("score_b").notNull(),
    archetype: text("archetype").notNull(),
    greenPartner: text("green_partner").notNull(),
    redPartner: text("red_partner").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_test_results_created_at").on(table.createdAt)],
);
