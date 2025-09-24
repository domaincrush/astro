import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import PayUPayment from "src/components/payment/PayUPayment";
import { Astrologer } from "@shared/schema";
import { calculateSessionCost, formatPrice } from "src/lib/utils";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [astrologerId, setAstrologerId] = useState<number | null>(null);
  const [sessionMinutes, setSessionMinutes] = useState(15);

  // Get astrologer ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('astrologer');
    if (id) {
      setAstrologerId(parseInt(id));
    } else {
      setLocation('/astrologers');
    }
  }, [setLocation]);

  const { data: astrologer, isLoading } = useQuery<Astrologer>({
    queryKey: ["/api/astrologers", astrologerId],
    enabled: !!astrologerId,
  });

  const handlePaymentSuccess = () => {
    setLocation('/consultations');
  };

  const handleBack = () => {
    setLocation('/astrologers');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-mystical-blue border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="text-2xl font-bold text-mystical-blue mb-4">Astrologer Not Found</h1>
          <Button onClick={handleBack} className="bg-mystical-gold text-mystical-blue hover:bg-yellow-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Astrologers
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const sessionCost = calculateSessionCost(astrologer.ratePerMinute, sessionMinutes);

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-mystical-blue hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Astrologers
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Astrologer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-mystical-blue">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={astrologer.image} 
                  alt={astrologer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-mystical-blue">{astrologer.name}</h3>
                  <p className="text-gray-600">{astrologer.experience} years experience</p>
                  <p className="text-mystical-gold">★ {astrologer.rating} ({astrologer.reviewCount} reviews)</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-mystical-blue mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {astrologer.specializations.map((spec, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-mystical-blue/10 text-mystical-blue rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-mystical-blue mb-2">Languages</h4>
                <p className="text-gray-600">{astrologer.languages.join(", ")}</p>
              </div>

              <div>
                <h4 className="font-semibold text-mystical-blue mb-2">About</h4>
                <p className="text-gray-600">{astrologer.description}</p>
              </div>

              {/* Session Duration Selector */}
              <div>
                <h4 className="font-semibold text-mystical-blue mb-3">Select Session Duration</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={sessionMinutes === minutes ? "default" : "outline"}
                      onClick={() => setSessionMinutes(minutes)}
                      className={sessionMinutes === minutes ? "bg-mystical-blue" : ""}
                    >
                      {minutes} min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Rate per minute:</span>
                  <span className="font-semibold">₹{astrologer.ratePerMinute}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{sessionMinutes} minutes</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-mystical-blue border-t pt-2">
                  <span>Total Amount:</span>
                  <span>{formatPrice(sessionCost)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <div>
            <PayUPayment 
              consultationId={0} // Will be created after payment
              amount={sessionCost}
              astrologerName={astrologer.name}
              onSuccess={handlePaymentSuccess}
              onCancel={handleBack}
            />

            {/* Payment Info */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <h4 className="font-semibold text-mystical-blue mb-2 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Secure Payment
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All payments are processed securely through PayU</li>
                  <li>• Supports Credit/Debit Cards, Net Banking & UPI</li>
                  <li>• Your consultation will start immediately after payment</li>
                  <li>• Get instant access to live chat with your astrologer</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}