import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle } from "lucide-react";
import { Input } from "src/components/ui/input"; 
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Card, CardContent } from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import EnhancedAstrologerCard from "src/components/astrologer/EnhancedAstrologerCard";
import AstrologerCard from "src/components/astrologer/AstrologerCard";
import ChatModal from "src/components/chat/ChatModal";
import { Helmet } from "react-helmet-async";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

import { Astrologer } from "@shared/schema";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";
import { queryClient } from "src/lib/queryClient";
import { useLanguage } from "src/contexts/LanguageContext";

export default function Astrologers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [serviceContext, setServiceContext] = useState<{service?: string, category?: string}>({});
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  // Handle service-specific filtering from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const service = urlParams.get('service');

    if (category || service) {
      setServiceContext({ category: category || undefined, service: service || undefined });

      // Auto-filter by category if specified
      if (category === 'marriage') {
        setSelectedSpecialization('Marriage & Relationships');
      } else if (category === 'numerology') {
        setSelectedSpecialization('Numerology');
      } else if (category === 'vastu') {
        setSelectedSpecialization('Vastu Shastra');
      }
    }
  }, []);

  const { data: astrologers = [], isLoading } = useQuery<Astrologer[]>({
    queryKey: ["/api/astrologers"],
    refetchInterval: 30000, // Refetch every 30 seconds to get status updates
    staleTime: 15000, // Consider data stale after 15 seconds
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
      setLocation("/login");
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
    
    setLocation(`/payment?${paymentParams.toString()}`);
  };



  return (
    <>
      <Helmet>
        <title>{t('pages.astrologers.pageTitle', 'Expert Astrologers Online | Live Chat & Consultation - AstroTick')}</title>
        <meta name="description" content={t('pages.astrologers.description', 'Consult with experienced Vedic astrologers online. Get instant astrology guidance through live chat, video calls. Certified experts in love, career, marriage, and health predictions.')} />
        <meta name="keywords" content="online astrologer consultation, vedic astrologer chat, astrology expert, live astrologer, astrology consultation online, certified astrologers, experienced astrologers, astrology advice" />
        <link rel="canonical" href="https://astrotick.com/astrologers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Expert Vedic Astrologers - Online Consultation | AstroTick" />
        <meta property="og:description" content="Connect with certified Vedic astrologers for instant guidance on love, career, marriage & health. Professional consultations available 24/7." />
        <meta property="og:url" content="https://astrotick.com/astrologers" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta property="twitter:title" content="Expert Vedic Astrologers - Online Consultation | AstroTick" />
        <meta property="twitter:description" content="Connect with certified Vedic astrologers for instant guidance on love, career, marriage & health. Professional consultations available 24/7." />
        
        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Expert Astrologers",
            "description": "Professional Vedic astrologers available for online consultations",
            "url": "https://astrotick.com/astrologers"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('pages.astrologers.title', 'Our Expert Astrologers')}
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            {t('pages.astrologers.description', 'Choose from our verified astrologers and get personalized guidance for your life\'s journey')}
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
                  placeholder={t('pages.astrologers.searchPlaceholder', 'Search astrologers or specializations...')}
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
                Online Only
              </Button>

              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mystical-blue"
              >
                <option value="">All Specializations</option>
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
                Search: {searchTerm}
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
                Online Only
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
            <h2 className="text-2xl font-bold text-gray-900">Top Online Astrologers</h2>
            <Button variant="outline" className="text-orange-600 border-orange-200">View All</Button>
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







      {/* All Astrologers Grid */}
      <DeferredSection>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-mystical-blue">
              All Astrologers ({filteredAstrologers.length} Available)
            </h2>
            <div className="text-sm text-gray-600">
              {astrologers.filter(a => a.isOnline).length} online now
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAstrologers.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No astrologers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("");
                  setShowOnlineOnly(false);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAstrologers.map((astrologer) => (
                <EnhancedAstrologerCard 
                  key={astrologer.id} 
                  astrologer={astrologer} 
                  onStartChat={() => handleStartChat(astrologer)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      </DeferredSection>

      {/* FAQ Section */}
      <DeferredSection>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our astrology consultation services
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How can I connect with an astrologer?</h3>
                <p className="text-gray-600">
                  Simply browse our list of expert astrologers, select the one that matches your needs, and click "Start Chat" or "Book Consultation". 
                  You can choose from chat, voice call, or video consultation options based on your preference and the astrologer's availability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Does consultation cost more than chat?</h3>
                <p className="text-gray-600">
                  Our pricing varies by astrologer and consultation type. Chat consultations typically range from ₹20-45 per minute, 
                  while voice and video calls may have slightly different rates. All pricing is clearly displayed on each astrologer's profile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How can I choose the best astrologer for me?</h3>
                <p className="text-gray-600">
                  Consider the astrologer's specialization, experience, ratings, and reviews. If you need help with love relationships, 
                  choose someone specializing in marriage compatibility. For career guidance, select experts in career astrology. 
                  You can also filter by language preferences and online availability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How accurate are the predictions?</h3>
                <p className="text-gray-600">
                  Our astrologers use authentic Vedic astrology principles and Swiss Ephemeris calculations for maximum accuracy. 
                  However, astrology provides guidance and insights rather than fixed predictions. The accuracy depends on the quality 
                  of birth details provided and the complexity of the question asked.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Why are some astrologers more expensive?</h3>
                <p className="text-gray-600">
                  Pricing reflects the astrologer's experience, expertise, specializations, and demand. Senior astrologers with 20+ years 
                  of experience and specialized knowledge in areas like KP astrology or Nadi astrology may charge premium rates. 
                  You can find quality consultations across all price ranges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Can I get a refund if not satisfied?</h3>
                <p className="text-gray-600">
                  We strive for complete customer satisfaction. If you're not satisfied with your consultation, please contact our 
                  support team within 24 hours. We'll review your case and provide appropriate resolution, which may include 
                  partial refunds or free follow-up sessions depending on the circumstances.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Start Your Consultation Today
            </Button>
            <p className="text-gray-600 mt-4">
              Join thousands of satisfied customers who found clarity and direction through our expert astrologers
            </p>
          </div>
        </div>
      </section>
      </DeferredSection>

      <Footer />

      </div>
    </>
  );
}