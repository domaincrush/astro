import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Zap, Star, Eye, Compass, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function SpiritualGrowthAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      <AstroTickHeader />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Spiritual Growth & Moksha
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Explore your spiritual journey through Vedic wisdom. Understand karmic patterns, 
            past life connections, and your path to enlightenment and liberation.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Karmic Lessons Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rahu-Ketu Axis</h4>
                  <p className="text-gray-600 text-sm">Past life karmas and soul's evolutionary journey</p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Saturn's Lessons</h4>
                  <p className="text-gray-600 text-sm">Discipline, patience, and spiritual maturity development</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Compass className="h-8 w-8 text-violet-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Moksha Potential</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">12th House Liberation</h4>
                  <p className="text-gray-600 text-sm">Spiritual liberation and transcendence indicators</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Jupiter's Blessings</h4>
                  <p className="text-gray-600 text-sm">Wisdom, knowledge, and spiritual guidance opportunities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Discover Your Spiritual Path?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Spiritual Guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}