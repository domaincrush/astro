import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Shield, Heart, Brain, Activity, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function HealthMedicalAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <AstroTickHeader />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Health & Medical Astrology
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Understand your health patterns through medical astrology. Get insights into vulnerable body parts, 
            disease timing, and preventive measures based on authentic planetary positions.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Activity className="h-8 w-8 text-blue-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Body Parts & Planetary Mapping</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sun - Heart & Circulation</h4>
                  <p className="text-gray-600 text-sm">Cardiovascular health, blood pressure, and heart-related conditions</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Moon - Mind & Stomach</h4>
                  <p className="text-gray-600 text-sm">Mental health, digestive system, and emotional well-being</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Mars - Blood & Muscles</h4>
                  <p className="text-gray-600 text-sm">Blood disorders, muscular strength, and inflammatory conditions</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-cyan-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Disease Timing & Prevention</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">6th House Analysis</h4>
                  <p className="text-gray-600 text-sm">Disease house examination and health vulnerability periods</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Saturn Transit Effects</h4>
                  <p className="text-gray-600 text-sm">Chronic conditions and long-term health challenges</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Remedial Measures</h4>
                  <p className="text-gray-600 text-sm">Gemstones, mantras, and lifestyle changes for health improvement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Understand Your Health Patterns?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Health Astrologer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}