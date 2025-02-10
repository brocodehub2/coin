import { gameResults, type GameResult, type InsertGameResult, type Wallet, type WalletTransaction, type Bet, type InsertBet } from "@shared/schema";

export interface IStorage {
  getWalletBalance(): Promise<number>;
  updateWalletBalance(transaction: WalletTransaction): Promise<number>;
  getGameResults(): Promise<GameResult[]>;
  addGameResult(result: InsertGameResult): Promise<GameResult>;
  createBet(bet: InsertBet): Promise<Bet>;
  getBetsByGameId(gameId: number): Promise<Bet[]>;
  getUserBets(): Promise<(Bet & { gameName: string })[]>;
  deleteBet(betId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private balance: number;
  private results: GameResult[];
  private bets: Bet[];
  private currentId: number;
  private betId: number;

  constructor() {
    this.balance = 1000; // Starting balance
    this.results = [];
    this.bets = [];
    this.currentId = 1;
    this.betId = 1;

    // Add some initial game results
    this.addMockGameResults();
  }

  private addMockGameResults() {
    const mockResults: InsertGameResult[] = [
      {
        gameName: "Lucky Draw",
        openNumber: 123,
        openResult: 6,
        closeNumber: 456,
        closeResult: 15,
        openTime: "10:00 AM",
        closeTime: "8:00 PM"
      },
      {
        gameName: "Fortune Wheel",
        openNumber: 789,
        openResult: 24,
        closeNumber: 234,
        closeResult: 9,
        openTime: "11:00 AM",
        closeTime: "9:00 PM"
      }
    ];

    mockResults.forEach(result => this.addGameResult(result));
  }

  async getWalletBalance(): Promise<number> {
    return this.balance;
  }

  async updateWalletBalance(transaction: WalletTransaction): Promise<number> {
    if (transaction.type === "withdraw" && transaction.amount > this.balance) {
      throw new Error("Insufficient balance");
    }

    this.balance += transaction.type === "add" ? transaction.amount : -transaction.amount;
    return this.balance;
  }

  async getGameResults(): Promise<GameResult[]> {
    return this.results;
  }

  async addGameResult(result: InsertGameResult): Promise<GameResult> {
    const newResult = {
      ...result,
      id: this.currentId++
    };
    this.results.push(newResult);
    return newResult;
  }

  async createBet(bet: InsertBet): Promise<Bet> {
    const newBet: Bet = {
      ...bet,
      id: this.betId++,
      status: "pending",
      createdAt: new Date().toISOString(),
      result: "pending"
    };
    this.bets.push(newBet);
    return newBet;
  }

  async getBetsByGameId(gameId: number): Promise<Bet[]> {
    this.clearOldBets();
    return this.bets.filter(bet => bet.gameId === gameId);
  }

  async getUserBets(): Promise<(Bet & { gameName: string })[]> {
    this.clearOldBets();
    return this.bets.map(bet => {
      const game = this.results.find(game => game.id === bet.gameId);
      return {
        ...bet,
        gameName: game?.gameName || "Unknown Game"
      };
    });
  }

  async deleteBet(betId: number): Promise<void> {
    const betIndex = this.bets.findIndex(bet => bet.id === betId);
    if (betIndex === -1) {
      throw new Error("Bet not found");
    }
    this.bets.splice(betIndex, 1);
  }

  private clearOldBets(): void {
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    this.bets = this.bets.filter(bet => {
      const betDate = new Date(bet.createdAt);
      return betDate > twelveHoursAgo || bet.status === "pending";
    });
  }
}

export const storage = new MemStorage();