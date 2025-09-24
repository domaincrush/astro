import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Loader2, CreditCard, Shield } from "lucide-react";
import { apiRequest } from "src/lib/queryClient";

interface PayUGatewayProps {
  amount: number; // Amount in paise
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
  userEmail: string;
  userName: string;
}

export default function PayUGateway({
  amount,
  description,
  onSuccess,
  onCancel,
  userEmail,
  userName
}: PayUGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Generate payment data on server
      const response = await apiRequest("POST", "/api/payment/payu/create", {
        amount: amount / 100, // Convert paise to rupees
        productinfo: description,
        firstname: userName,
        email: userEmail,
      });

      const paymentData = await response.json();
      
      // Create form and submit to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment'; // Production URL
      
      // Add all required fields
      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Complete Payment</CardTitle>
        <p className="text-gray-600 text-sm">
          Secure payment powered by PayU
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount to pay:</span>
            <span className="font-semibold text-lg">₹{(amount / 100).toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-center text-gray-500">
          You will be redirected to PayU secure payment page
        </div>
      </CardContent>
    </Card>
  );
}