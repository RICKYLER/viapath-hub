import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  workerName: string;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  workerName,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>
            You are paying <span className="font-bold text-foreground">₱{amount}</span> to <span className="font-bold text-foreground">{workerName}</span> via Stripe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Cardholder Name</label>
            <Input placeholder="Juan Dela Cruz" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Card Details</label>
            <div className="relative">
              <Input 
                placeholder="4242 4242 4242 4242" 
                className="pl-10" 
                maxLength={19}
                required 
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Expiry Date</label>
              <Input placeholder="MM/YY" maxLength={5} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">CVC</label>
              <div className="relative">
                <Input placeholder="123" maxLength={3} required />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 p-2 rounded border border-border/50">
            <ShieldCheck size={14} className="text-success shrink-0" />
            <p>Your payment information is encrypted and processed securely by Stripe. ViaPathHub does not store your card details.</p>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing} size="lg">
            {isProcessing ? "Processing..." : `Pay ₱${amount}`}
          </Button>
        </form>

        <DialogFooter className="sm:justify-center text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <Lock size={12} /> Secure Checkout
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
