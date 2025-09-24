import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Heart, Star, Users, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function LoveMarriageAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Love & Marriage Astrology
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Discover your romantic destiny through authentic Vedic astrology. Get accurate marriage timing, 
            compatibility analysis, and relationship predictions based on genuine planetary calculations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Love Expert
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-rose-600 text-rose-600 hover:bg-rose-50"
              onClick={() => setLocation('/kundli-matching')}
            >
              Check Compatibility
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Marriage Timing Analysis */}
            <Card className="border-rose-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-rose-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Marriage Timing Predictions</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Discover the most auspicious periods for marriage based on your birth chart analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">7th House Analysis</h4>
                  <p className="text-gray-600 text-sm">Detailed examination of marriage house, its lord, and planetary influences</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Venus & Jupiter Transit</h4>
                  <p className="text-gray-600 text-sm">Favorable periods when benefic planets support marriage opportunities</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Dasha Period Analysis</h4>
                  <p className="text-gray-600 text-sm">Mahadasha and Antardasha combinations conducive to marriage</p>
                </div>
              </CardContent>
            </Card>

            {/* Compatibility Analysis */}
            <Card className="border-pink-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-pink-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Kundli Matching & Compatibility</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Comprehensive compatibility analysis using traditional Vedic methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Ashtakoot Matching</h4>
                  <p className="text-gray-600 text-sm">36-point compatibility system analyzing mental, physical, and spiritual harmony</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mangal Dosha Check</h4>
                  <p className="text-gray-600 text-sm">Mars placement analysis and remedial measures for harmonious married life</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Navamsha Analysis</h4>
                  <p className="text-gray-600 text-sm">D9 chart examination for post-marriage happiness and compatibility</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Love vs Arranged Marriage */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Love Marriage vs Arranged Marriage Predictions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Love Marriage Indicators</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-rose-500 mr-3 mt-0.5" />
                  <span>Venus in 1st, 5th, 7th, or 11th house</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-rose-500 mr-3 mt-0.5" />
                  <span>Rahu influence on 5th or 7th house</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-rose-500 mr-3 mt-0.5" />
                  <span>Strong 5th house lord with benefic aspects</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-rose-500 mr-3 mt-0.5" />
                  <span>Mars-Venus conjunction in romantic houses</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Arranged Marriage Indicators</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <span>Jupiter strong influence on 7th house</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <span>Saturn's positive aspect on marriage house</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <span>7th lord in earthy signs with family planets</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <span>Moon in 4th house with parental blessings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Relationship Remedies */}
      <section className="py-16 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Relationship Harmony Remedies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Gemstone Therapy</h3>
              <p className="text-gray-600 text-sm">Diamond for Venus, Pearl for Moon, and Emerald for Mercury to enhance love and understanding</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mantras & Prayers</h3>
              <p className="text-gray-600 text-sm">Venus mantras, Goddess Parvati prayers, and couple-specific chanting for marital bliss</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Muhurat Selection</h3>
              <p className="text-gray-600 text-sm">Auspicious timing for engagement, marriage ceremonies, and important relationship decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Discover Your Love & Marriage Predictions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get personalized insights into your romantic life with authentic Vedic astrology analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat with Love Astrologer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-rose-600 text-rose-600 hover:bg-rose-50"
              onClick={() => setLocation('/premium-report')}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Get Love Report
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}