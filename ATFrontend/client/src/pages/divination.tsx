import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import BirthChartGenerator from "src/components/astrology/BirthChartGenerator";
import PalmistryAnalyzer from "src/components/astrology/PalmistryAnalyzer";
import NumerologyCalculator from "src/components/astrology/NumerologyCalculator";
import TarotReader from "src/components/astrology/TarotReader";
import { 
  Star, 
  Hand, 
  Calculator, 
  Sparkles, 
  Eye, 
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Compass,
  Moon,
  Sun,
  Zap
} from "lucide-react";

export default function Divination() {
  const [activeService, setActiveService] = useState("birth-chart");

  const services = [
    {
      id: "birth-chart",
      name: "Vedic Birth Chart",
      icon: <Star className="h-5 w-5" />,
      description: "Complete Kundali with planetary positions, houses, and KP system analysis",
      features: ["Precise planetary calculations", "KP cusp analysis", "Nakshatra predictions", "Visual chart generation"],
      accuracy: "Professional grade astronomical precision",
      price: 499,
      originalPrice: 799,
      isPopular: true
    },
    {
      id: "palmistry",
      name: "Palmistry Analysis", 
      icon: <Hand className="h-5 w-5" />,
      description: "Professional palm reading with major lines, mounts, and life guidance",
      features: ["Major line analysis", "Mount interpretations", "Career insights", "Health indicators"],
      accuracy: "Traditional palmistry methods with modern analysis",
      price: 299,
      originalPrice: 499,
      isPopular: false
    },
    {
      id: "numerology",
      name: "Numerology Profile",
      icon: <Calculator className="h-5 w-5" />,
      description: "Complete numerological analysis including life path, destiny, and personal year",
      features: ["Life path calculation", "Destiny number", "Personal year forecast", "Compatibility analysis"],
      accuracy: "Pythagorean and Chaldean number systems",
      price: 199,
      originalPrice: 399,
      isPopular: false
    },
    {
      id: "tarot",
      name: "Tarot Reading",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Mystical tarot guidance with multiple spreads and detailed interpretations",
      features: ["Multiple spread options", "Major Arcana focus", "Detailed interpretations", "Spiritual guidance"],
      accuracy: "Traditional tarot wisdom with intuitive insights",
      price: 349,
      originalPrice: 599,
      isPopular: true
    }
  ];

  const renderServiceContent = () => {
    switch (activeService) {
      case "birth-chart":
        return <BirthChartGenerator />;
      case "palmistry":
        return <PalmistryAnalyzer />;
      case "numerology":
        return <NumerologyCalculator />;
      case "tarot":
        return <TarotReader />;
      default:
        return <BirthChartGenerator />;
    }
  };

  const currentService = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional <span className="text-yellow-400">Divination</span> Services
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Discover your destiny through ancient wisdom and modern precision. 
            Complete astrological analysis with professional-grade calculations.
          </p>
          
          {/* Service Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">99.9%</div>
              <div className="text-xs text-purple-100">Calculation Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">27</div>
              <div className="text-xs text-purple-100">Nakshatras Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">78</div>
              <div className="text-xs text-purple-100">Tarot Cards</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">4+</div>
              <div className="text-xs text-purple-100">Divination Arts</div>
            </div>
          </div>
        </div>

        {/* Service Selection with Pricing */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  activeService === service.id
                    ? 'ring-2 ring-yellow-400 bg-white/20 backdrop-blur-md'
                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20'
                }`}
              >
                {service.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Popular
                  </div>
                )}
                
                <div 
                  className="cursor-pointer"
                  onClick={() => setActiveService(service.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto mb-2 p-3 rounded-full ${
                      activeService === service.id ? 'bg-yellow-400 text-purple-900' : 'bg-purple-600 text-white'
                    }`}>
                      {service.icon}
                    </div>
                    <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-purple-100 text-sm text-center mb-4">
                      {service.description}
                    </p>
                    
                    {/* Pricing */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-yellow-400">
                          ₹{service.price}
                        </span>
                        <span className="text-lg text-purple-300 line-through">
                          ₹{service.originalPrice}
                        </span>
                      </div>
                      <div className="text-xs text-green-400 font-medium">
                        Save ₹{service.originalPrice - service.price} ({Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% off)
                      </div>
                    </div>
                    
                    {/* Features Preview */}
                    <div className="space-y-1 mb-4">
                      {service.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-purple-200">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                          {feature}
                        </div>
                      ))}
                      {service.features.length > 2 && (
                        <div className="text-xs text-purple-300">
                          +{service.features.length - 2} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>

                {/* Purchase Button */}
                <div className="px-6 pb-6">
                  <button 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-semibold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const paymentUrl = `/payment?service=${encodeURIComponent(service.id)}&packageName=${encodeURIComponent(service.name)}&amount=${service.price}&description=${encodeURIComponent(service.description)}`;
                      window.location.href = paymentUrl;
                    }}
                  >
                    Purchase Service
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Service Details */}
        {currentService && (
          <div className="mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-yellow-400/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 text-purple-900 rounded-lg">
                      {currentService.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white">{currentService.name}</CardTitle>
                      <p className="text-purple-100 text-sm">{currentService.accuracy}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300">
                    Active Service
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Service Features:</h4>
                    <div className="space-y-2">
                      {currentService.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-purple-100 text-sm">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">What You'll Receive:</h4>
                    <div className="space-y-2 text-purple-100 text-sm">
                      {activeService === "birth-chart" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-yellow-400" />
                            Complete planetary analysis with degrees
                          </div>
                          <div className="flex items-center gap-2">
                            <Compass className="h-3 w-3 text-yellow-400" />
                            KP system house cusps and sub-lords
                          </div>
                          <div className="flex items-center gap-2">
                            <Moon className="h-3 w-3 text-yellow-400" />
                            Nakshatra positions and pada details
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-yellow-400" />
                            Downloadable chart in multiple formats
                          </div>
                        </>
                      )}
                      
                      {activeService === "palmistry" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-yellow-400" />
                            Major palm line analysis
                          </div>
                          <div className="flex items-center gap-2">
                            <Hand className="h-3 w-3 text-yellow-400" />
                            Mount development assessment
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-400" />
                            Special marks and their meanings
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-yellow-400" />
                            Life guidance and career insights
                          </div>
                        </>
                      )}
                      
                      {activeService === "numerology" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Calculator className="h-3 w-3 text-yellow-400" />
                            Core numerological profile
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-yellow-400" />
                            Personal year forecast
                          </div>
                          <div className="flex items-center gap-2">
                            <Compass className="h-3 w-3 text-yellow-400" />
                            Life path and destiny guidance
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-yellow-400" />
                            Compatibility analysis
                          </div>
                        </>
                      )}
                      
                      {activeService === "tarot" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                            Personalized card spread
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-yellow-400" />
                            Detailed card interpretations
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-yellow-400" />
                            Timing and outcome predictions
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-yellow-400" />
                            Spiritual guidance and advice
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Service Interface */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8">
          {renderServiceContent()}
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Precision Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 text-sm">
                Our calculations use Swiss Ephemeris precision with enhanced algorithms for 
                Indian coordinates, ensuring accuracy matching professional astrology software.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                Global Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 text-sm">
                Advanced geocoding system provides worldwide location accuracy with 
                OpenStreetMap integration for precise latitude and longitude coordinates.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                Traditional Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 text-sm">
                Combining ancient Vedic knowledge with modern computational precision for 
                authentic readings rooted in thousands of years of astrological tradition.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}