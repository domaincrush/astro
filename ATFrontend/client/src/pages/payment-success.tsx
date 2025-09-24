import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle, ArrowLeft, Wallet } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function PaymentSuccess() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const amount = searchParams.get('amount');
  const txnid = searchParams.get('txnid');
  const paymentMethod = searchParams.get('paymentmethod') || 'PayU Gateway';
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    // Optional: Refresh user data to show updated wallet balance
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {amount && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">₹{amount} added to your wallet</span>
              </div>
            </div>
          )}
          
          {/* Transaction Details */}
          <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
            <h3 className="font-semibold text-gray-800 text-center mb-3">Transaction Details</h3>
            <div className="text-sm space-y-1">
              {txnid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800">{txnid}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="text-gray-800">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="text-gray-800">{timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">Successful</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            Your payment has been processed successfully through PayU Gateway. You can now use your wallet balance for consultations with our verified astrologers.
          </p>
          
          <div className="space-y-3">
            <Link href="/packages">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Wallet className="w-4 h-4 mr-2" />
                View Wallet
              </Button>
            </Link>
            
            <Link href="/astrologers">
              <Button variant="outline" className="w-full">
                Find Astrologers
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}