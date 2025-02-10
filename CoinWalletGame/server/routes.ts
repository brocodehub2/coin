import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { walletTransactionSchema, betSchema } from "@shared/schema";
import { ZodError } from "zod";

export function registerRoutes(app: Express): Server {
  app.get("/api/wallet/balance", async (req, res) => {
    const balance = await storage.getWalletBalance();
    res.json({ balance });
  });

  app.post("/api/wallet/transaction", async (req, res) => {
    try {
      const transaction = walletTransactionSchema.parse(req.body);
      const newBalance = await storage.updateWalletBalance(transaction);
      res.json({ balance: newBalance });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid transaction data" });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  });

  app.get("/api/games/results", async (req, res) => {
    const results = await storage.getGameResults();
    res.json(results);
  });

  app.post("/api/games/:gameId/bet", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const bet = betSchema.parse({ ...req.body, gameId });

      // Check if user has enough balance
      const balance = await storage.getWalletBalance();
      if (balance < bet.amount) {
        throw new Error("Insufficient balance for bet");
      }

      // Create bet and deduct balance
      const newBet = await storage.createBet({
        ...bet,
        status: "pending",
        createdAt: new Date().toISOString(),
        result: "pending"
      });

      await storage.updateWalletBalance({
        amount: bet.amount,
        type: "withdraw"
      });

      res.json(newBet);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid bet data" });
      } else {
        res.status(400).json({ message: (error as Error).message });
      }
    }
  });

  app.get("/api/games/:gameId/bets", async (req, res) => {
    const gameId = parseInt(req.params.gameId);
    const bets = await storage.getBetsByGameId(gameId);
    res.json(bets);
  });

  app.get("/api/bets", async (req, res) => {
    const bets = await storage.getUserBets();
    res.json(bets);
  });

  app.delete("/api/bets/:id", async (req, res) => {
    try {
      const betId = parseInt(req.params.id);
      await storage.deleteBet(betId);
      res.json({ message: "Bet deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}