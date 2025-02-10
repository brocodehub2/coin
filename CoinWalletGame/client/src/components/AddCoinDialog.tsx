import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

interface AddCoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCoin: (amount: number) => void;
}

export default function AddCoinDialog({ open, onOpenChange, onAddCoin }: AddCoinDialogProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const UPI_ID = "coingame@upi"; // Replace with actual UPI ID

  const handleNextStep = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "UPI ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setCopied(false);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onAddCoin(Number(amount));
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Coins - Step {step} of 2</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleNextStep} className="w-full">
                Next
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Amount to Add</p>
                <p className="text-2xl font-bold">₹{amount}</p>
              </div>

              <div className="flex justify-center">
                <QRCodeSVG
                  value={`upi://pay?pa=${UPI_ID}&am=${amount}&cu=INR`}
                  size={200}
                  includeMargin
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">UPI ID</p>
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <code className="flex-1 text-center">{UPI_ID}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyUPI}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Confirm Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
