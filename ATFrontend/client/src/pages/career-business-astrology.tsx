import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { TrendingUp, Briefcase, Building, Star, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function CareerBusinessAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Career & Business Astrology
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Navigate your professional journey with planetary guidance. Discover ideal career paths, 
            business opportunities, and wealth accumulation patterns through authentic birth chart analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Career Expert
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => setLocation('/premium-report')}
            >
              Get Career Report
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Career Selection */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Briefcase className="h-8 w-8 text-emerald-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Career Path Selection</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Discover your ideal career based on planetary strengths and 10th house analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">10th House Analysis</h4>
                  <p className="text-gray-600 text-sm">Career house examination with planetary influences and professional destiny</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sun & Saturn Placement</h4>
                  <p className="text-gray-600 text-sm">Authority positions, government jobs, and leadership roles based on royal planets</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mercury & Jupiter Position</h4>
                  <p className="text-gray-600 text-sm">Communication skills, teaching, finance, and knowledge-based career opportunities</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Opportunities */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Building className="h-8 w-8 text-green-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Business Venture Analysis</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Optimal timing and partnership analysis for successful business ventures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mars & Rahu Influence</h4>
                  <p className="text-gray-600 text-sm">Entrepreneurial energy, risk-taking ability, and innovative business ideas</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Partnership Analysis</h4>
                  <p className="text-gray-600 text-sm">7th house examination for business partnerships and joint venture success</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Timing & Muhurat</h4>
                  <p className="text-gray-600 text-sm">Auspicious periods for business launch, investment, and expansion decisions</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Career Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Career Fields Based on Planetary Influence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sun Dominated</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Government Services</li>
                <li>• Administrative Roles</li>
                <li>• Politics & Leadership</li>
                <li>• Medical Profession</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Moon Influenced</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Psychology & Counseling</li>
                <li>• Hospitality Industry</li>
                <li>• Food & Beverage</li>
                <li>• Travel & Tourism</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mars Driven</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Engineering & Technology</li>
                <li>• Defense & Security</li>
                <li>• Sports & Athletics</li>
                <li>• Real Estate</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mercury Guided</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Communication & Media</li>
                <li>• Banking & Finance</li>
                <li>• Education & Training</li>
                <li>• Information Technology</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Jupiter Blessed</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Teaching & Academia</li>
                <li>• Law & Justice</li>
                <li>• Spiritual Guidance</li>
                <li>• Financial Advisory</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Venus Enhanced</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Arts & Entertainment</li>
                <li>• Fashion & Beauty</li>
                <li>• Luxury Goods</li>
                <li>• Interior Design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Wealth Indicators */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Wealth & Success Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dhana Yoga Analysis</h3>
              <ul className="space-y-3 text-gray-700 text-left">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-emerald-500 mr-3 mt-0.5" />
                  <span>2nd and 11th house lord connections</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-emerald-500 mr-3 mt-0.5" />
                  <span>Jupiter-Venus beneficial aspects</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-emerald-500 mr-3 mt-0.5" />
                  <span>Lakshmi Yoga planetary combinations</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Timing</h3>
              <ul className="space-y-3 text-gray-700 text-left">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Jupiter Mahadasha favorable periods</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>10th lord Antardasha for promotions</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Beneficial planet transits through career houses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Accelerate Your Career Growth?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get personalized career guidance and business insights with authentic Vedic astrology analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with Career Astrologer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => setLocation('/premium-report')}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Get Professional Report
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}