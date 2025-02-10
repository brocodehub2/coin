
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdraw: (data: { amount: string }) => void;
}

export default function WithdrawDialog({ open, onOpenChange, onWithdraw }: WithdrawDialogProps) {
  const [step, setStep] = useState(1);
  const [paymentMode, setPaymentMode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");

  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet/balance"],
  });

  const handleClose = () => {
    setStep(1);
    setPaymentMode("");
    setUpiId("");
    setAmount("");
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step === 1 && !paymentMode) return;
    if (step === 2 && !upiId) return;
    if (step === 3) {
      const numAmount = Number(amount);
      if (!amount || numAmount <= 0 || numAmount > (walletData?.balance || 0)) return;
    }
    setStep(step + 1);
  };

  const handleConfirm = () => {
    onWithdraw({ amount });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Coins - Step {step} of 3</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Payment Mode</label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!paymentMode}>
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter UPI ID</label>
                <Input
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!upiId}>
                Next
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Amount</label>
                <Input
                  type="number"
                  placeholder="Enter withdrawal amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                  max={walletData?.balance || 0}
                />
                <p className="text-sm text-muted-foreground">
                  Available balance: ₹{walletData?.balance || 0}
                </p>
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!amount || Number(amount) <= 0 || Number(amount) > (walletData?.balance || 0)}>
                Next
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg font-medium">Confirm Withdrawal</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Payment Mode: {paymentMode.toUpperCase()}</p>
                  <p>UPI ID: {upiId}</p>
                  <p>Amount: ₹{amount}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our team will review your request and process the payment to your provided UPI ID very soon.
                </p>
              </div>
              <Button onClick={handleConfirm} className="w-full">
                Confirm Withdrawal
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
