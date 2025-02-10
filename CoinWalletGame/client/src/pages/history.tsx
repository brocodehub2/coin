import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Bet } from "@shared/schema";

export default function History() {
  const { data: bets, isLoading } = useQuery<(Bet & { gameName: string })[]>({
    queryKey: ["/api/bets"],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Betting History</h1>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {bets?.map((bet) => (
            <Card key={bet.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Game</p>
                    <p className="font-medium">{bet.gameName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bet Type</p>
                    <p className="font-medium capitalize">{bet.betType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session</p>
                    <p className="font-medium">{bet.betType === 'jodi' ? '-' : bet.session}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Session</p>
                    <p className="font-medium">{bet.betType === 'jodi' ? '-' : bet.session || 'OPEN'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numbers</p>
                    <p className="font-medium">{bet.numbers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">₹{bet.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{bet.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {bets?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No betting history available
            </div>
          )}
        </div>
      )}
    </div>
  );
}