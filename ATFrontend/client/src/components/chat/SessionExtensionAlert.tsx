import { useState } from "react";
import { Clock, CreditCard, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Card, CardContent } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { formatPrice } from "src/lib/utils";

interface ExtensionOption {
  duration: number; // in minutes
  cost: number; // in paise
}

interface SessionExtensionAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: (duration: number, paymentMethod: 'wallet' | 'payment') => void;
  remainingMinutes: number;
  astrologerRate: number; // per minute in paise
  walletBalance: number; // in paise
  isLoading?: boolean;
}

export default function SessionExtensionAlert({
  isOpen,
  onClose,
  onExtend,
  remainingMinutes,
  astrologerRate,
  walletBalance,
  isLoading = false
}: SessionExtensionAlertProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const extensionOptions: ExtensionOption[] = [
    { duration: 5, cost: astrologerRate * 5 },
    { duration: 10, cost: astrologerRate * 10 },
    { duration: 15, cost: astrologerRate * 15 },
    { duration: 20, cost: astrologerRate * 20 }
  ];

  const selectedOption = extensionOptions.find(opt => opt.duration === selectedDuration);
  const canPayWithWallet = selectedOption ? walletBalance >= selectedOption.cost : false;
  const shortfall = selectedOption ? Math.max(0, selectedOption.cost - walletBalance) : 0;

  const handleExtend = (paymentMethod: 'wallet' | 'payment') => {
    if (selectedDuration) {
      onExtend(selectedDuration, paymentMethod);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Session Ending Soon
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Time Warning */}
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-lg font-semibold text-orange-800 mb-1">
              {remainingMinutes} minute{remainingMinutes !== 1 ? 's' : ''} remaining
            </p>
            <p className="text-sm text-orange-600">
              Your consultation will end automatically when time expires
            </p>
          </div>

          {/* Wallet Balance */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="font-medium">Wallet Balance</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {formatPrice(walletBalance)}
            </Badge>
          </div>

          {/* Extension Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Choose Extension Duration</h4>
            <div className="grid grid-cols-2 gap-3">
              {extensionOptions.map((option) => {
                const isSelected = selectedDuration === option.duration;
                const canAfford = walletBalance >= option.cost;
                
                return (
                  <Card
                    key={option.duration}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDuration(option.duration)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-semibold">{option.duration} min</div>
                      <div className="text-sm text-gray-600 mb-2">
                        {formatPrice(option.cost)}
                      </div>
                      {!canAfford && (
                        <Badge variant="secondary" className="text-xs">
                          Wallet + Pay {formatPrice(option.cost - walletBalance)}
                        </Badge>
                      )}
                      {canAfford && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Use Wallet
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment Options */}
          {selectedOption && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Payment Options</h4>
              
              {canPayWithWallet ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleExtend('wallet')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Pay with Wallet - {formatPrice(selectedOption.cost)}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Remaining balance: {formatPrice(walletBalance - selectedOption.cost)}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Extension cost:</span>
                      <span>{formatPrice(selectedOption.cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wallet balance:</span>
                      <span>{formatPrice(walletBalance)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Amount to pay:</span>
                      <span className="text-red-600">{formatPrice(shortfall)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleExtend('payment')}
                    disabled={isLoading}
                    className="w-full"
                    variant="default"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay {formatPrice(shortfall)} to Extend
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Wallet balance will be used first, then payment for remaining amount
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Continue Without Extension
            </Button>
            
            {!selectedOption && (
              <Button disabled className="flex-1">
                Select Duration First
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            Session will end automatically if no extension is selected before time expires
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}