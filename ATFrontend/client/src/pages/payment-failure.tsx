import { Link } from "wouter";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 flex items-center justify-center p-4 min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            We couldn't process your payment. This could be due to insufficient funds, network issues, or bank restrictions.
          </p>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700 text-sm">
              No amount has been deducted from your account. Please try again or contact your bank if the issue persists.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/packages">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/astrologers">
              <Button variant="outline" className="w-full">
                Browse Astrologers
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Need help? Contact our support team</p>
          </div>
        </CardContent>
      </Card>
      </div>
      <Footer />
    </div>
  );
}