import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GameResult } from "@shared/schema";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { generateNumbers, filterNumbers } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BetDialogProps {
  game: GameResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BetDialog({ game, open, onOpenChange }: BetDialogProps) {
  const [betType, setBetType] = useState<string>("");
  const [betSession, setBetSession] = useState<"OPEN" | "CLOSE">("OPEN");
  const [numbers, setNumbers] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const availableNumbers = betType ? generateNumbers(betType) : [];
  const filteredNumbers = filterNumbers(availableNumbers, search);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/games/${game.id}/bet`, {
        betType,
        session: betType === "jodi" ? undefined : betSession,
        numbers,
        amount: parseInt(amount),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Your bet has been placed successfully!",
      });
      // Reset form
      setBetType("");
      setBetSession("OPEN");
      setNumbers("");
      setAmount("");
      setSearch("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!betType || !numbers || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate();
  };

  const handleNumberSelect = (num: string) => {
    setNumbers(num);
  };

  const handleBetTypeChange = (value: string) => {
    setBetType(value);
    setNumbers("");
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Bet - {game.gameName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Bet Type</Label>
            <Select onValueChange={handleBetTypeChange} value={betType}>
              <SelectTrigger>
                <SelectValue placeholder="Select bet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_digit">Single Digit</SelectItem>
                <SelectItem value="jodi">Jodi</SelectItem>
                <SelectItem value="single_panna">Single Panna</SelectItem>
                <SelectItem value="double_panna">Double Panna</SelectItem>
                <SelectItem value="triple_panna">Triple Panna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {betType && betType !== "jodi" && (
            <div className="space-y-2">
              <Label>Session</Label>
              <Select onValueChange={(value) => setBetSession(value as "OPEN" | "CLOSE")} value={betSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">OPEN</SelectItem>
                  <SelectItem value="CLOSE">CLOSE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {betType && (
            <>
              <div className="space-y-2">
                <Label>Search Numbers</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search numbers..."
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-32 border rounded-md p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {filteredNumbers.map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={numbers === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleNumberSelect(num)}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <Label>Selected Number</Label>
                <Input
                  type="text"
                  value={numbers}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (min. 10 coins)</Label>
                <Input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter bet amount"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Bet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}