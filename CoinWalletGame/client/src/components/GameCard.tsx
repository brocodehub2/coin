import { Card, CardContent } from "@/components/ui/card";
import BetDialog from "./BetDialog";
import type { GameResult } from "@shared/schema";
import { useState } from "react";
import { calculateDigitSum, getCloseNumber } from "@/lib/utils";

interface GameCardProps {
  game: GameResult;
}

export default function GameCard({ game }: GameCardProps) {
  const [showBetDialog, setShowBetDialog] = useState(false);

  // Calculate sums
  const openSum = calculateDigitSum(game.openNumber);
  const closeSum = calculateDigitSum(game.closeNumber);

  return (
    <>
      <Card 
        className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
        onClick={() => setShowBetDialog(true)}
      >
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-left">
              <p className="text-sm text-gray-600">OPEN</p>
              <p className="font-bold">{game.openNumber} = {openSum}</p>
              <p className="text-sm text-gray-500">{game.openTime}</p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-600">{game.gameName}</h3>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">CLOSE</p>
              <p className="font-bold">{closeSum} = {getCloseNumber(closeSum)}</p>
              <p className="text-sm text-gray-500">{game.closeTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BetDialog 
        game={game} 
        open={showBetDialog}
        onOpenChange={setShowBetDialog}
      />
    </>
  );
}