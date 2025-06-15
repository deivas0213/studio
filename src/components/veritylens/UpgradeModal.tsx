
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext"; 
import { Zap, Gem, X, Star } from "lucide-react";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { toast } = useToast();
  const { setSubscriptionStatus } = useSubscription(); 

  const handleUpgrade = (plan: string) => {
    setSubscriptionStatus('premium'); 
    toast({
      title: "VIP Access Unlocked! (Mock)",
      description: `You've been upgraded to ${plan}! Enjoy unlimited scans and all VIP features.`,
      variant: "default", // Or a 'success' variant if you have one
    });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border shadow-xl rounded-20px">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full inline-flex">
            <Star className="h-10 w-10 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-primary">Unlock VIP Access!</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground pt-2">
            Go VIP to enjoy unlimited image scans, access to exclusive features like advanced analytics (coming soon!), priority support, and an ad-free experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 my-6 px-2">
            <Button 
              className="w-full app-button text-base py-3"
              onClick={() => handleUpgrade("Monthly VIP Plan")}
            >
              <Zap className="mr-2 h-5 w-5" /> Go VIP - Monthly Plan
            </Button>
            <Button 
              variant="outline"
              className="w-full app-button !bg-secondary !text-secondary-foreground !border-secondary hover:!bg-opacity-80 text-base py-3"
              onClick={() => handleUpgrade("Annual VIP Plan (Best Value)")}
            >
              <Gem className="mr-2 h-5 w-5" /> Go VIP - Annual Plan (Save 20%)
            </Button>
        </div>

        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel 
            onClick={onClose} 
            className="w-full sm:w-auto text-muted-foreground hover:bg-muted/50 border-muted/50"
          >
            Maybe Later
          </AlertDialogCancel>
        </AlertDialogFooter>
         <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full h-8 w-8"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
