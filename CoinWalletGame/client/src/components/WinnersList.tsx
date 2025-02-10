
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { GameResult } from "@shared/schema";

// Function to generate a hidden name
const generateHiddenName = () => {
  const names = ["Vikr", "Raje", "Amit", "Sanj", "Rahu", "Priy", "Neer", "Deep"];
  const name = names[Math.floor(Math.random() * names.length)];
  return `${name}${"*".repeat(6)}`;
};

// Function to generate a random prize amount
const generatePrizeAmount = () => {
  return Math.floor(Math.random() * (9000 - 1500 + 1) + 1500);
};

// Function to generate a random past date within last 2 days
const generatePastDate = () => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const randomTime = twoDaysAgo.getTime() + Math.random() * (now.getTime() - twoDaysAgo.getTime());
  return new Date(randomTime).toLocaleDateString();
};

interface Winner {
  id: number;
  name: string;
  gameName: string;
  prize: number;
  date: string;
}

export default function WinnersList() {
  const [winners, setWinners] = useState<Winner[]>([]);
  
  const { data: games } = useQuery<GameResult[]>({
    queryKey: ["/api/games/results"],
  });

  // Generate winners list and update every 24 hours
  useEffect(() => {
    if (!games?.length) return;

    const generateWinners = () => {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: generateHiddenName(),
        gameName: games[Math.floor(Math.random() * games.length)].gameName,
        prize: generatePrizeAmount(),
        date: generatePastDate(),
      }));
    };

    setWinners(generateWinners());
    
    // Update winners every 24 hours
    const interval = setInterval(() => {
      setWinners(generateWinners());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [games]);

  return (
    <Card className="w-full bg-white overflow-hidden">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Winners 🏆</h2>
        <div className="h-[300px] overflow-hidden relative">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="space-y-3"
          >
            {[...winners, ...winners].map((winner, index) => (
              <div
                key={`${winner.id}-${index}`}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-purple-900">{winner.name}</p>
                  <p className="text-sm text-gray-600">{winner.gameName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{winner.prize}</p>
                  <p className="text-xs text-gray-500">{winner.date}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
