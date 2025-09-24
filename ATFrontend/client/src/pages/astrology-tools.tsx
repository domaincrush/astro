import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import BirthChartGenerator from "src/components/astrology/BirthChartGenerator";
import CompatibilityCalculator from "src/components/astrology/CompatibilityCalculator";
import DailyHoroscope from "src/components/astrology/DailyHoroscope";
import { 
  Star, 
  Heart, 
  Calendar, 
  Globe, 
  Moon, 
  Sun,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Zap,
  Users,
  Coins
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { trackEvent } from "src/lib/analytics";

interface AdvancedCalculationResult {
  success: boolean;
  standardEphemeris: {
    planets: Array<{
      name: string;
      longitude: number;
      latitude: number;
      distance: number;
      speed: number;
      retrograde: boolean;
    }>;
    ayanamsa: number;
  };
  kpSystem: {
    ascendant: number;
    ascendantSign: string;
    ascendantDegree: string;
    cusps: any[];
  };
  advancedAnalysis: {
    significators: any[];
    cuspalWealth: { level: number; description: string };
    panchangaGroup: { 
      groupStrength: number; 
      cooperatingPlanets: string[];
      description: string;
    };
  };
  comparison: {
    standardAscendant: number;
    kpAscendant: number;
    difference: number;
  };
}

export default function AstrologyTools() {
  const [activeTab, setActiveTab] = useState("birth-chart");
  const [formData, setFormData] = useState({
    date: "1988-08-25",
    time: "00:40",
    latitude: "13.0827",
    longitude: "80.2707",
    place: "Chennai, India"
  });

  const { toast } = useToast();

  const tools = [
    {
      id: "birth-chart",
      title: "Birth Chart Generator",
      description: "Generate your complete natal chart with planetary positions and detailed interpretations",
      icon: <Star className="h-6 w-6" />,
      color: "from-blue-500 to-purple-600",
      price: 299,
      originalPrice: 499,
      isPopular: false,
      features: ["Complete Birth Chart", "Planetary Positions", "House Analysis", "PDF Report"]
    },
    {
      id: "compatibility",
      title: "Compatibility Calculator",
      description: "Analyze relationship compatibility between two people using synastry",
      icon: <Heart className="h-6 w-6" />,
      color: "from-pink-500 to-rose-600",
      price: 399,
      originalPrice: 699,
      isPopular: true,
      features: ["Love Compatibility", "Marriage Analysis", "Synastry Report", "Relationship Guidance"]
    },
    {
      id: "daily-horoscope",
      title: "Daily Horoscope",
      description: "Get personalized daily predictions based on your zodiac sign",
      icon: <Calendar className="h-6 w-6" />,
      color: "from-orange-500 to-red-600",
      price: 99,
      originalPrice: 199,
      isPopular: false,
      features: ["Daily Predictions", "Lucky Numbers", "Color Therapy", "Timing Guidance"]
    },
    {
      id: "advanced-calculations",
      title: "Advanced Analysis",
      description: "Professional-grade calculations with enhanced astronomical precision",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-purple-500 to-indigo-600",
      price: 799,
      originalPrice: 1299,
      isPopular: true,
      features: ["KP System Analysis", "Wealth Predictions", "Career Guidance", "Detailed Report"]
    },
    {
      id: "panchang",
      title: "Panchang Calculator",
      description: "Get detailed daily panchang with tithi, nakshatra, and muhurat timings",
      icon: <Sun className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-600",
      price: 199,
      originalPrice: 299,
      isPopular: false,
      features: ["Daily Panchang", "Muhurat Times", "Festival Dates", "Auspicious Timings"]
    },
    {
      id: "numerology",
      title: "Numerology Analysis",
      description: "Comprehensive numerological analysis based on your name and birth date",
      icon: <BookOpen className="h-6 w-6" />,
      color: "from-green-500 to-teal-600",
      price: 249,
      originalPrice: 399,
      isPopular: false,
      features: ["Life Path Number", "Destiny Number", "Lucky Numbers", "Name Analysis"]
    },
    {
      id: "vastu",
      title: "Vastu Consultation",
      description: "Get detailed vastu analysis for your home or office space",
      icon: <MapPin className="h-6 w-6" />,
      color: "from-indigo-500 to-blue-600",
      price: 599,
      originalPrice: 999,
      isPopular: false,
      features: ["Space Analysis", "Vastu Remedies", "Direction Guidance", "Room Layout"]
    },
    {
      id: "remedies",
      title: "Astrological Remedies",
      description: "Personalized remedies and solutions for various life challenges",
      icon: <Zap className="h-6 w-6" />,
      color: "from-red-500 to-pink-600",
      price: 349,
      originalPrice: 599,
      isPopular: false,
      features: ["Gemstone Recommendations", "Mantra Suggestions", "Ritual Guidance", "Yantra Advice"]
    }
  ];

  const advancedCalculation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/kp-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Advanced astrological analysis has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Calculation Error",
        description: error.message || "Failed to perform advanced analysis",
        variant: "destructive",
      });
    }
  });

  const handleAdvancedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.latitude || !formData.longitude) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Track advanced calculation usage
    trackEvent('advanced_calculation_submitted', 'astrology_tools', 'advanced_analysis');
    
    advancedCalculation.mutate(formData);
  };

  const result = advancedCalculation.data as AdvancedCalculationResult | undefined;

  return (
    <>
      <Helmet>
        <title>Free Astrology Tools | Vedic Calculators & Chart Analysis - AstroTick</title>
        <meta name="description" content="Free Astrology Tools - Access comprehensive Vedic astrology calculators including birth charts, compatibility analysis, and horoscope tools. Advanced astronomical algorithms for accurate predictions." />
        <meta name="keywords" content="free astrology tools, Vedic calculators, birth chart generator, horoscope tools, astrology calculators, compatibility analysis, free Vedic astrology" />
        <link rel="canonical" href="https://astrotick.com/astrology-tools" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Astrology Tools - AstroTick" />
        <meta property="og:description" content="Free Astrology Tools - Access comprehensive Vedic astrology calculators and advanced astronomical algorithms for accurate predictions." />
        <meta property="og:url" content="https://astrotick.com/astrology-tools" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Free Astrology Tools - AstroTick" />
        <meta name="twitter:description" content="Free Astrology Tools - Access comprehensive Vedic astrology calculators and advanced astronomical algorithms." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Astrology Tools",
            "description": "Comprehensive collection of free Vedic astrology calculators and analysis tools",
            "url": "https://astrotick.com/astrology-tools",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
        <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Free Astrology Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive astrological calculations and analysis tools powered by advanced astronomical algorithms
            </p>
          </div>

          {/* Service Cards with Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  activeTab === tool.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
              >
                {tool.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Popular
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setActiveTab(tool.id);
                      trackEvent('tool_selected', 'astrology_tools', tool.title);
                    }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center text-white`}>
                      {tool.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-center">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                      {tool.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{tool.price}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ₹{tool.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Save ₹{tool.originalPrice - tool.price} ({Math.round(((tool.originalPrice - tool.price) / tool.originalPrice) * 100)}% off)
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                      {tool.features.length > 3 && (
                        <li className="text-gray-500">
                          +{tool.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Purchase Button */}
                  <Button 
                    className="w-full text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const paymentUrl = `/payment?service=${encodeURIComponent(tool.id)}&packageName=${encodeURIComponent(tool.title)}&amount=${tool.price}&description=${encodeURIComponent(tool.description)}`;
                      window.location.href = paymentUrl;
                      trackEvent('service_purchase_initiated', 'astrology_tools', tool.title);
                    }}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Purchase Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tool Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="birth-chart">
              <BirthChartGenerator />
            </TabsContent>

            <TabsContent value="compatibility">
              <CompatibilityCalculator />
            </TabsContent>

            <TabsContent value="daily-horoscope">
              <DailyHoroscope />
            </TabsContent>

            <TabsContent value="advanced-calculations">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-indigo-600" />
                      Birth Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdvancedSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Time
                          </Label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="place" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Place
                        </Label>
                        <Input
                          id="place"
                          placeholder="City, Country"
                          value={formData.place}
                          onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            placeholder="13.0827"
                            value={formData.latitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            placeholder="80.2707"
                            value={formData.longitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={advancedCalculation.isPending}
                      >
                        {advancedCalculation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Calculating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Generate Advanced Analysis
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Results */}
                {result && (
                  <div className="space-y-6">
                    {/* Enhanced Analysis Results */}
                    {result.advancedAnalysis?.cuspalWealth && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Coins className="h-5 w-5 text-yellow-500" />
                            Wealth Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                              <span className="text-lg font-medium">
                                Level {result.advancedAnalysis.cuspalWealth.level}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {result.advancedAnalysis.cuspalWealth.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Planetary Cooperation */}
                    {result.advancedAnalysis?.panchangaGroup && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Planetary Cooperation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div 
                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(result.advancedAnalysis.panchangaGroup.groupStrength, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {result.advancedAnalysis.panchangaGroup.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.advancedAnalysis.panchangaGroup.cooperatingPlanets?.map((planet: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {planet}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* System Comparison */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Calculation Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Standard Ascendant</p>
                            <p>{result.comparison.standardAscendant.toFixed(2)}°</p>
                          </div>
                          <div>
                            <p className="font-medium">Enhanced Ascendant</p>
                            <p>{result.comparison.kpAscendant.toFixed(2)}°</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-medium">Precision Difference</p>
                            <p>{result.comparison.difference.toFixed(4)}°</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      </div>
    </>
  );
}