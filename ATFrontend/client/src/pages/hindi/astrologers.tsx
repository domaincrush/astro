import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle } from "lucide-react";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Card, CardContent } from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import EnhancedAstrologerCard from "src/components/astrologer/EnhancedAstrologerCard";
import AstrologerCard from "src/components/astrologer/AstrologerCard";
import ChatModal from "src/components/chat/ChatModal";
import { Helmet } from "react-helmet-async";

import { Astrologer } from "@shared/schema";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";
import { queryClient } from "src/lib/queryClient";

export default function HindiAstrologers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [serviceContext, setServiceContext] = useState<{service?: string, category?: string}>({});
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Get astrologers data
  const { data: astrologers = [], isLoading, error } = useQuery({
    queryKey: ["/api/astrologers"],
  });

  // Get all unique specializations
  const allSpecializations = Array.from(
    new Set(astrologers.flatMap(a => a.specializations))
  );

  // Filter astrologers
  const filteredAstrologers = astrologers.filter(astrologer => {
    const matchesSearch = astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         astrologer.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialization = !selectedSpecialization || 
                                 astrologer.specializations.includes(selectedSpecialization);

    const matchesOnlineFilter = !showOnlineOnly || astrologer.isOnline;

    return matchesSearch && matchesSpecialization && matchesOnlineFilter;
  });

  const handleStartChat = async (astrologer: Astrologer) => {
    if (!user?.id) {
      setLocation("/hindi/login");
      return;
    }

    // Redirect to payment page with consultation details (payment-first flow)
    const paymentParams = new URLSearchParams({
      astrologer: astrologer.id.toString(),
      service: 'chat',
      duration: '20',
      price: Math.round(astrologer.ratePerMinute * 20 * 0.85).toString(), // 15% discount
      originalPrice: (astrologer.ratePerMinute * 20).toString(),
      type: 'consultation'
    });
    
    setLocation(`/hindi/payment?${paymentParams.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>वैदिक ज्योतिषी - AstroTick</title>
        <meta name="description" content="भारत के सर्वश्रेष्ठ ज्योतिषियों से संपर्क करें। तुरंत ज्योतिष मार्गदर्शन प्राप्त करें।" />
        <meta name="keywords" content="ऑनलाइन ज्योतिषी परामर्श, वैदिक ज्योतिषी चैट, ज्योतिष विशेषज्ञ, लाइव ज्योतिषी, ज्योतिष परामर्श ऑनलाइन" />
        <link rel="canonical" href="https://astrotick.com/hindi/astrologers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="वैदिक ज्योतिषी - ऑनलाइन परामर्श | AstroTick" />
        <meta property="og:description" content="प्रेम, करियर, विवाह और स्वास्थ्य के लिए प्रमाणित वैदिक ज्योतिषियों से तुरंत मार्गदर्शन प्राप्त करें।" />
        <meta property="og:url" content="https://astrotick.com/hindi/astrologers" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            हमारे विशेषज्ञ <span className="text-yellow-400">ज्योतिषी</span>
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            हमारे सत्यापित ज्योतिषियों में से चुनें और अपनी जीवन यात्रा के लिए व्यक्तिगत मार्गदर्शन प्राप्त करें
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ज्योतिषी खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={showOnlineOnly ? "default" : "outline"}
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={showOnlineOnly ? "bg-emerald-green hover:bg-emerald-green/90 text-white" : ""}
              >
                केवल ऑनलाइन
              </Button>

              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mystical-blue"
              >
                <option value="">सभी विशेषज्ञताएं</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                खोज: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-300 rounded">×</button>
              </Badge>
            )}
            {selectedSpecialization && (
              <Badge variant="secondary" className="gap-1">
                {selectedSpecialization}
                <button onClick={() => setSelectedSpecialization("")} className="ml-1 hover:bg-gray-300 rounded">×</button>
              </Badge>
            )}
            {showOnlineOnly && (
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
                केवल ऑनलाइन
                <button onClick={() => setShowOnlineOnly(false)} className="ml-1 hover:bg-green-200 rounded">×</button>
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Top Online Astrologers Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">शीर्ष ऑनलाइन ज्योतिषी</h2>
            <Button variant="outline" className="text-orange-600 border-orange-200">सभी देखें</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {astrologers.filter(a => a.isOnline).slice(0, 3).map((astrologer) => (
              <AstrologerCard 
                key={astrologer.id} 
                astrologer={astrologer} 
                onStartChat={() => handleStartChat(astrologer)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Astrologers Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            सभी ज्योतिषी ({filteredAstrologers.length})
          </h2>

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>ज्योतिषी लोड हो रहे हैं...</p>
            </div>
          )}

          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                ज्योतिषी लोड करने में त्रुटि। कृपया पुनः प्रयास करें।
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAstrologers.map((astrologer) => (
              <AstrologerCard 
                key={astrologer.id} 
                astrologer={astrologer} 
                onStartChat={() => handleStartChat(astrologer)}
              />
            ))}
          </div>

          {filteredAstrologers.length === 0 && !isLoading && !error && (
            <div className="text-center py-8 text-gray-500">
              <p>कोई ज्योतिषी नहीं मिला। कृपया अपनी खोज मानदंड बदलें।</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}