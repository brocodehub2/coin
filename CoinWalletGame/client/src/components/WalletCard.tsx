
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AddCoinDialog from "./AddCoinDialog";
import WithdrawDialog from "./WithdrawDialog";

export default function WalletCard() {
  const { toast } = useToast();
  const [showAddCoinDialog, setShowAddCoinDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState<{amount: string} | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const handleAddCoin = async (amount: number) => {
    try {
      await apiRequest("POST", "/api/wallet/transaction", { amount, type: "add" });
      toast({
        title: "Success",
        description: `Added ₹${amount} to your wallet`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async (data: { amount: string }) => {
    try {
      // Only set withdrawal status without deducting balance
      setWithdrawalStatus(data);
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-500 to-indigo-600">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Coin Wallet</h2>
            <div className="text-4xl font-bold text-white">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              ) : (
                <span>₹{data?.balance || 0}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => setShowAddCoinDialog(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              Add Coin
            </Button>
            <Button 
              onClick={() => setShowWithdrawDialog(true)}
              disabled={!!withdrawalStatus}
              className="bg-red-500 hover:bg-red-600"
            >
              Withdraw Coin
            </Button>
            {withdrawalStatus && (
              <p className="text-sm text-white">Withdrawal request pending: ₹{withdrawalStatus.amount}</p>
            )}
            <Button variant="secondary">Support</Button>
          </div>
        </CardContent>
      </Card>

      <AddCoinDialog
        open={showAddCoinDialog}
        onOpenChange={setShowAddCoinDialog}
        onAddCoin={handleAddCoin}
      />
      <WithdrawDialog
        open={showWithdrawDialog}
        onOpenChange={setShowWithdrawDialog}
        onWithdraw={handleWithdraw}
      />
    </>
  );
}
