import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, MessageCircle, Star, Clock } from "lucide-react";
import { Input } from "src/components/ui/input"; 
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Card, CardContent } from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Astrologer } from "@shared/schema";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";

const TamilAstrologers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  const { data: astrologers = [], isLoading } = useQuery<Astrologer[]>({
    queryKey: ["/api/astrologers"],
    refetchInterval: 30000,
    staleTime: 15000,
  });

  // Tamil specialization mapping
  const specializationMap = {
    'Vedic Astrology': 'வேத ஜோதிடம்',
    'Numerology': 'எண் ஜோதிடம்',
    'Vastu Shastra': 'வாஸ்து சாஸ்திரம்',
    'Marriage & Relationships': 'திருமணம் & உறவுகள்',
    'Career Guidance': 'தொழில் வழிகாட்டுதல்',
    'Health Astrology': 'ஆரோக்கிய ஜோதிடம்',
    'Financial Astrology': 'நிதி ஜோதிடம்',
    'Horary Astrology': 'ப்ரஸ்ன ஜோதிடம்',
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>தமிழ் ஜோதிடர்கள் | Tamil Astrologers Online Consultation</title>
        <meta name="description" content="அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் ஆன்லைன் ஆலோசனை. காதல், திருமணம், தொழில், ஆரோக்கியம் பற்றிய துல்லியமான பலன்கள்." />
        <meta property="og:title" content="தமிழ் ஜோதிடர்கள் | Tamil Astrologers Online Consultation" />
        <meta property="og:description" content="அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் ஆன்லைன் ஆலோசனை. காதல், திருமணம், தொழில், ஆரோக்கியம் பற்றிய துல்லியமான பலன்கள்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Tamil Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              தமிழ் ஜோதிடர்கள்
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் நேரடியாக பேசி உங்கள் வாழ்க்கையின் அனைத்து கேள்விகளுக்கும் பதில் பெறுங்கள்
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="ஜோதிடர் பெயர் தேடுங்கள்..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:border-orange-400 focus:outline-none"
              >
                <option value="">அனைத்து துறைகள்</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>
                    {specializationMap[spec as keyof typeof specializationMap] || spec}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="onlineOnly"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="onlineOnly" className="text-slate-700">
                  ஆன்லைனில் இருப்பவர்கள் மட்டும்
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Astrologers Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAstrologers.length === 0 ? (
            <Alert>
              <AlertDescription>
                தற்போது எந்த ஜோதிடர்களும் கிடைக்கவில்லை. தயவுசெய்து பின்னர் முயற்சிக்கவும்.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAstrologers.map((astrologer, index) => (
                <motion.div
                  key={astrologer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {astrologer.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {astrologer.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className={`text-sm ${astrologer.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                              {astrologer.isOnline ? 'ஆன்லைனில்' : 'ஆஃப்லைன்'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-slate-600">
                              {astrologer.rating || 4.5} ({astrologer.reviewCount || 0} ஆலோசனைகள்)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {astrologer.specializations.slice(0, 3).map(spec => (
                            <Badge key={spec} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              {specializationMap[spec as keyof typeof specializationMap] || spec}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{astrologer.experience || 5}+ வருட அனுபவம்</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="font-semibold text-green-600">
                            ₹{astrologer.ratePerMinute || 10}/நிமிடம்
                          </span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        onClick={() => setLocation(`/tamil/astrologer/${astrologer.id}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        பேசுங்கள்
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TamilAstrologers;
