import Header from "@/components/Header";
import WalletCard from "@/components/WalletCard";
import Announcement from "@/components/Announcement";
import GameCard from "@/components/GameCard";
import WinnersList from "@/components/WinnersList";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { GameResult } from "@shared/schema";

export default function Home() {
  const { data: games, isLoading } = useQuery<GameResult[]>({
    queryKey: ["/api/games/results"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <WalletCard />
        </div>

        <Announcement />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Latest Games</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {games?.slice(0, 2).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        <WinnersList />

        <section className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {games?.slice(2).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}