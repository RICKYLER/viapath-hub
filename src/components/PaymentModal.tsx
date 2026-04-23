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
  const [method, setMethod] = useState<'card' | 'gcash' | 'maya'>('card');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Secure Checkout
          </DialogTitle>
          <DialogDescription>
            Pay <span className="font-bold text-foreground">₱{amount}</span> for service by <span className="font-bold text-foreground">{workerName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 p-1 bg-muted rounded-lg mt-4">
          <button 
            onClick={() => setMethod('card')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${method === 'card' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            Credit Card
          </button>
          <button 
            onClick={() => setMethod('gcash')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${method === 'gcash' ? 'bg-[#007DFE] text-white' : 'text-muted-foreground'}`}
          >
            GCash
          </button>
          <button 
            onClick={() => setMethod('maya')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${method === 'maya' ? 'bg-[#31C13C] text-white' : 'text-muted-foreground'}`}
          >
            Maya
          </button>
        </div>

        <form onSubmit={handlePayment} className="space-y-4 py-4">
          {method === 'card' ? (
            <>
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
            </>
          ) : (
            <div className="space-y-4 py-6 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${method === 'gcash' ? 'bg-[#007DFE]/10' : 'bg-[#31C13C]/10'}`}>
                <span className={`text-2xl font-black ${method === 'gcash' ? 'text-[#007DFE]' : 'text-[#31C13C]'}`}>
                  {method === 'gcash' ? 'G' : 'M'}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Registered Phone Number</label>
                <Input placeholder="09XX XXX XXXX" className="text-center text-lg tracking-widest" maxLength={11} required />
              </div>
              <p className="text-[10px] text-muted-foreground px-6">
                A verification code will be sent to your number to authorize this transaction.
              </p>
            </div>
          )}

          <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <ShieldCheck size={14} />
              ViaPathHub Escrow Guarantee
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Your payment will be held securely by ViaPathHub. We only release the funds to the worker after you confirm the job is completed successfully.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing} size="lg">
            {isProcessing ? "Connecting to Provider..." : `Authorize ₱${amount}`}
          </Button>
        </form>

        <DialogFooter className="sm:justify-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <p className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-success" /> PCI-DSS Compliant Secure Payment
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
