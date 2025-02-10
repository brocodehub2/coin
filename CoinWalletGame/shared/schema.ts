import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wallet = pgTable("wallet", {
  id: serial("id").primaryKey(),
  balance: integer("balance").notNull().default(0),
});

export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  gameName: text("game_name").notNull(),
  openNumber: integer("open_number").notNull(),
  openResult: integer("open_result").notNull(),
  closeNumber: integer("close_number").notNull(),
  closeResult: integer("close_result").notNull(),
  openTime: text("open_time").notNull(),
  closeTime: text("close_time").notNull(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  betType: text("bet_type").notNull(),
  session: text("session"),
  numbers: text("numbers").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  result: text("result").notNull().default("pending"),
});

// Validation schemas
export const betTypeSchema = z.enum([
  "single_digit",
  "jodi",
  "single_panna",
  "double_panna",
  "triple_panna"
]);

export const betSchema = z.object({
  gameId: z.number().int(),
  betType: betTypeSchema,
  numbers: z.string(),
  amount: z.number().int().min(10, "Minimum bet amount is 10 coins"),
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({ id: true });
export const insertBetSchema = createInsertSchema(bets).omit({ id: true, status: true, createdAt: true, result: true });

export const walletTransactionSchema = z.object({
  amount: z.number().int().min(1),
  type: z.enum(["add", "withdraw"])
});

// Types
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type GameResult = typeof gameResults.$inferSelect;
export type WalletTransaction = z.infer<typeof walletTransactionSchema>;
export type Wallet = typeof wallet.$inferSelect;
export type Bet = typeof bets.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;
export type BetType = z.infer<typeof betTypeSchema>;