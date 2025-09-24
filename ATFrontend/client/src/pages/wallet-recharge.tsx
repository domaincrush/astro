import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Wallet, Gift, Shield, CheckCircle, X } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";
import { apiRequest, queryClient } from "src/lib/queryClient";

interface RechargeOption {
  amount: number;
  bonus: number;
  popular?: boolean;
  discount?: string;
}

export default function WalletRecharge() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  const { data: userBalance } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: !!user,
  });

  const rechargeOptions: RechargeOption[] = [
    { amount: 25, bonus: 5, discount: "Get ₹ 5 extra" },
    { amount: 49, bonus: 30, discount: "Get ₹ 30 extra" },
    { amount: 99, bonus: 40, discount: "Get ₹ 40 extra" },
    { amount: 200, bonus: 80, discount: "Get ₹ 80 extra" },
    { amount: 500, bonus: 150, discount: "Get ₹ 150 extra", popular: true },
    { amount: 1000, bonus: 100, discount: "Get ₹ 100 extra" },
    { amount: 2000, bonus: 900, discount: "Get ₹ 900 extra" },
    { amount: 5000, bonus: 600, discount: "Get ₹ 600 extra" },
    { amount: 10000, bonus: 1500, discount: "Get ₹ 1500 extra" },
    { amount: 20000, bonus: 4000, discount: "Get ₹ 4000 extra" },
    { amount: 50000, bonus: 10000, discount: "Get ₹ 10000 extra" },
    { amount: 100000, bonus: 20000, discount: "Get ₹ 20000 extra" },
  ];

  const paymentMutation = useMutation({
    mutationFn: async (data: { amount: number; couponCode?: string }) => {
      const response = await apiRequest("POST", "/api/payments/create", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.paymentUrl && data.paymentData) {
        // Create PayU form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.paymentUrl;
        
        Object.entries(data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/coupons/apply", { code });
      return response.json();
    },
    onSuccess: (data) => {
      setAppliedCoupon({ code: couponCode, discount: data.discount });
      setShowCouponInput(false);
      toast({
        title: "Coupon Applied",
        description: `₹${data.discount} cashback applied successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Invalid Coupon",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getSelectedOption = () => {
    if (selectedAmount) {
      return rechargeOptions.find(opt => opt.amount === selectedAmount);
    }
    if (customAmount && parseInt(customAmount) >= 25) {
      return { amount: parseInt(customAmount), bonus: 0 };
    }
    return null;
  };

  const handleProceedToPay = () => {
    const option = getSelectedOption();
    if (!option) return;

    paymentMutation.mutate({
      amount: option.amount,
      couponCode: appliedCoupon?.code,
    });
  };

  const selectedOption = getSelectedOption();
  const finalAmount = selectedOption ? selectedOption.amount : 0;
  const cashback = selectedOption ? (selectedOption.bonus || 0) + (appliedCoupon?.discount || 0) : 0;
  const gstAmount = Math.round(finalAmount * 0.18);
  const totalAmount = finalAmount + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recharge Options */}
          <div className="lg:col-span-2">
            {/* Wallet Balance */}
            <Card className="mb-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Wallet Balance</h2>
                    <div className="text-3xl font-bold">₹ {((userBalance as any)?.balance / 100)?.toFixed(2) || "0.00"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cashback Offer Banner */}
            <Card className="mb-6 bg-gradient-to-r from-green-400 to-green-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    <span className="font-medium">₹30 Cashback</span>
                  </div>
                  <div className="bg-green-600 px-3 py-1 rounded-full text-sm">
                    Offer applied successfully
                  </div>
                </div>
                <div className="text-sm mt-1">You will get ₹ 30 extra with this recharge</div>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Redeem your coupon here</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowCouponInput(!showCouponInput)}
                    className="text-yellow-700 hover:text-yellow-800"
                  >
                    →
                  </Button>
                </div>
                
                {showCouponInput && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <Button 
                      onClick={() => applyCouponMutation.mutate(couponCode)}
                      disabled={!couponCode || applyCouponMutation.isPending}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between bg-green-100 p-2 rounded-md">
                    <span className="text-green-800">Coupon "{appliedCoupon.code}" applied</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-800 hover:text-green-900"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recharge Wallet Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Recharge Wallet</h2>
                <div className="text-sm text-gray-600 mb-6">
                  Consult with Astro Premansh for 6 minutes
                </div>

                {/* Amount Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {rechargeOptions.map((option) => (
                    <div
                      key={option.amount}
                      onClick={() => handleAmountSelect(option.amount)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAmount === option.amount
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option.popular && (
                        <Badge className="absolute -top-2 left-2 bg-orange-500 text-white text-xs">
                          Popular
                        </Badge>
                      )}
                      <div className="text-center">
                        <div className="text-2xl font-bold">₹ {option.amount}</div>
                        <div className="text-xs text-orange-500 font-medium mt-1">
                          {option.discount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter custom amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount (min ₹25)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="25"
                  />
                </div>

                {/* Minimum Balance Note */}
                <div className="bg-blue-50 p-3 rounded-md mb-6">
                  <div className="flex items-center gap-2 text-blue-700 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Minimum 5 mins balance required to consult</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bill Summary */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Bill Summary</h3>
                  <Badge className="bg-orange-100 text-orange-700">Mini Pack</Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Talk time</span>
                    <span>₹ {finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recharge Amount</span>
                    <span>₹ {finalAmount.toFixed(2)}</span>
                  </div>
                  {cashback > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Cashback</span>
                      <span>₹ {cashback.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST charges(18 %)</span>
                    <span>₹ {gstAmount.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>To Pay</span>
                    <span>₹ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {cashback > 0 && (
                  <div className="bg-green-50 p-3 rounded-md mb-6">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Woohoo you got {cashback} loyalty points!</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleProceedToPay}
                  disabled={!selectedOption || paymentMutation.isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-bold"
                >
                  {paymentMutation.isPending ? "Processing..." : "PROCEED TO PAY"}
                </Button>

                {/* Trust Indicators */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Verified Expert Astrologers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>100% Secure Payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}