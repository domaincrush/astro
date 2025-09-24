import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { DollarSign, TrendingUp, Home, Coins, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function WealthFinanceAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <AstroTickHeader />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Wealth & Finance Astrology
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Unlock your financial potential through planetary analysis. Discover wealth yoga, 
            investment timing, property acquisition, and money management strategies.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-amber-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Coins className="h-8 w-8 text-amber-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Dhana Yoga Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">2nd House - Accumulated Wealth</h4>
                  <p className="text-gray-600 text-sm">Bank balance, savings, and family wealth analysis</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">11th House - Income Sources</h4>
                  <p className="text-gray-600 text-sm">Multiple income streams and profit from investments</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-yellow-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Investment Timing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Jupiter Transit Opportunities</h4>
                  <p className="text-gray-600 text-sm">Best periods for long-term investment and wealth building</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mercury Periods for Trading</h4>
                  <p className="text-gray-600 text-sm">Short-term trading and business profit opportunities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Maximize Your Wealth Potential?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Wealth Astrologer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}